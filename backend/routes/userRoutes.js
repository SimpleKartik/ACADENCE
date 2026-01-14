const express = require('express');
const router = express.Router();
const { getMe, searchStudents } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/users/me
 * @desc    Get current authenticated user details
 * @access  Private (requires valid JWT)
 */
router.get('/me', authenticate, getMe);

/**
 * @route   GET /api/users/students/search
 * @desc    Search students (Admin only)
 * @access  Private (Admin only)
 */
router.get('/students/search', authenticate, authorize('admin'), searchStudents);

module.exports = router;
