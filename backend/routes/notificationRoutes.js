const express = require('express');
const router = express.Router();
const {
  broadcastNotification,
  getNotifications,
  markAsRead,
  getUnreadCount,
} = require('../controllers/notificationController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Broadcast notification (Teacher only)
 * @access  Private (Teacher only)
 */
router.post('/broadcast', authenticate, authorize('teacher'), broadcastNotification);

/**
 * @route   GET /api/notifications
 * @desc    Get notifications for current user
 * @access  Private (Student/Teacher)
 */
router.get('/', authenticate, getNotifications);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notification count
 * @access  Private (Student/Teacher)
 */
router.get('/unread-count', authenticate, getUnreadCount);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Student/Teacher)
 */
router.put('/:id/read', authenticate, markAsRead);

module.exports = router;
