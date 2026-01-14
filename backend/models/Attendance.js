const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Teacher is required'],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
      // Store only date part (without time)
      get: function (value) {
        if (value) {
          const date = new Date(value);
          date.setHours(0, 0, 0, 0);
          return date;
        }
        return value;
      },
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['present', 'absent'],
        message: 'Status must be either present or absent',
      },
      default: 'present',
    },
    qrSessionId: {
      type: String,
      required: [true, 'QR Session ID is required'],
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate attendance
// A student can only mark attendance once per subject per day
attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });

// Indexes for efficient queries
attendanceSchema.index({ teacher: 1, date: 1 });
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ subject: 1, date: 1 });
attendanceSchema.index({ qrSessionId: 1 });

// Pre-save hook to normalize date (remove time component)
attendanceSchema.pre('save', function (next) {
  if (this.date) {
    const date = new Date(this.date);
    date.setHours(0, 0, 0, 0);
    this.date = date;
  }
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
