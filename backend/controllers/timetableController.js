const Timetable = require('../models/Timetable');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

/**
 * Create Timetable Slot (Teacher only)
 * POST /api/timetable
 * 
 * Request Body:
 * {
 *   "subject": "Mathematics",
 *   "day": "Monday",
 *   "startTime": "10:00",
 *   "endTime": "11:00",
 *   "room": "A-101"
 * }
 */
const createTimetableSlot = async (req, res, next) => {
  try {
    const { subject, day, startTime, endTime, room } = req.body;
    const teacherId = req.user._id;

    // Validate required fields
    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required',
      });
    }

    if (!day || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(day)) {
      return res.status(400).json({
        success: false,
        message: 'Valid day is required (Monday-Saturday)',
      });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Start time and end time are required',
      });
    }

    if (!room || !room.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Room is required',
      });
    }

    // Validate time format
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Time must be in HH:mm format (24-hour)',
      });
    }

    // Create timetable slot
    const timetableSlot = await Timetable.create({
      teacher: teacherId,
      subject: subject.trim(),
      day,
      startTime,
      endTime,
      room: room.trim(),
    });

    await timetableSlot.populate('teacher', 'name email department');

    res.status(201).json({
      success: true,
      message: 'Timetable slot created successfully',
      data: {
        timetableSlot,
      },
    });
  } catch (error) {
    // Handle overlap validation errors
    if (error.message.includes('overlaps') || error.message.includes('End time must be after start time')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Update Timetable Slot (Teacher only)
 * PUT /api/timetable/:id
 */
const updateTimetableSlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;
    const { subject, day, startTime, endTime, room } = req.body;

    // Find the timetable slot
    const timetableSlot = await Timetable.findById(id);

    if (!timetableSlot) {
      return res.status(404).json({
        success: false,
        message: 'Timetable slot not found',
      });
    }

    // Check if teacher owns this slot
    if (timetableSlot.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own timetable slots',
      });
    }

    // Validate time format if provided
    if (startTime || endTime) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (startTime && !timeRegex.test(startTime)) {
        return res.status(400).json({
          success: false,
          message: 'Start time must be in HH:mm format (24-hour)',
        });
      }
      if (endTime && !timeRegex.test(endTime)) {
        return res.status(400).json({
          success: false,
          message: 'End time must be in HH:mm format (24-hour)',
        });
      }
    }

    // Update fields
    if (subject) timetableSlot.subject = subject.trim();
    if (day) timetableSlot.day = day;
    if (startTime) timetableSlot.startTime = startTime;
    if (endTime) timetableSlot.endTime = endTime;
    if (room) timetableSlot.room = room.trim();

    // Save will trigger pre-save validation
    await timetableSlot.save();
    await timetableSlot.populate('teacher', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Timetable slot updated successfully',
      data: {
        timetableSlot,
      },
    });
  } catch (error) {
    // Handle overlap validation errors
    if (error.message.includes('overlaps') || error.message.includes('End time must be after start time')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Delete Timetable Slot (Teacher only)
 * DELETE /api/timetable/:id
 */
const deleteTimetableSlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;

    // Find the timetable slot
    const timetableSlot = await Timetable.findById(id);

    if (!timetableSlot) {
      return res.status(404).json({
        success: false,
        message: 'Timetable slot not found',
      });
    }

    // Check if teacher owns this slot
    if (timetableSlot.teacher.toString() !== teacherId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own timetable slots',
      });
    }

    await Timetable.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Timetable slot deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Teacher's Timetable (Teacher only)
 * GET /api/timetable
 */
const getMyTimetable = async (req, res, next) => {
  try {
    const teacherId = req.user._id;

    const timetableSlots = await Timetable.find({ teacher: teacherId })
      .populate('teacher', 'name email department')
      .sort({ day: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      data: {
        timetableSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Student's Timetable (Student only)
 * GET /api/timetable/my
 * 
 * For now, returns all teachers' timetables
 * In future, can be filtered by enrolled subjects
 */
const getStudentTimetable = async (req, res, next) => {
  try {
    // Get all active teachers' timetables
    // In a real system, this would be filtered by student's enrolled subjects
    const timetableSlots = await Timetable.find()
      .populate('teacher', 'name email department')
      .sort({ day: 1, startTime: 1 });

    // Group by day
    const timetableByDay = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    };

    timetableSlots.forEach((slot) => {
      if (timetableByDay[slot.day]) {
        timetableByDay[slot.day].push(slot);
      }
    });

    // Sort each day's slots by start time
    Object.keys(timetableByDay).forEach((day) => {
      timetableByDay[day].sort((a, b) => {
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });
    });

    res.status(200).json({
      success: true,
      data: {
        timetable: timetableByDay,
        allSlots: timetableSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  getMyTimetable,
  getStudentTimetable,
};
