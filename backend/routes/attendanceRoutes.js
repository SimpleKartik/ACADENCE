const express = require('express');
const router = express.Router();
const {
  generateQR,
  markAttendance,
  getMyAttendance,
  getClassAttendance,
} = require('../controllers/attendanceController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * @route   POST /api/attendance/generate-qr
 * @desc    Generate QR code for attendance (Teacher only)
 * @access  Private (Teacher only)
 */
router.post('/generate-qr', authenticate, authorize('teacher'), generateQR);

/**
 * @route   POST /api/attendance/mark
 * @desc    Mark attendance by scanning QR (Student only)
 * @access  Private (Student only)
 */
router.post('/mark', authenticate, authorize('student'), markAttendance);

/**
 * @route   GET /api/attendance/my
 * @desc    Get student's own attendance records
 * @access  Private (Student only)
 */
router.get('/my', authenticate, authorize('student'), getMyAttendance);

/**
 * @route   GET /api/attendance/class
 * @desc    Get class attendance records (Teacher only)
 * @access  Private (Teacher only)
 */
router.get('/class', authenticate, authorize('teacher'), getClassAttendance);

module.exports = router;
