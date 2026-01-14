const express = require('express');
const router = express.Router();
const {
  getOverview,
  getAttendanceStats,
  getLibraryStats,
  getSystemActivity,
} = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/admin/overview
 * @desc    Get platform overview statistics (Admin only)
 * @access  Private (Admin only)
 */
router.get('/overview', authenticate, authorize('admin'), getOverview);

/**
 * @route   GET /api/admin/attendance-stats
 * @desc    Get attendance statistics (Admin only)
 * @access  Private (Admin only)
 */
router.get('/attendance-stats', authenticate, authorize('admin'), getAttendanceStats);

/**
 * @route   GET /api/admin/library-stats
 * @desc    Get library statistics (Admin only)
 * @access  Private (Admin only)
 */
router.get('/library-stats', authenticate, authorize('admin'), getLibraryStats);

/**
 * @route   GET /api/admin/system-activity
 * @desc    Get system activity (Admin only)
 * @access  Private (Admin only)
 */
router.get('/system-activity', authenticate, authorize('admin'), getSystemActivity);

module.exports = router;
