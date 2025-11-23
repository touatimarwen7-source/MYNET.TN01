/**
 * Unified Error Factory
 * All errors should be created using this factory to ensure consistency
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

const ErrorFactory = {
  // Validation Errors (400)
  validation: (message) => new AppError(message, 400, 'VALIDATION_ERROR'),
  
  // Not Found Errors (404)
  notFound: (message) => new AppError(message, 404, 'NOT_FOUND'),
  
  // Unauthorized Errors (401)
  unauthorized: (message) => new AppError(message, 401, 'UNAUTHORIZED'),
  
  // Forbidden Errors (403)
  forbidden: (message) => new AppError(message, 403, 'FORBIDDEN'),
  
  // Conflict Errors (409)
  conflict: (message) => new AppError(message, 409, 'CONFLICT'),
  
  // Server Errors (500)
  server: (message) => new AppError(message, 500, 'INTERNAL_ERROR'),
  
  // Database Errors (400)
  database: (message) => new AppError(message, 400, 'DATABASE_ERROR'),
  
  // Rate Limit (429)
  rateLimited: (message) => new AppError(message, 429, 'RATE_LIMITED'),
};

module.exports = { AppError, ErrorFactory };
