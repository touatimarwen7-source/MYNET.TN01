/**
 * 🛡️ useErrorHandler Hook
 * Centralized error handling for components
 */

import { useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { errorHandler } from '../utils/errorHandler';

export const useErrorHandler = () => {
  const { addToast } = useApp();

  const handleError = useCallback(
    (error, context = 'OPERATION') => {
      // Log error
      const errorInfo = errorHandler.logError(error, context);

      // Check if auth error
      if (errorHandler.isAuthError(error)) {
        errorHandler.handleAuthError();
        return;
      }

      // Get user-friendly message
      const userMessage = errorHandler.getUserMessage(error);

      // Show toast notification
      addToast(userMessage.message, userMessage.severity);

      return errorInfo;
    },
    [addToast]
  );

  const handleValidationError = useCallback(
    (errors) => {
      const formattedErrors = errorHandler.formatValidationErrors(errors);

      Object.entries(formattedErrors).forEach(([field, errorObj]) => {
        addToast(`${field}: ${errorObj.message}`, 'error');
      });

      return formattedErrors;
    },
    [addToast]
  );

  const retryOperation = useCallback(
    async (fn, maxRetries = 3) => {
      try {
        return await errorHandler.retry(fn, maxRetries);
      } catch (error) {
        handleError(error, 'RETRY_FAILED');
        throw error;
      }
    },
    [handleError]
  );

  return {
    handleError,
    handleValidationError,
    retryOperation,
    isRetryable: errorHandler.isRetryable,
    isAuthError: errorHandler.isAuthError,
  };
};

export default useErrorHandler;
