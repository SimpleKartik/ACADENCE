const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author cannot exceed 100 characters'],
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [1, 'Total copies must be at least 1'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, 'Available copies cannot be negative'],
      default: function () {
        return this.totalCopies;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ isbn: 1 });

// Pre-save validation to ensure availableCopies <= totalCopies
bookSchema.pre('save', function (next) {
  if (this.availableCopies > this.totalCopies) {
    return next(new Error('Available copies cannot exceed total copies'));
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
