const mongoose = require('mongoose');

const qrSessionSchema = new mongoose.Schema(
  {
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
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      // TTL index will auto-delete expired sessions
      expires: 0, // MongoDB will delete after expiresAt
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired sessions
qrSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for efficient queries
qrSessionSchema.index({ teacher: 1, isActive: 1 });
qrSessionSchema.index({ sessionId: 1, isActive: 1 });

// Method to check if session is expired
qrSessionSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

// Static method to clean up expired sessions (optional, TTL index handles this)
qrSessionSchema.statics.cleanupExpired = async function () {
  const now = new Date();
  await this.updateMany(
    { expiresAt: { $lt: now } },
    { $set: { isActive: false } }
  );
};

const QrSession = mongoose.model('QrSession', qrSessionSchema);

module.exports = QrSession;
