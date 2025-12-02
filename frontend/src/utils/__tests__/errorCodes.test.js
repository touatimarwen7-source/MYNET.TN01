import { describe, it, expect } from 'vitest';
import {
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  NETWORK_ERRORS,
  BUSINESS_ERRORS,
  FILE_ERRORS,
  SYSTEM_ERRORS,
  getErrorByCode,
  getErrorFromStatusCode,
  formatError,
} from '../errorCodes';

describe('Error Codes', () => {
  describe('Error Categories', () => {
    it('should have all authentication errors', () => {
      expect(AUTH_ERRORS.INVALID_CREDENTIALS).toBeDefined();
      expect(AUTH_ERRORS.INVALID_CREDENTIALS.code).toBe('A001');
      expect(AUTH_ERRORS.INVALID_CREDENTIALS.message).toBeDefined();
      expect(AUTH_ERRORS.INVALID_CREDENTIALS.message.length).toBeGreaterThan(0);
    });

    it('should have all validation errors', () => {
      expect(VALIDATION_ERRORS.INVALID_EMAIL).toBeDefined();
      expect(VALIDATION_ERRORS.INVALID_EMAIL.code).toBe('V001');
    });

    it('should have all network errors', () => {
      expect(NETWORK_ERRORS.NETWORK_TIMEOUT).toBeDefined();
      expect(NETWORK_ERRORS.NETWORK_TIMEOUT.code).toBe('N001');
    });

    it('should have all business errors', () => {
      expect(BUSINESS_ERRORS.TENDER_NOT_FOUND).toBeDefined();
      expect(BUSINESS_ERRORS.TENDER_NOT_FOUND.code).toBe('B001');
    });

    it('should have all file errors', () => {
      expect(FILE_ERRORS.FILE_TOO_LARGE).toBeDefined();
      expect(FILE_ERRORS.FILE_TOO_LARGE.code).toBe('F001');
    });

    it('should have all system errors', () => {
      expect(SYSTEM_ERRORS.INTERNAL_SERVER_ERROR).toBeDefined();
      expect(SYSTEM_ERRORS.INTERNAL_SERVER_ERROR.code).toBe('S001');
    });
  });

  describe('Error Severity Levels', () => {
    it('should have correct severity levels', () => {
      expect(['error', 'warning', 'info']).toContain(AUTH_ERRORS.INVALID_CREDENTIALS.severity);
      expect(['error', 'warning', 'info']).toContain(NETWORK_ERRORS.NETWORK_TIMEOUT.severity);
    });
  });

  describe('getErrorByCode', () => {
    it('should retrieve error by code', () => {
      const error = getErrorByCode('A001');

      expect(error).toBeDefined();
      expect(error.code).toBe('A001');
      expect(error.message).toBeDefined();
    });

    it('should return null for invalid code', () => {
      const error = getErrorByCode('INVALID');

      expect(error).toBeNull();
    });

    it('should find errors from all categories', () => {
      expect(getErrorByCode('A001')).toBeDefined();
      expect(getErrorByCode('V001')).toBeDefined();
      expect(getErrorByCode('N001')).toBeDefined();
      expect(getErrorByCode('B001')).toBeDefined();
      expect(getErrorByCode('F001')).toBeDefined();
      expect(getErrorByCode('S001')).toBeDefined();
    });
  });

  describe('getErrorFromStatusCode', () => {
    it('should map HTTP status to error code', () => {
      expect(getErrorFromStatusCode(400).code).toBe('A001');
      expect(getErrorFromStatusCode(401).code).toBe('A005');
      expect(getErrorFromStatusCode(404).code).toBe('B001');
      expect(getErrorFromStatusCode(429).code).toBe('N005');
      expect(getErrorFromStatusCode(500).code).toBe('S001');
    });

    it('should return default error for unmapped status', () => {
      const error = getErrorFromStatusCode(999);

      expect(error.code).toBe('S001');
    });
  });

  describe('formatError', () => {
    it('should format error object', () => {
      const error = new Error('Test error');
      const formatted = formatError(error);

      expect(formatted).toHaveProperty('code');
      expect(formatted).toHaveProperty('message');
      expect(formatted).toHaveProperty('severity');
    });

    it('should handle HTTP error response', () => {
      const error = { response: { status: 401 } };
      const formatted = formatError(error);

      expect(formatted.code).toBe('A005');
    });

    it('should handle string errors', () => {
      const formatted = formatError('Simple error message');

      expect(formatted.message).toBe('Simple error message');
    });

    it('should handle null/undefined errors', () => {
      const formatted = formatError(null);

      expect(formatted.message).toBeDefined();
      expect(formatted.severity).toBe('error');
    });
  });

  describe('French Messages', () => {
    it('all error messages should be defined', () => {
      const allErrors = [
        ...Object.values(AUTH_ERRORS),
        ...Object.values(VALIDATION_ERRORS),
        ...Object.values(NETWORK_ERRORS),
        ...Object.values(BUSINESS_ERRORS),
        ...Object.values(FILE_ERRORS),
        ...Object.values(SYSTEM_ERRORS),
      ];

      allErrors.forEach((error) => {
        expect(error.message).toBeDefined();
        expect(error.message.length).toBeGreaterThan(0);
      });
    });

    it('should not have Arabic characters', () => {
      const allErrors = [...Object.values(AUTH_ERRORS), ...Object.values(VALIDATION_ERRORS)];

      allErrors.forEach((error) => {
        expect(error.message).not.toMatch(/[\u0600-\u06FF]/);
      });
    });
  });
});
