/**
 * 🔒 ID VALIDATION MIDDLEWARE
 * Validates all ID parameters (id, tenderId, userId, supplierId, etc.)
 * Prevents undefined/null/invalid values from reaching handlers
 */

const validateIdMiddleware = (paramName = 'id') => {
  return (req, res, next) => {
    // Handle multiple parameter names
    const params = Array.isArray(paramName) ? paramName : [paramName];
    
    for (const param of params) {
      const value = req.params[param];
      
      // Check if parameter is missing or invalid
      if (!value || value === 'undefined' || value === 'null' || value === '') {
        return res.status(400).json({
          error: `Invalid or missing ${param} parameter`,
          received: value
        });
      }
      
      // Validate numeric IDs
      // Check if it's a UUID format (36 chars with hyphens)
      const isUUID = value && value.length === 36 && value.includes('-');
      
      if (isUUID) {
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
          return res.status(400).json({
            error: `Parameter ${param} must be a valid UUID`,
            received: value
          });
        }
      } else if (isNaN(parseInt(value))) {
        // Must be numeric if not UUID
        return res.status(400).json({
          error: `Parameter ${param} must be a valid number or UUID`,
          received: value
        });
      }
    }
    
    next();
  };
};

/**
 * Ensure req.user is properly set
 * Standardize user object to use req.user.id
 */
const normalizeUserMiddleware = (req, res, next) => {
  if (req.user) {
    // Standardize to use req.user.id
    if (!req.user.id && req.user.id) {
      req.user.id = req.user.id;
    }
    
    // Validate user has an ID
    if (!req.user.id) {
      return res.status(401).json({ error: 'User ID not found in token' });
    }
  }
  
  next();
};

module.exports = {
  validateIdMiddleware,
  normalizeUserMiddleware
};
