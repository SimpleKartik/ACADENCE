const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book is required'],
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Issued by is required'],
      index: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ISSUED', 'RETURNED', 'OVERDUE'],
        message: 'Status must be ISSUED, RETURNED, or OVERDUE',
      },
      default: 'ISSUED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
bookIssueSchema.index({ student: 1, status: 1 });
bookIssueSchema.index({ book: 1, status: 1 });
bookIssueSchema.index({ dueDate: 1, status: 1 });
bookIssueSchema.index({ student: 1, dueDate: 1 });

// Compound index for active issues
bookIssueSchema.index({ student: 1, book: 1, status: 1 });

// Method to check if book is overdue
bookIssueSchema.methods.isOverdue = function () {
  if (this.status === 'RETURNED') {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(this.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

// Method to calculate days left
bookIssueSchema.methods.getDaysLeft = function () {
  if (this.status === 'RETURNED') {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(this.dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const BookIssue = mongoose.model('BookIssue', bookIssueSchema);

module.exports = BookIssue;
