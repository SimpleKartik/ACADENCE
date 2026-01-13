const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');

/**
 * Student Login
 * POST /api/auth/student/login
 * 
 * Request Body:
 * {
 *   "email": "student@university.edu" OR
 *   "rollNumber": "STU001",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "token": "jwt-token-here",
 *     "user": { ... }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error (missing fields, invalid format)
 * - 401: Invalid credentials
 * - 500: Server error
 */
const studentLogin = async (req, res, next) => {
  try {
    const { email, rollNumber, password } = req.body;

    // Build query - email or rollNumber
    const query = { isActive: true };
    if (email) {
      query.email = email.toLowerCase().trim();
    } else if (rollNumber) {
      query.rollNumber = rollNumber.trim().toUpperCase();
    }

    // Find student with password field
    const student = await Student.findOne(query).select('+password');

    // User not found
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: {
          credentials: 'Email/Roll Number or password is incorrect',
        },
      });
    }

    // Verify password using bcrypt
    const isPasswordValid = await student.comparePassword(password);

    // Invalid password
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: {
          credentials: 'Email/Roll Number or password is incorrect',
        },
      });
    }

    // Generate JWT token
    const token = generateToken(student._id.toString(), student.role);

    // Prepare user data (password excluded via toJSON)
    const userData = student.toJSON();

    // Success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          rollNumber: userData.rollNumber,
          role: userData.role,
          department: userData.department,
          createdAt: userData.createdAt,
        },
      },
    });
  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
};

/**
 * Teacher Login
 * POST /api/auth/teacher/login
 * 
 * Request Body:
 * {
 *   "email": "teacher@university.edu",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "token": "jwt-token-here",
 *     "user": { ... }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error (missing fields, invalid format)
 * - 401: Invalid credentials
 * - 500: Server error
 */
const teacherLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find teacher with password field
    const teacher = await Teacher.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    }).select('+password');

    // User not found
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: {
          credentials: 'Email or password is incorrect',
        },
      });
    }

    // Verify password using bcrypt
    const isPasswordValid = await teacher.comparePassword(password);

    // Invalid password
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: {
          credentials: 'Email or password is incorrect',
        },
      });
    }

    // Generate JWT token
    const token = generateToken(teacher._id.toString(), teacher.role);

    // Prepare user data (password excluded via toJSON)
    const userData = teacher.toJSON();

    // Success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          cabinStatus: userData.cabinStatus,
          createdAt: userData.createdAt,
        },
      },
    });
  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
};

/**
 * Admin Login
 * POST /api/auth/admin/login
 * 
 * Request Body:
 * {
 *   "email": "admin@university.edu",
 *   "password": "password123"
 * }
 * 
 * Success Response (200):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "token": "jwt-token-here",
 *     "user": { ... }
 *   }
 * }
 * 
 * Error Responses:
 * - 400: Validation error (missing fields, invalid format)
 * - 401: Invalid credentials
 * - 500: Server error
 */
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find admin with password field
    const admin = await Admin.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    }).select('+password');

    // User not found
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: {
          credentials: 'Email or password is incorrect',
        },
      });
    }

    // Verify password using bcrypt
    const isPasswordValid = await admin.comparePassword(password);

    // Invalid password
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: {
          credentials: 'Email or password is incorrect',
        },
      });
    }

    // Generate JWT token
    const token = generateToken(admin._id.toString(), admin.role);

    // Prepare user data (password excluded via toJSON)
    const userData = admin.toJSON();

    // Success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
        },
      },
    });
  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
};

/**
 * Get current user (protected route)
 * GET /api/auth/me
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
    let user;

    // Find user based on role from token
    switch (req.user.role) {
      case 'student':
        user = await Student.findById(req.user._id);
        break;
      case 'teacher':
        user = await Teacher.findById(req.user._id);
        break;
      case 'admin':
        user = await Admin.findById(req.user._id);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user role',
        });
    }

    // User not found (shouldn't happen if token is valid)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    // Pass to error handler middleware
    next(error);
  }
};

module.exports = {
  studentLogin,
  teacherLogin,
  adminLogin,
  getMe,
};
