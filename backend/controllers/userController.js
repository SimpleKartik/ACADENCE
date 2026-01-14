const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

/**
 * Get current logged-in user details
 * GET /api/users/me
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "user": { ... }
 *   }
 * }
 * 
 * Error Responses:
 * - 401: Not authorized (no token or invalid token)
 * - 404: User not found
 * - 500: Server error
 */
const getMe = async (req, res, next) => {
  try {
    // User is already attached to req by authenticate middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Return user data (password already excluded by select('-password') in middleware)
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
};

/**
 * Search Students (Admin only)
 * GET /api/users/students/search
 */
const searchStudents = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const searchTerm = query.trim();
    const students = await Student.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { rollNumber: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    })
      .select('name email rollNumber department')
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        students,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  searchStudents,
};
