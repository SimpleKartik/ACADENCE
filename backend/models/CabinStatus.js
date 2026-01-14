const mongoose = require('mongoose');

const cabinStatusSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Teacher is required'],
      unique: true,
      index: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['AVAILABLE', 'BUSY', 'IN_CLASS'],
        message: 'Status must be AVAILABLE, BUSY, or IN_CLASS',
      },
      index: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
cabinStatusSchema.index({ status: 1, updatedAt: -1 });

// Pre-save hook to update updatedAt timestamp
cabinStatusSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const CabinStatus = mongoose.model('CabinStatus', cabinStatusSchema);

module.exports = CabinStatus;
