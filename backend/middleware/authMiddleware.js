const { verifyToken } = require('../utils/jwt');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

/**
 * JWT Authentication Middleware
 * Extracts token from Authorization header (Bearer token)
 * Verifies token using JWT_SECRET
 * Attaches decoded user info to req.user
 * Handles missing/invalid token with proper 401 responses
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. No token provided.',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

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
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Not authorized',
    });
  }
};

module.exports = authenticate;
