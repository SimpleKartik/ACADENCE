const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
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
      maxlength: [100, 'Subject cannot exceed 100 characters'],
    },
    day: {
      type: String,
      required: [true, 'Day is required'],
      enum: {
        values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        message: 'Day must be Monday through Saturday',
      },
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:mm format'],
    },
    room: {
      type: String,
      required: [true, 'Room is required'],
      trim: true,
      maxlength: [50, 'Room cannot exceed 50 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
timetableSchema.index({ teacher: 1, day: 1 });
timetableSchema.index({ teacher: 1, day: 1, startTime: 1 });
timetableSchema.index({ day: 1, startTime: 1 });

// Helper function to convert time string to minutes
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if two time slots overlap
const doSlotsOverlap = (start1, end1, start2, end2) => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  // Check if end time is before start time (invalid)
  if (end1Min <= start1Min || end2Min <= start2Min) {
    return true; // Invalid time range
  }

  // Check for overlap
  return start1Min < end2Min && start2Min < end1Min;
};

// Pre-save validation to prevent overlapping slots
timetableSchema.pre('save', async function (next) {
  // Validate that end time is after start time
  if (timeToMinutes(this.endTime) <= timeToMinutes(this.startTime)) {
    return next(new Error('End time must be after start time'));
  }

  // Check for overlapping slots for the same teacher on the same day
  const Timetable = mongoose.model('Timetable');
  const existingSlots = await Timetable.find({
    teacher: this.teacher,
    day: this.day,
    _id: { $ne: this._id }, // Exclude current document when updating
  });

  for (const slot of existingSlots) {
    if (
      doSlotsOverlap(
        this.startTime,
        this.endTime,
        slot.startTime,
        slot.endTime
      )
    ) {
      return next(
        new Error(
          `Time slot overlaps with existing class: ${slot.subject} (${slot.startTime} - ${slot.endTime})`
        )
      );
    }
  }

  next();
});

// Pre-update validation (for findOneAndUpdate, etc.)
timetableSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  const docToUpdate = await this.model.findOne(this.getQuery());

  if (!docToUpdate) {
    return next();
  }

  // Use update values if provided, otherwise use existing values
  const teacher = update.teacher ? update.teacher.toString() : docToUpdate.teacher.toString();
  const day = update.day || docToUpdate.day;
  const startTime = update.startTime || docToUpdate.startTime;
  const endTime = update.endTime || docToUpdate.endTime;

  // Validate that end time is after start time
  if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
    return next(new Error('End time must be after start time'));
  }

  // Check for overlapping slots
  const Timetable = mongoose.model('Timetable');
  const existingSlots = await Timetable.find({
    teacher: docToUpdate.teacher,
    day,
    _id: { $ne: docToUpdate._id },
  });

  for (const slot of existingSlots) {
    if (doSlotsOverlap(startTime, endTime, slot.startTime, slot.endTime)) {
      return next(
        new Error(
          `Time slot overlaps with existing class: ${slot.subject} (${slot.startTime} - ${slot.endTime})`
        )
      );
    }
  }

  next();
});

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
