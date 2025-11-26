/**
 * Unified Database Error Handler
 * Handles all database errors consistently
 */

const { logger } = require('./logger');
const ErrorResponseFormatter = require('./errorResponseFormatter');

class DatabaseErrorHandler {
  /**
   * Handle database error
   */
  static handle(error, context = {}) {
    logger.error('DATABASE_ERROR', {
      message: error.message,
      code: error.code,
      context
    });

    // Unique constraint violation
    if (error.code === 'P2002' || error.code === 'UNIQUE') {
      return {
        statusCode: 409,
        message: 'Record already exists',
        code: 'DUPLICATE_RECORD',
        field: context.field || 'unknown'
      };
    }

    // Record not found
    if (error.code === 'P2025' || error.code === 'NOT_FOUND') {
      return {
        statusCode: 404,
        message: context.resource ? `${context.resource} not found` : 'Record not found',
        code: 'NOT_FOUND'
      };
    }

    // Foreign key violation
    if (error.code === 'P2003' || error.code === 'FOREIGN_KEY') {
      return {
        statusCode: 400,
        message: 'Invalid reference',
        code: 'INVALID_REFERENCE',
        field: context.field || 'unknown'
      };
    }

    // Invalid input data
    if (error.code === 'P2014' || error.code === 'INVALID_DATA') {
      return {
        statusCode: 400,
        message: 'Invalid data provided',
        code: 'INVALID_DATA'
      };
    }

    // Connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'P1000') {
      return {
        statusCode: 503,
        message: 'Database connection failed',
        code: 'DATABASE_UNAVAILABLE'
      };
    }

    // Default database error
    return {
      statusCode: 500,
      message: 'Database operation failed',
      code: 'DATABASE_ERROR',
      ...(process.env.NODE_ENV !== 'production' && { details: error.message })
    };
  }

  /**
   * Wrap database operation with error handling
   */
  static async execute(operation, context = {}) {
    try {
      return await operation();
    } catch (error) {
      const handled = this.handle(error, context);
      const err = new Error(handled.message);
      err.statusCode = handled.statusCode;
      err.code = handled.code;
      if (handled.details) err.details = handled.details;
      throw err;
    }
  }

  /**
   * Safe query execution
   */
  static async query(queryFn, errorContext = {}) {
    try {
      return await queryFn();
    } catch (error) {
      const handled = this.handle(error, errorContext);
      const appError = new Error(handled.message);
      appError.statusCode = handled.statusCode || 500;
      appError.code = handled.code;
      throw appError;
    }
  }

  /**
   * Safe transaction
   */
  static async transaction(transactionFn, context = {}) {
    try {
      return await transactionFn();
    } catch (error) {
      logger.error('TRANSACTION_FAILED', {
        message: error.message,
        context
      });

      const handled = this.handle(error, context);
      const appError = new Error(handled.message);
      appError.statusCode = handled.statusCode || 500;
      appError.code = handled.code;
      throw appError;
    }
  }
}

module.exports = DatabaseErrorHandler;
