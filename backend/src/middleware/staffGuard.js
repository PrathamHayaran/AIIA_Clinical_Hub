/**
 * Staff Authorization Middleware
 * Ensures the authenticated user is a staff member (ADMIN, RESEARCHER, SAFETY_OFFICER, COMPLIANCE_OFFICER, MANAGEMENT)
 * and strictly prevents PATIENT users from accessing internal researcher or administrative endpoints.
 */
const staffGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Active user session required.',
    });
  }

  const staffRoles = ['ADMIN', 'RESEARCHER', 'SAFETY_OFFICER', 'COMPLIANCE_OFFICER', 'MANAGEMENT'];

  if (!staffRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. This module is restricted to authorized clinical research and administrative staff only.',
    });
  }

  next();
};

module.exports = staffGuard;
