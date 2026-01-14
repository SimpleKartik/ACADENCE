/**
 * Role-based Authorization Middleware
 * Accepts allowed roles as parameters
 * Blocks access if req.user.role is not allowed
 * Must be used after authenticate middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please authenticate first.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = authorize;
