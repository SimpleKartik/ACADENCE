const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');

/**
 * Get Platform Overview Statistics
 * GET /api/admin/overview
 */
const getOverview = async (req, res, next) => {
  try {
    // Get total counts
    const [totalStudents, totalTeachers, totalAdmins] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Teacher.countDocuments({ isActive: true }),
      Admin.countDocuments({ isActive: true }),
    ]);

    // Get active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [activeStudents, activeTeachers, activeAdmins] = await Promise.all([
      Student.countDocuments({
        isActive: true,
        updatedAt: { $gte: sevenDaysAgo },
      }),
      Teacher.countDocuments({
        isActive: true,
        updatedAt: { $gte: sevenDaysAgo },
      }),
      Admin.countDocuments({
        isActive: true,
        updatedAt: { $gte: sevenDaysAgo },
      }),
    ]);

    const totalActiveUsers = activeStudents + activeTeachers + activeAdmins;

    // Get notifications count
    const totalNotificationsSent = await Notification.countDocuments();

    // Get messages count (if messaging system exists)
    // For now, we'll set it to 0 or check if there's a Message model
    let totalMessagesSent = 0;
    try {
      const Message = require('../models/Message');
      totalMessagesSent = await Message.countDocuments();
    } catch (error) {
      // Message model doesn't exist, keep as 0
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        totalAdmins,
        totalActiveUsers,
        totalNotificationsSent,
        totalMessagesSent,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Attendance Statistics
 * GET /api/admin/attendance-stats
 */
const getAttendanceStats = async (req, res, next) => {
  try {
    // Get all students
    const students = await Student.find({ isActive: true }).select('_id name rollNumber department');

    // Calculate attendance for each student
    const attendanceData = await Promise.all(
      students.map(async (student) => {
        // Get total attendance records for this student
        const totalRecords = await Attendance.countDocuments({ student: student._id });

        // Get present records
        const presentRecords = await Attendance.countDocuments({
          student: student._id,
          status: 'present',
        });

        // Calculate percentage
        const percentage = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

        return {
          studentId: student._id,
          studentName: student.name,
          rollNumber: student.rollNumber,
          department: student.department,
          totalRecords,
          presentRecords,
          absentRecords: totalRecords - presentRecords,
          percentage: Math.round(percentage * 100) / 100,
        };
      })
    );

    // Calculate average attendance
    const validAttendances = attendanceData.filter((a) => a.totalRecords > 0);
    const averageAttendance =
      validAttendances.length > 0
        ? validAttendances.reduce((sum, a) => sum + a.percentage, 0) / validAttendances.length
        : 0;

    // Get students below 75%
    const studentsBelow75 = attendanceData.filter((a) => a.percentage < 75 && a.totalRecords > 0);

    // Subject-wise attendance summary
    const subjectStats = await Attendance.aggregate([
      {
        $group: {
          _id: '$subject',
          totalRecords: { $sum: 1 },
          presentRecords: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          subject: '$_id',
          totalRecords: 1,
          presentRecords: 1,
          absentRecords: { $subtract: ['$totalRecords', '$presentRecords'] },
          percentage: {
            $multiply: [
              { $divide: ['$presentRecords', '$totalRecords'] },
              100,
            ],
          },
        },
      },
      {
        $sort: { percentage: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        averageAttendance: Math.round(averageAttendance * 100) / 100,
        studentsBelow75: studentsBelow75.length,
        studentsBelow75Details: studentsBelow75.map((s) => ({
          name: s.studentName,
          rollNumber: s.rollNumber,
          department: s.department,
          attendancePercentage: s.percentage,
        })),
        subjectWiseSummary: subjectStats.map((s) => ({
          subject: s.subject,
          totalRecords: s.totalRecords,
          presentRecords: s.presentRecords,
          absentRecords: s.absentRecords,
          percentage: Math.round(s.percentage * 100) / 100,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Library Statistics
 * GET /api/admin/library-stats
 */
const getLibraryStats = async (req, res, next) => {
  try {
    // Get total books
    const totalBooks = await Book.countDocuments();

    // Get issued books count
    const issuedBooksCount = await BookIssue.countDocuments({
      status: { $in: ['ISSUED', 'OVERDUE'] },
    });

    // Get overdue books count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueBooksCount = await BookIssue.countDocuments({
      status: { $in: ['ISSUED', 'OVERDUE'] },
      dueDate: { $lt: today },
    });

    // Update overdue status
    await BookIssue.updateMany(
      {
        status: 'ISSUED',
        dueDate: { $lt: today },
      },
      {
        $set: { status: 'OVERDUE' },
      }
    );

    // Get top defaulters (students with most overdue books)
    const topDefaulters = await BookIssue.aggregate([
      {
        $match: {
          status: { $in: ['ISSUED', 'OVERDUE'] },
          dueDate: { $lt: today },
        },
      },
      {
        $group: {
          _id: '$student',
          overdueCount: { $sum: 1 },
        },
      },
      {
        $sort: { overdueCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      {
        $unwind: '$studentInfo',
      },
      {
        $project: {
          studentId: '$_id',
          studentName: '$studentInfo.name',
          rollNumber: '$studentInfo.rollNumber',
          email: '$studentInfo.email',
          overdueCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        issuedBooksCount,
        overdueBooksCount,
        topDefaulters: topDefaulters.map((d) => ({
          name: d.studentName,
          rollNumber: d.rollNumber,
          email: d.email,
          overdueCount: d.overdueCount,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get System Activity
 * GET /api/admin/system-activity
 */
const getSystemActivity = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent broadcasts (notifications)
    const recentBroadcasts = await Notification.find()
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title message receiverRole isImportant createdAt');

    // Get recent attendance sessions
    const recentAttendanceSessions = await Attendance.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            subject: '$subject',
            teacher: '$teacher',
          },
          studentCount: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] },
          },
          timestamp: { $max: '$timestamp' },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'teachers',
          localField: '_id.teacher',
          foreignField: '_id',
          as: 'teacherInfo',
        },
      },
      {
        $unwind: '$teacherInfo',
      },
      {
        $project: {
          date: '$_id.date',
          subject: '$_id.subject',
          teacherName: '$teacherInfo.name',
          teacherEmail: '$teacherInfo.email',
          studentCount: 1,
          presentCount: 1,
          absentCount: { $subtract: ['$studentCount', '$presentCount'] },
          timestamp: 1,
        },
      },
    ]);

    // Get recent logins (approximate from updatedAt)
    // This is a simplified approach - in production, you'd have a login log
    const recentLogins = await Promise.all([
      Student.find({ isActive: true })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('name email rollNumber updatedAt'),
      Teacher.find({ isActive: true })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('name email updatedAt'),
      Admin.find({ isActive: true })
        .sort({ updatedAt: -1 })
        .limit(5)
        .select('name email updatedAt'),
    ]);

    const allRecentLogins = [
      ...recentLogins[0].map((s) => ({
        name: s.name,
        email: s.email,
        rollNumber: s.rollNumber,
        role: 'student',
        lastActive: s.updatedAt,
      })),
      ...recentLogins[1].map((t) => ({
        name: t.name,
        email: t.email,
        role: 'teacher',
        lastActive: t.updatedAt,
      })),
      ...recentLogins[2].map((a) => ({
        name: a.name,
        email: a.email,
        role: 'admin',
        lastActive: a.updatedAt,
      })),
    ]
      .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
      .slice(0, limit);

    res.status(200).json({
      success: true,
      data: {
        recentBroadcasts: recentBroadcasts.map((b) => ({
          title: b.title,
          message: b.message,
          receiverRole: b.receiverRole,
          isImportant: b.isImportant,
          sender: b.sender ? { name: b.sender.name, email: b.sender.email } : null,
          createdAt: b.createdAt,
        })),
        recentAttendanceSessions,
        recentLogins: allRecentLogins.map((l) => ({
          name: l.name,
          email: l.email,
          rollNumber: l.rollNumber || null,
          role: l.role,
          lastActive: l.lastActive,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
  getAttendanceStats,
  getLibraryStats,
  getSystemActivity,
};
