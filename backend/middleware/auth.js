const { verifyToken } = require('../utils/jwt');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

/**
 * Middleware to protect routes - requires valid JWT
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from appropriate collection based on role
    let user;
    switch (decoded.role) {
      case 'student':
        user = await Student.findById(decoded.userId).select('-password');
        break;
      case 'teacher':
        user = await Teacher.findById(decoded.userId).select('-password');
        break;
      case 'admin':
        user = await Admin.findById(decoded.userId).select('-password');
        break;
      default:
        return res.status(401).json({
          success: false,
          message: 'Invalid user role in token',
        });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Not authorized',
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
