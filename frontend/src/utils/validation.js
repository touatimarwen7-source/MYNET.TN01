/**
 * Input Validation Utilities
 *
 * Features:
 * - Manual field validation functions (email, phone, numbers, etc)
 * - Zod schema definitions for form validation
 * - Error code mapping for validation failures
 * - XSS prevention with string sanitization
 *
 * @module validation
 * @requires zod - TypeScript-first schema validation
 */

import { z } from 'zod';

export const validation = {
  /**
   * Validate email format
   * @param {string} email - Email address to validate
   * @returns {boolean} True if valid email
   */
  isValidEmail: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 255;
  },

  /**
   * Validate international phone format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone
   */
  isValidPhone: (phone) => {
    const regex = /^[\d\s+\-()]{7,}$/;
    return regex.test(phone.trim());
  },

  /**
   * Validate number within range
   * @param {number|string} value - Value to validate
   * @param {number} min - Minimum value (default: 0)
   * @param {number} max - Maximum value (default: Infinity)
   * @returns {boolean} True if valid number in range
   */
  isValidNumber: (value, min = 0, max = Infinity) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  /**
   * Validate string length
   * @param {string} str - String to validate
   * @param {number} min - Minimum length (default: 1)
   * @param {number} max - Maximum length (default: 255)
   * @returns {boolean} True if valid length
   */
  isValidLength: (str, min = 1, max = 255) => {
    const trimmed = str.trim();
    return trimmed.length >= min && trimmed.length <= max;
  },

  /**
   * Validate date format
   * @param {string} dateString - Date string to validate
   * @returns {boolean} True if valid date
   */
  isValidDate: (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate file (size + type)
   * @param {File} file - File to validate
   * @param {number} maxSizeMB - Max file size in MB (default: 10)
   * @param {string[]} allowedTypes - Allowed MIME types (default: any)
   * @returns {boolean} True if valid file
   */
  isValidFile: (file, maxSizeMB = 10, allowedTypes = []) => {
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!file) return false;
    if (file.size > maxSize) return false;
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) return false;

    return true;
  },

  /**
   * Validate currency amount
   * @param {number|string} amount - Amount to validate
   * @param {number} maxAmount - Maximum amount (default: 999999999)
   * @returns {boolean} True if valid amount > 0
   */
  isValidAmount: (amount, maxAmount = 999999999) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= maxAmount;
  },

  /**
   * Sanitize string for XSS prevention
   * Escapes HTML special characters
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeString: (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  },

  // Validate form data
  validateFormData: (data, schema) => {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      if (rules.required && !value) {
        errors[field] = `${field} est requis`;
        continue;
      }

      if (rules.minLength && value?.length < rules.minLength) {
        errors[field] = `${field} doit contenir au moins ${rules.minLength} caractères`;
        continue;
      }

      if (rules.maxLength && value?.length > rules.maxLength) {
        errors[field] = `${field} ne peut pas dépasser ${rules.maxLength} caractères`;
        continue;
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        errors[field] = rules.message || `${field} est invalide`;
        continue;
      }

      if (rules.custom && !rules.custom(value)) {
        errors[field] = rules.message || `${field} est invalide`;
      }
    }

    return errors;
  },
};

// ============================================
// Zod Schema Definitions
// ============================================

export const LoginSchema = z.object({
  email: z.string().email("Le format de l'email est invalide").min(1, "L'email est obligatoire"),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir un chiffre'),
});

export const RegisterSchema = z
  .object({
    email: z.string().email("Le format de l'email est invalide"),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string(),
    companyName: z.string().min(2, 'Le nom de la société est obligatoire'),
    role: z.enum(['buyer', 'supplier']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const TenderSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  budget: z.number().positive(),
  deadline: z.string(),
  category: z.string().min(1),
});

/**
 * Validate data with Zod schema
 * Returns { success, data, errors }
 */
export const validateWithZod = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    if (error.errors) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});
      return { success: false, data: null, errors };
    }
    return { success: false, data: null, errors: { general: error.message } };
  }
};

export default validation;
