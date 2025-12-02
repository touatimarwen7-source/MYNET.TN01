/**
 * Input Sanitization Middleware
 * Prevents XSS, injection attacks, and data corruption
 */

const xss = require('xss');

/**
 * Sanitize string input against XSS
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return xss(str, {
    whiteList: {},
    stripIgnoredTag: true,
    stripLeakage: true,
    onTagAttr: (tag, name, value) => {
      return '';
    },
  });
}

/**
 * Sanitize object recursively
 */
function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj !== 'object') {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  return sanitized;
}

/**
 * Validate and sanitize input
 */
function validateAndSanitize(data, schema = {}) {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const result = {};

  for (const [key, value] of Object.entries(data)) {
    const fieldSchema = schema[key] || { type: 'string' };

    // Type validation
    if (fieldSchema.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        continue; // Skip invalid email
      }
      result[key] = sanitizeString(String(value));
    } else if (fieldSchema.type === 'number') {
      const num = Number(value);
      if (!isNaN(num)) {
        result[key] = num;
      }
    } else if (fieldSchema.type === 'boolean') {
      result[key] = Boolean(value);
    } else if (fieldSchema.type === 'url' && value) {
      try {
        new URL(String(value));
        result[key] = sanitizeString(String(value));
      } catch (e) {
        // Skip invalid URL
      }
    } else if (fieldSchema.maxLength && typeof value === 'string') {
      if (value.length > fieldSchema.maxLength) {
        result[key] = sanitizeString(value.substring(0, fieldSchema.maxLength));
      } else {
        result[key] = sanitizeString(value);
      }
    } else {
      result[key] = sanitizeObject(value);
    }
  }

  return result;
}

/**
 * Middleware to sanitize request body, query, and params
 */
function inputSanitizationMiddleware(req, res, next) {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Invalid input format',
        code: 'INVALID_INPUT',
      },
    });
  }
}

module.exports = {
  sanitizeString,
  sanitizeObject,
  validateAndSanitize,
  inputSanitizationMiddleware,
};
