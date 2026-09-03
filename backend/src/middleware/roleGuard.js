/**
 * Role-Based Access Control (RBAC) Middleware
 * Roles: ADMIN, RESEARCHER, SAFETY_OFFICER, COMPLIANCE_OFFICER, MANAGEMENT
 */
const roleGuard = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No active user session.',
      });
    }

    if (allowedRoles.length === 0) {
      return next();
    }

    // ADMIN always has full access
    if (req.user.role === 'ADMIN' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Your role (${req.user.role}) is not authorized to perform this operation.`,
    });
  };
};

module.exports = roleGuard;
