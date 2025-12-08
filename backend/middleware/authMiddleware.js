const AuthorizationGuard = require('../security/AuthorizationGuard');

// Main authentication middleware
const authMiddleware = AuthorizationGuard.authenticateToken.bind(AuthorizationGuard);

// Role-based access control middleware
const roleMiddleware = (allowedRoles) => {
  return AuthorizationGuard.requireRole(allowedRoles);
};

// Permission-based access control middleware
const permissionMiddleware = (requiredPermission) => {
  return AuthorizationGuard.requirePermission(requiredPermission);
};

// Export all middleware functions
module.exports = {
  authMiddleware,
  roleMiddleware,
  permissionMiddleware,
  verifyToken: AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
  checkRole: roleMiddleware,
  checkPermission: permissionMiddleware,
};

// Export as default function
module.exports = authMiddleware;

// Also export named for flexibility
module.exports.authMiddleware = authMiddleware;