const express = require('express');
const router = express.Router();
const {
  updateCabinStatus,
  getCabinStatuses,
  getMyCabinStatus,
} = require('../controllers/cabinStatusController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * @route   PUT /api/cabin-status
 * @desc    Update cabin status (Teacher only)
 * @access  Private (Teacher only)
 */
router.put('/', authenticate, authorize('teacher'), updateCabinStatus);

/**
 * @route   GET /api/cabin-status/me
 * @desc    Get current teacher's cabin status
 * @access  Private (Teacher only)
 */
router.get('/me', authenticate, authorize('teacher'), getMyCabinStatus);

/**
 * @route   GET /api/cabin-status
 * @desc    Get all cabin statuses (Student/Admin)
 * @access  Private (Student/Admin/Teacher)
 */
router.get('/', authenticate, getCabinStatuses);

module.exports = router;
