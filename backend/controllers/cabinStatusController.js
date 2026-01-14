const CabinStatus = require('../models/CabinStatus');
const Teacher = require('../models/Teacher');

/**
 * Update Cabin Status (Teacher only)
 * PUT /api/cabin-status
 * 
 * Request Body:
 * {
 *   "status": "AVAILABLE" | "BUSY" | "IN_CLASS",
 *   "note": "Optional note"
 * }
 */
const updateCabinStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const teacherId = req.user._id;

    // Validate status
    if (!status || !['AVAILABLE', 'BUSY', 'IN_CLASS'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be AVAILABLE, BUSY, or IN_CLASS',
      });
    }

    // Validate note length if provided
    if (note && note.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Note cannot exceed 500 characters',
      });
    }

    // Upsert cabin status
    const cabinStatus = await CabinStatus.findOneAndUpdate(
      { teacher: teacherId },
      {
        teacher: teacherId,
        status,
        note: note ? note.trim() : undefined,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate('teacher', 'name email department');

    // Also update the Teacher model's cabinStatus for backward compatibility
    // Map the new status values to old ones
    let teacherStatus = 'Offline';
    if (status === 'AVAILABLE') {
      teacherStatus = 'Available';
    } else if (status === 'BUSY' || status === 'IN_CLASS') {
      teacherStatus = 'Busy';
    }

    await Teacher.findByIdAndUpdate(teacherId, {
      cabinStatus: teacherStatus,
    });

    res.status(200).json({
      success: true,
      message: 'Cabin status updated successfully',
      data: {
        cabinStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Cabin Statuses (Student/Admin)
 * GET /api/cabin-status
 */
const getCabinStatuses = async (req, res, next) => {
  try {
    // Get all active teachers with their cabin status
    const teachers = await Teacher.find({ isActive: true })
      .select('name email department')
      .sort({ name: 1 });

    // Get cabin statuses for all teachers
    const cabinStatuses = await CabinStatus.find({
      teacher: { $in: teachers.map((t) => t._id) },
    }).populate('teacher', 'name email department');

    // Create a map of teacher ID to cabin status
    const statusMap = new Map();
    cabinStatuses.forEach((cs) => {
      statusMap.set(cs.teacher._id.toString(), cs);
    });

    // Combine teacher data with cabin status
    const teachersWithStatus = teachers.map((teacher) => {
      const cabinStatus = statusMap.get(teacher._id.toString());
      return {
        teacher: {
          _id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          department: teacher.department,
        },
        status: cabinStatus ? cabinStatus.status : 'OFFLINE',
        note: cabinStatus?.note || null,
        updatedAt: cabinStatus?.updatedAt || teacher.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        teachers: teachersWithStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Teacher's Cabin Status
 * GET /api/cabin-status/me
 */
const getMyCabinStatus = async (req, res, next) => {
  try {
    const teacherId = req.user._id;

    const cabinStatus = await CabinStatus.findOne({ teacher: teacherId }).populate(
      'teacher',
      'name email department'
    );

    if (!cabinStatus) {
      return res.status(200).json({
        success: true,
        data: {
          cabinStatus: null,
          message: 'No cabin status set yet',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        cabinStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateCabinStatus,
  getCabinStatuses,
  getMyCabinStatus,
};
