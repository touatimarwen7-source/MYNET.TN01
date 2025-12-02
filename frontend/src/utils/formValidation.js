/**
 * 🔧 FORM VALIDATION UTILITIES
 * Helper functions for form validation and error handling
 */

/**
 * Check if an email is valid
 */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Check if a password is strong
 */
export const isStrongPassword = (password) => {
  if (!password || password.length < 8) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

/**
 * Check if a phone number is valid
 */
export const isValidPhone = (phone) => {
  const pattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return pattern.test(phone);
};

/**
 * Check if a URL is valid
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0;
  return !value;
};

/**
 * Format validation errors from backend response
 */
export const formatBackendErrors = (error) => {
  const errors = {};

  if (error.response?.data?.validation) {
    // Validation errors from backend
    Object.entries(error.response.data.validation).forEach(([field, message]) => {
      errors[field] = Array.isArray(message) ? message[0] : message;
    });
  } else if (error.response?.data?.error?.details) {
    // Detailed errors
    Object.entries(error.response.data.error.details).forEach(([field, message]) => {
      errors[field] = message;
    });
  } else if (error.response?.data?.error) {
    // Simple error message - apply to general form error
    errors._global = error.response.data.error;
  }

  return errors;
};

/**
 * Check if form has errors
 */
export const hasFormErrors = (errors) => {
  return Object.values(errors).some((error) => error !== null && error !== '');
};

/**
 * Get first error message from form errors
 */
export const getFirstError = (errors) => {
  const errorArray = Object.values(errors).filter((e) => e);
  return errorArray.length > 0 ? errorArray[0] : null;
};

/**
 * Build form field props for TextField
 */
export const getFieldProps = (name, values, errors, touched, onChange, onBlur) => {
  return {
    name,
    value: values[name] || '',
    onChange,
    onBlur,
    error: touched?.[name] && !!errors?.[name],
    helperText: touched?.[name] ? errors?.[name] : '',
    fullWidth: true,
  };
};

/**
 * Sanitize form input
 */
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;

  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .slice(0, 5000); // Max length
};

/**
 * Normalize form data before submission
 */
export const normalizeFormData = (formData, schema) => {
  const normalized = {};

  Object.entries(formData).forEach(([key, value]) => {
    if (schema[key] === undefined) return; // Skip unknown fields

    // Sanitize string values
    if (typeof value === 'string') {
      normalized[key] = sanitizeInput(value);
    } else {
      normalized[key] = value;
    }
  });

  return normalized;
};

/**
 * Check for required fields in form
 */
export const checkRequiredFields = (values, requiredFields) => {
  const missing = [];

  requiredFields.forEach((field) => {
    if (!values[field] || values[field].toString().trim() === '') {
      missing.push(field);
    }
  });

  return missing;
};

export default {
  isValidEmail,
  isStrongPassword,
  isValidPhone,
  isValidURL,
  isFutureDate,
  isPastDate,
  isEmpty,
  formatBackendErrors,
  hasFormErrors,
  getFirstError,
  getFieldProps,
  sanitizeInput,
  normalizeFormData,
  checkRequiredFields,
};
