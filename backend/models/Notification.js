const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Sender is required'],
      refPath: 'senderModel',
      index: true,
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['Teacher', 'Admin'],
    },
    receiverRole: {
      type: String,
      required: [true, 'Receiver role is required'],
      enum: {
        values: ['student', 'teacher', 'all'],
        message: 'Receiver role must be student, teacher, or all',
      },
      index: true,
    },
    isImportant: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'readBy.userModel',
        },
        userModel: {
          type: String,
          enum: ['Student', 'Teacher', 'Admin'],
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
notificationSchema.index({ receiverRole: 1, createdAt: -1 });
notificationSchema.index({ sender: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, receiverRole: 1 });
notificationSchema.index({ isImportant: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

// Compound index for unread notifications by role
notificationSchema.index({ receiverRole: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
