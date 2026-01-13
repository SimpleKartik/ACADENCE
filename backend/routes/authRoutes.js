const express = require('express');
const router = express.Router();
const {
  studentLogin,
  teacherLogin,
  adminLogin,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateStudentLogin,
  validateTeacherLogin,
  validateAdminLogin,
} = require('../middleware/validator');

/**
 * @route   POST /api/auth/student/login
 * @desc    Student login (email OR rollNumber + password)
 * @access  Public
 */
router.post('/student/login', validateStudentLogin, studentLogin);

/**
 * @route   POST /api/auth/teacher/login
 * @desc    Teacher login (email + password)
 * @access  Public
 */
router.post('/teacher/login', validateTeacherLogin, teacherLogin);

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login (email + password)
 * @access  Public
 */
router.post('/admin/login', validateAdminLogin, adminLogin);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Private (requires valid JWT)
 */
router.get('/me', protect, getMe);

module.exports = router;
