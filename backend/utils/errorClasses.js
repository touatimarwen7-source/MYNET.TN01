/**
 * 🔥 CUSTOM ERROR CLASSES
 * Standardized error handling throughout the application
 */

/**
 * Base Application Error
 */
class AppError extends Error {
  constructor(message, statusCode = 500, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
        timestamp: this.timestamp
      }
    };
  }
}

/**
 * Validation Error (400)
 */
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error (401)
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', details = {}) {
    super(message, 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error (403)
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access denied', details = {}) {
    super(message, 403, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends AppError {
  constructor(resource, id = null) {
    const message = id 
      ? `${resource} with ID ${id} not found`
      : `${resource} not found`;
    super(message, 404, { resource, id });
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error (409)
 */
class ConflictError extends AppError {
  constructor(message, details = {}) {
    super(message, 409, details);
    this.name = 'ConflictError';
  }
}

/**
 * Rate Limit Error (429)
 */
class RateLimitError extends AppError {
  constructor(message, retryAfter = null) {
    super(message, 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

/**
 * Database Error (500)
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', originalError = null) {
    const details = originalError ? { originalMessage: originalError.message } : {};
    super(message, 500, details);
    this.name = 'DatabaseError';
  }
}

/**
 * File Error (400)
 */
class FileError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, details);
    this.name = 'FileError';
  }
}

/**
 * External Service Error (502)
 */
class ExternalServiceError extends AppError {
  constructor(service, message, details = {}) {
    const fullMessage = `${service} service error: ${message}`;
    super(fullMessage, 502, { service, ...details });
    this.name = 'ExternalServiceError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  FileError,
  ExternalServiceError
};
