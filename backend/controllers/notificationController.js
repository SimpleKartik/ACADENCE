const Notification = require('../models/Notification');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { sendBulkEmails } = require('../utils/sendEmail');

/**
 * Broadcast Notification (Teacher only)
 * POST /api/notifications/broadcast
 * 
 * Request Body:
 * {
 *   "title": "Announcement Title",
 *   "message": "Announcement message",
 *   "receiverRole": "student" | "teacher" | "all",
 *   "isImportant": true | false
 * }
 */
const broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, receiverRole, isImportant } = req.body;
    const senderId = req.user._id;
    const senderName = req.user.name;

    // Validate input
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    if (!receiverRole || !['student', 'teacher', 'all'].includes(receiverRole)) {
      return res.status(400).json({
        success: false,
        message: 'Receiver role must be student, teacher, or all',
      });
    }

    // Determine sender model
    const senderModel = req.user.role === 'teacher' ? 'Teacher' : 'Admin';

    // Create notification
    const notification = await Notification.create({
      title: title.trim(),
      message: message.trim(),
      sender: senderId,
      senderModel,
      receiverRole,
      isImportant: isImportant || false,
      isRead: false,
    });

    // If important, send email notifications (non-blocking)
    if (isImportant) {
      let recipients = [];

      if (receiverRole === 'student' || receiverRole === 'all') {
        const students = await Student.find({ isActive: true }).select('email');
        recipients.push(...students.map((s) => s.email));
      }

      if (receiverRole === 'teacher' || receiverRole === 'all') {
        const teachers = await Teacher.find({ isActive: true }).select('email');
        recipients.push(...teachers.map((t) => t.email));
      }

      // Remove duplicates and send emails in background
      const uniqueRecipients = [...new Set(recipients)];
      if (uniqueRecipients.length > 0) {
        sendBulkEmails(uniqueRecipients, {
          title: notification.title,
          message: notification.message,
          senderName,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Notification broadcasted successfully',
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Notifications
 * GET /api/notifications
 * 
 * Query Params:
 * - limit: Number of notifications to return (default: 50)
 * - skip: Number of notifications to skip (for pagination)
 * - unreadOnly: Return only unread notifications (true/false)
 */
const getNotifications = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const { limit = 50, skip = 0, unreadOnly = false } = req.query;

    // Build query based on user role
    const query = {
      $or: [
        { receiverRole: userRole },
        { receiverRole: 'all' },
      ],
    };

    // Filter by read status if requested
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    // Get notifications
    const notifications = await Notification.find(query)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Count total notifications
    const total = await Notification.countDocuments(query);

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: parseInt(skip) + notifications.length < total,
        },
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Notification as Read
 * PUT /api/notifications/:id/read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;
    const userModel = userRole === 'student' ? 'Student' : userRole === 'teacher' ? 'Teacher' : 'Admin';

    // Find notification
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Check if user is authorized to read this notification
    if (
      notification.receiverRole !== userRole &&
      notification.receiverRole !== 'all'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to read this notification',
      });
    }

    // Check if already read by this user
    const alreadyRead = notification.readBy.some(
      (read) => read.user.toString() === userId.toString()
    );

    if (alreadyRead) {
      return res.status(200).json({
        success: true,
        message: 'Notification already marked as read',
        data: {
          notification,
        },
      });
    }

    // Add user to readBy array
    notification.readBy.push({
      user: userId,
      userModel,
      readAt: new Date(),
    });

    // If all recipients have read, mark as read globally
    // For simplicity, we'll mark as read if at least one user has read it
    // In production, you might want to track per-user read status
    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Unread Count
 * GET /api/notifications/unread-count
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    const unreadCount = await Notification.countDocuments({
      $or: [
        { receiverRole: userRole },
        { receiverRole: 'all' },
      ],
      isRead: false,
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  broadcastNotification,
  getNotifications,
  markAsRead,
  getUnreadCount,
};
