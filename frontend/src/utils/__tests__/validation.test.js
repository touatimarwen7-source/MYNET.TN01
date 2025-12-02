import { describe, it, expect } from 'vitest';
import { validation, validateWithZod, LoginSchema, RegisterSchema } from '../validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(validation.isValidEmail('user@example.com')).toBe(true);
      expect(validation.isValidEmail('test.email@company.fr')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validation.isValidEmail('invalid.email')).toBe(false);
      expect(validation.isValidEmail('user@')).toBe(false);
      expect(validation.isValidEmail('user@.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate phone numbers', () => {
      expect(validation.isValidPhone('+33 1 23 45 67 89')).toBe(true);
      expect(validation.isValidPhone('0123456789')).toBe(true);
      expect(validation.isValidPhone('+1-202-555-0173')).toBe(true);
    });

    it('should reject invalid phone', () => {
      expect(validation.isValidPhone('123')).toBe(false);
      expect(validation.isValidPhone('')).toBe(false);
    });
  });

  describe('isValidNumber', () => {
    it('should validate numbers in range', () => {
      expect(validation.isValidNumber(5, 0, 10)).toBe(true);
      expect(validation.isValidNumber(0, 0, 10)).toBe(true);
      expect(validation.isValidNumber('15')).toBe(true);
    });

    it('should reject out of range numbers', () => {
      expect(validation.isValidNumber(15, 0, 10)).toBe(false);
      expect(validation.isValidNumber(-5, 0, 10)).toBe(false);
    });
  });

  describe('isValidLength', () => {
    it('should validate string length', () => {
      expect(validation.isValidLength('hello', 1, 10)).toBe(true);
      expect(validation.isValidLength('test', 2, 10)).toBe(true);
    });

    it('should reject invalid length', () => {
      expect(validation.isValidLength('', 1, 10)).toBe(false);
      expect(validation.isValidLength('toolongstring', 1, 5)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should validate date strings', () => {
      expect(validation.isValidDate('2024-01-01')).toBe(true);
      expect(validation.isValidDate(new Date().toISOString())).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(validation.isValidDate('invalid-date')).toBe(false);
      expect(validation.isValidDate('2024-13-01')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate URLs', () => {
      expect(validation.isValidUrl('https://example.com')).toBe(true);
      expect(validation.isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validation.isValidUrl('not a url')).toBe(false);
      expect(validation.isValidUrl('example.com')).toBe(false);
    });
  });

  describe('isValidFile', () => {
    it('should validate file size', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      expect(validation.isValidFile(file, 10)).toBe(true);
    });

    it('should reject oversized files', () => {
      const largeContent = new Array(15 * 1024 * 1024).fill('x').join('');
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      expect(validation.isValidFile(file, 10)).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should escape HTML characters', () => {
      const dangerous = '<script>alert("xss")</script>';
      const sanitized = validation.sanitizeString(dangerous);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;');
      expect(sanitized).toContain('&gt;');
    });

    it('should handle quotes', () => {
      const withQuotes = 'He said "hello"';
      const sanitized = validation.sanitizeString(withQuotes);

      expect(sanitized).toContain('&quot;');
    });
  });

  describe('Zod Schemas', () => {
    describe('LoginSchema', () => {
      it('should validate correct login credentials', () => {
        const validData = {
          email: 'user@example.com',
          password: 'SecurePass123',
        };

        const result = validateWithZod(LoginSchema, validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'SecurePass123',
        };

        const result = validateWithZod(LoginSchema, invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject weak password', () => {
        const weakData = {
          email: 'user@example.com',
          password: 'weak123',
        };

        const result = validateWithZod(LoginSchema, weakData);
        expect(result.success).toBe(false);
      });
    });

    describe('RegisterSchema', () => {
      it('should validate correct registration', () => {
        const validData = {
          email: 'newuser@example.com',
          password: 'SecurePass123',
          confirmPassword: 'SecurePass123',
          companyName: 'Test Company',
          role: 'buyer',
        };

        const result = validateWithZod(RegisterSchema, validData);
        expect(result.success).toBe(true);
      });

      it('should reject mismatched passwords', () => {
        const invalidData = {
          email: 'newuser@example.com',
          password: 'SecurePass123',
          confirmPassword: 'DifferentPass456',
          companyName: 'Test Company',
          role: 'buyer',
        };

        const result = validateWithZod(RegisterSchema, invalidData);
        expect(result.success).toBe(false);
      });
    });
  });
});
