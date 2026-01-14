const express = require('express');
const router = express.Router();
const {
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  getMyTimetable,
  getStudentTimetable,
} = require('../controllers/timetableController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * @route   POST /api/timetable
 * @desc    Create timetable slot (Teacher only)
 * @access  Private (Teacher only)
 */
router.post('/', authenticate, authorize('teacher'), createTimetableSlot);

/**
 * @route   GET /api/timetable
 * @desc    Get teacher's own timetable (Teacher only)
 * @access  Private (Teacher only)
 */
router.get('/', authenticate, authorize('teacher'), getMyTimetable);

/**
 * @route   PUT /api/timetable/:id
 * @desc    Update timetable slot (Teacher only)
 * @access  Private (Teacher only)
 */
router.put('/:id', authenticate, authorize('teacher'), updateTimetableSlot);

/**
 * @route   DELETE /api/timetable/:id
 * @desc    Delete timetable slot (Teacher only)
 * @access  Private (Teacher only)
 */
router.delete('/:id', authenticate, authorize('teacher'), deleteTimetableSlot);

/**
 * @route   GET /api/timetable/my
 * @desc    Get student's timetable (Student only)
 * @access  Private (Student only)
 */
router.get('/my', authenticate, authorize('student'), getStudentTimetable);

module.exports = router;
