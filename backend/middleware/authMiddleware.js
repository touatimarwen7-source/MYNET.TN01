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

/**
 * 🔒 Resource Ownership Verification Middleware
 * Prevents horizontal privilege escalation by checking resource ownership
 */
const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const resourceId = req.params.id || req.params.tenderId || req.params.offerId;

      if (!userId || !resourceId) {
        return res.status(400).json({
          success: false,
          error: 'User ID or Resource ID missing'
        });
      }

      const { getPool } = require('../config/db');
      const pool = getPool();

      let query;
      let params;

      switch (resourceType) {
        case 'tender':
          query = 'SELECT user_id FROM tenders WHERE id = $1';
          params = [resourceId];
          break;
        case 'offer':
          query = 'SELECT supplier_id FROM offers WHERE id = $1';
          params = [resourceId];
          break;
        case 'invoice':
          query = 'SELECT supplier_id FROM invoices WHERE id = $1';
          params = [resourceId];
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid resource type'
          });
      }

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Resource not found'
        });
      }

      const ownerId = result.rows[0].user_id || result.rows[0].supplier_id;

      // Admin can access all resources
      if (req.user.role === 'admin' || req.user.role === 'super_admin') {
        return next();
      }

      // Check ownership
      if (ownerId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: You do not own this resource'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error verifying ownership: ' + error.message
      });
    }
  };
};

// Export all middleware functions as named exports
module.exports = {
  authMiddleware,
  verifyToken: authMiddleware,
  roleMiddleware,
  checkRole: roleMiddleware,
  permissionMiddleware,
  checkPermission: permissionMiddleware,
  requireRole: roleMiddleware,
  requirePermission: permissionMiddleware,
  requireOwnership, // NEW: Ownership verification
};

// Also attach properties to default export for backward compatibility
module.exports.default = authMiddleware;
Object.assign(module.exports.default, module.exports);