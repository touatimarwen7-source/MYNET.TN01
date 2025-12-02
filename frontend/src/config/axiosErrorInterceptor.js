/**
 * 🔗 AXIOS ERROR INTERCEPTOR
 * Handles all API error responses with proper error codes and messages
 */

import { errorHandler } from '../utils/errorHandler';

/**
 * Setup axios error interceptor
 * @param {Object} axiosInstance - Axios instance
 * @param {Function} handleError - Error handler function
 */
export const setupErrorInterceptor = (axiosInstance, handleError) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Get error details
      const status = error.response?.status;
      const data = error.response?.data;
      const message = error.message;

      // Create error object with full context
      const errorContext = {
        status,
        data,
        message,
        isAuthError: errorHandler.isAuthError(error),
        isRetryable: errorHandler.isRetryable(error),
      };

      // Log error for debugging
      errorHandler.logError(error, `API_ERROR_${status}`);

      // Get user-friendly error
      const userError = errorHandler.getUserMessage(error);

      // Attach user-friendly message to error
      error.userMessage = userError.message;
      error.errorCode = userError.code;
      error.severity = userError.severity;

      // Pass to error handler if provided
      if (handleError && typeof handleError === 'function') {
        handleError(error, errorContext);
      }

      return Promise.reject(error);
    }
  );
};

export default setupErrorInterceptor;
