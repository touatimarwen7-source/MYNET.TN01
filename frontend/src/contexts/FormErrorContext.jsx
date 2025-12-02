import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Centralized error handling context for forms
 * Ensures consistent error display and management across all forms
 */
const FormErrorContext = createContext();

export const useFormError = () => {
  const context = useContext(FormErrorContext);
  if (!context) {
    throw new Error('useFormError must be used within FormErrorProvider');
  }
  return context;
};

export const FormErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  // Set error for specific field
  const setFieldError = useCallback((fieldName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  // Clear error for specific field
  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  }, []);

  // Set multiple field errors
  const setFieldErrors = useCallback((errorMap) => {
    setErrors((prev) => ({
      ...prev,
      ...errorMap,
    }));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setGlobalError('');
  }, []);

  // Parse API error response
  const handleAPIError = useCallback(
    (error) => {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Une erreur est survenue';

      setGlobalError(errorMsg);

      // If validation errors object exists, set field errors
      if (
        error.response?.data?.errors &&
        typeof error.response.data.errors === 'object'
      ) {
        setFieldErrors(error.response.data.errors);
      }

      return errorMsg;
    },
    [setFieldErrors]
  );

  // Set global error message
  const setGlobal = useCallback((message) => {
    setGlobalError(message);
  }, []);

  // Clear global error
  const clearGlobal = useCallback(() => {
    setGlobalError('');
  }, []);

  const value = {
    // State
    errors,
    globalError,

    // Field error handlers
    setFieldError,
    clearFieldError,
    setFieldErrors,

    // Global handlers
    setGlobal,
    clearGlobal,

    // Utility
    clearAllErrors,
    handleAPIError,

    // Check if field has error
    hasFieldError: (fieldName) => !!errors[fieldName],
    getFieldError: (fieldName) => errors[fieldName] || '',
  };

  return (
    <FormErrorContext.Provider value={value}>
      {children}
    </FormErrorContext.Provider>
  );
};
