const express = require('express');
const router = express.Router();
const {
  createBook,
  updateBook,
  getAllBooks,
  issueBook,
  returnBook,
  getMyBooks,
  getAllIssues,
  triggerReminders,
} = require('../controllers/libraryController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * @route   POST /api/library/books
 * @desc    Create new book (Admin only)
 * @access  Private (Admin only)
 */
router.post('/books', authenticate, authorize('admin'), createBook);

/**
 * @route   PUT /api/library/books/:id
 * @desc    Update book (Admin only)
 * @access  Private (Admin only)
 */
router.put('/books/:id', authenticate, authorize('admin'), updateBook);

/**
 * @route   GET /api/library/books
 * @desc    Get all books (Admin only)
 * @access  Private (Admin only)
 */
router.get('/books', authenticate, authorize('admin'), getAllBooks);

/**
 * @route   POST /api/library/issue
 * @desc    Issue book to student (Admin only)
 * @access  Private (Admin only)
 */
router.post('/issue', authenticate, authorize('admin'), issueBook);

/**
 * @route   POST /api/library/return
 * @desc    Return book (Admin only)
 * @access  Private (Admin only)
 */
router.post('/return', authenticate, authorize('admin'), returnBook);

/**
 * @route   GET /api/library/issues
 * @desc    Get all book issues (Admin only)
 * @access  Private (Admin only)
 */
router.get('/issues', authenticate, authorize('admin'), getAllIssues);

/**
 * @route   POST /api/library/send-reminders
 * @desc    Trigger email reminders (Admin only)
 * @access  Private (Admin only)
 */
router.post('/send-reminders', authenticate, authorize('admin'), triggerReminders);

/**
 * @route   GET /api/library/my-books
 * @desc    Get student's issued books (Student only)
 * @access  Private (Student only)
 */
router.get('/my-books', authenticate, authorize('student'), getMyBooks);

module.exports = router;
