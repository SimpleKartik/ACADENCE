const Attendance = require('../models/Attendance');
const QrSession = require('../models/QrSession');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate QR Code for Attendance
 * POST /api/attendance/generate-qr
 * Access: Teacher only
 * 
 * Request Body:
 * {
 *   "subject": "Mathematics"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "sessionId": "uuid-here",
 *     "qrCode": "data:image/png;base64,...",
 *     "expiresAt": "2024-01-15T10:05:00.000Z",
 *     "expiresIn": 300
 *   }
 * }
 */
const generateQR = async (req, res, next) => {
  try {
    const { subject } = req.body;
    const teacherId = req.user._id;

    // Validate input
    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required',
      });
    }

    // Generate session ID
    const sessionId = uuidv4();

    // Set expiry time (3 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 3);

    // Create QR session
    const qrSession = await QrSession.create({
      teacher: teacherId,
      subject: subject.trim(),
      sessionId,
      expiresAt,
      isActive: true,
    });

    // Generate QR code data URL
    const qrData = {
      sessionId,
      subject: subject.trim(),
      teacherId: teacherId.toString(),
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 1,
    });

    // Calculate expiry time in seconds
    const expiresIn = Math.floor((expiresAt - new Date()) / 1000);

    res.status(200).json({
      success: true,
      data: {
        sessionId,
        qrCode: qrCodeDataURL,
        expiresAt,
        expiresIn,
        subject: subject.trim(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Attendance by Scanning QR
 * POST /api/attendance/mark
 * Access: Student only
 * 
 * Request Body:
 * {
 *   "sessionId": "uuid-here"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Attendance marked successfully",
 *   "data": {
 *     "attendance": { ... }
 *   }
 * }
 */
const markAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const studentId = req.user._id;

    // Validate input
    if (!sessionId || !sessionId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    // Find active QR session
    const qrSession = await QrSession.findOne({
      sessionId: sessionId.trim(),
      isActive: true,
    }).populate('teacher', 'name email department');

    if (!qrSession) {
      return res.status(404).json({
        success: false,
        message: 'QR session not found or inactive',
      });
    }

    // Check if session is expired
    if (qrSession.isExpired()) {
      // Mark session as inactive
      await QrSession.findByIdAndUpdate(qrSession._id, { isActive: false });
      
      return res.status(400).json({
        success: false,
        message: 'QR code has expired. Please ask your teacher to generate a new one.',
      });
    }

    // Check if student has already marked attendance for this subject today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      student: studentId,
      subject: qrSession.subject,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'You have already marked attendance for this subject today',
        data: {
          existingAttendance: {
            timestamp: existingAttendance.timestamp,
            status: existingAttendance.status,
          },
        },
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      student: studentId,
      teacher: qrSession.teacher._id,
      subject: qrSession.subject,
      date: today,
      timestamp: new Date(),
      status: 'present',
      qrSessionId: qrSession.sessionId,
    });

    // Populate student and teacher details
    await attendance.populate('student', 'name email rollNumber');
    await attendance.populate('teacher', 'name email department');

    res.status(200).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        attendance,
      },
    });
  } catch (error) {
    // Handle duplicate key error (unique index violation)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already marked attendance for this subject today',
      });
    }
    next(error);
  }
};

/**
 * Get Student's Own Attendance
 * GET /api/attendance/my
 * Access: Student only
 * 
 * Query Params:
 * - subject (optional): Filter by subject
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "overview": {
 *       "totalClasses": 20,
 *       "attendedClasses": 18,
 *       "attendancePercentage": 90
 *     },
 *     "subjectWise": [
 *       {
 *         "subject": "Mathematics",
 *         "totalClasses": 10,
 *         "attendedClasses": 9,
 *         "attendancePercentage": 90
 *       }
 *     ]
 *   }
 * }
 */
const getMyAttendance = async (req, res, next) => {
  try {
    const studentId = req.user._id;
    const { subject } = req.query;

    // Build query
    const query = { student: studentId };
    if (subject) {
      query.subject = subject.trim();
    }

    // Get all attendance records
    const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

    // Calculate overall statistics
    const totalClasses = attendanceRecords.length;
    const attendedClasses = attendanceRecords.filter(
      (record) => record.status === 'present'
    ).length;
    const attendancePercentage =
      totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    // Calculate subject-wise statistics
    const subjectMap = {};
    attendanceRecords.forEach((record) => {
      if (!subjectMap[record.subject]) {
        subjectMap[record.subject] = {
          subject: record.subject,
          totalClasses: 0,
          attendedClasses: 0,
        };
      }
      subjectMap[record.subject].totalClasses++;
      if (record.status === 'present') {
        subjectMap[record.subject].attendedClasses++;
      }
    });

    const subjectWise = Object.values(subjectMap).map((item) => ({
      ...item,
      attendancePercentage:
        item.totalClasses > 0
          ? Math.round((item.attendedClasses / item.totalClasses) * 100)
          : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalClasses,
          attendedClasses,
          attendancePercentage,
        },
        subjectWise,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Class Attendance (Teacher View)
 * GET /api/attendance/class
 * Access: Teacher only
 * 
 * Query Params:
 * - subject (optional): Filter by subject
 * - date (optional): Filter by date (YYYY-MM-DD format)
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "summary": {
 *       "totalStudents": 50,
 *       "presentCount": 45,
 *       "absentCount": 5
 *     },
 *     "attendance": [
 *       {
 *         "date": "2024-01-15",
 *         "subject": "Mathematics",
 *         "presentCount": 45,
 *         "absentCount": 5,
 *         "students": [
 *           {
 *             "student": { ... },
 *             "status": "present",
 *             "timestamp": "..."
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 */
const getClassAttendance = async (req, res, next) => {
  try {
    const teacherId = req.user._id;
    const { subject, date } = req.query;

    // Build query
    const query = { teacher: teacherId };
    if (subject) {
      query.subject = subject.trim();
    }
    if (date) {
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: filterDate, $lt: nextDay };
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .populate('student', 'name email rollNumber department')
      .sort({ date: -1, timestamp: -1 });

    // Group by date and subject
    const groupedByDate = {};
    attendanceRecords.forEach((record) => {
      const dateKey = record.date.toISOString().split('T')[0];
      const key = `${dateKey}_${record.subject}`;

      if (!groupedByDate[key]) {
        groupedByDate[key] = {
          date: dateKey,
          subject: record.subject,
          presentCount: 0,
          absentCount: 0,
          students: [],
        };
      }

      if (record.status === 'present') {
        groupedByDate[key].presentCount++;
      } else {
        groupedByDate[key].absentCount++;
      }

      groupedByDate[key].students.push({
        student: record.student,
        status: record.status,
        timestamp: record.timestamp,
      });
    });

    const attendance = Object.values(groupedByDate);

    // Calculate summary
    const totalStudents = attendance.reduce(
      (sum, item) => sum + item.presentCount + item.absentCount,
      0
    );
    const presentCount = attendance.reduce(
      (sum, item) => sum + item.presentCount,
      0
    );
    const absentCount = attendance.reduce(
      (sum, item) => sum + item.absentCount,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalStudents,
          presentCount,
          absentCount,
        },
        attendance,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQR,
  markAttendance,
  getMyAttendance,
  getClassAttendance,
};
