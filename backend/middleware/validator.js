/**
 * Input validation middleware
 */

const validateStudentLogin = (req, res, next) => {
  const { email, rollNumber, password } = req.body;

  // Password is always required
  if (!password || password.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
      errors: {
        password: 'Password field cannot be empty',
      },
    });
  }

  // Email or rollNumber must be provided
  if (!email && !rollNumber) {
    return res.status(400).json({
      success: false,
      message: 'Email or Roll Number is required',
      errors: {
        email: 'Either email or rollNumber must be provided',
        rollNumber: 'Either email or rollNumber must be provided',
      },
    });
  }

  // Validate email format if provided
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
      errors: {
        email: 'Please provide a valid email address',
      },
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      errors: {
        password: 'Password must be at least 6 characters long',
      },
    });
  }

  next();
};

const validateTeacherLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
      errors: {
        email: 'Email field cannot be empty',
      },
    });
  }

  if (!password || password.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
      errors: {
        password: 'Password field cannot be empty',
      },
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
      errors: {
        email: 'Please provide a valid email address',
      },
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      errors: {
        password: 'Password must be at least 6 characters long',
      },
    });
  }

  next();
};

const validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
      errors: {
        email: 'Email field cannot be empty',
      },
    });
  }

  if (!password || password.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
      errors: {
        password: 'Password field cannot be empty',
      },
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
      errors: {
        email: 'Please provide a valid email address',
      },
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
      errors: {
        password: 'Password must be at least 6 characters long',
      },
    });
  }

  next();
};

module.exports = {
  validateStudentLogin,
  validateTeacherLogin,
  validateAdminLogin,
};
