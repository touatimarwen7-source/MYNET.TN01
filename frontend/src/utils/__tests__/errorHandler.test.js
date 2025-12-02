import { describe, it, expect, beforeEach, vi } from 'vitest';
import { errorHandler } from '../errorHandler';

describe('Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserMessage', () => {
    it('should return formatted error object', () => {
      const error = new Error('Network timeout');
      const result = errorHandler.getUserMessage(error);

      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('severity');
    });

    it('should return user-friendly message for HTTP error', () => {
      const error = { response: { status: 401 } };
      const result = errorHandler.getUserMessage(error);

      expect(result.code).toBe('A005');
      expect(result.severity).toBe('error');
    });

    it('should handle error with custom message', () => {
      const error = new Error('Custom error message');
      const defaultMsg = 'Default message';
      const result = errorHandler.getUserMessage(error, defaultMsg);

      expect(result).toBeDefined();
      expect(result.message).toBeDefined();
    });
  });

  describe('formatValidationErrors', () => {
    it('should format validation errors with codes', () => {
      const errors = {
        email: 'Invalid email format',
        password: 'Password too short',
      };
      const result = errorHandler.formatValidationErrors(errors);

      expect(result.email).toHaveProperty('code');
      expect(result.email).toHaveProperty('message');
      expect(result.password).toHaveProperty('code');
    });

    it('should handle empty errors object', () => {
      const errors = {};
      const result = errorHandler.formatValidationErrors(errors);

      expect(result).toEqual({});
    });
  });

  describe('isAuthError', () => {
    it('should identify auth errors correctly', () => {
      const authError = { response: { status: 401 } };
      const notAuthError = { response: { status: 404 } };

      expect(errorHandler.isAuthError(authError)).toBe(true);
      expect(errorHandler.isAuthError(notAuthError)).toBe(false);
    });
  });

  describe('isRetryable', () => {
    it('should identify retryable errors', () => {
      const timeoutError = { code: 'ECONNABORTED' };
      const badRequestError = { response: { status: 400 } };

      expect(errorHandler.isRetryable(timeoutError)).toBe(true);
      expect(errorHandler.isRetryable(badRequestError)).toBe(false);
    });
  });

  describe('handle (Go-style error handling)', () => {
    it('should handle successful promise', async () => {
      const successPromise = Promise.resolve({ data: 'success' });
      const [error, data] = await errorHandler.handle(successPromise);

      expect(error).toBeNull();
      expect(data.data).toBe('success');
    });

    it('should handle failed promise', async () => {
      const failedPromise = Promise.reject(new Error('Failed'));
      const [error, data] = await errorHandler.handle(failedPromise);

      expect(error).toBeDefined();
      expect(data).toBeNull();
    });
  });

  describe('retry with exponential backoff', () => {
    it('should execute function successfully on first try', async () => {
      const mockFn = vi.fn(async () => 'success');

      const result = await errorHandler.retry(mockFn, 3, 10);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalled();
    });

    it('should handle immediate success', async () => {
      const mockFn = vi.fn(async () => 'immediate success');

      const result = await errorHandler.retry(mockFn, 1, 10);

      expect(result).toBe('immediate success');
    });
  });
});
