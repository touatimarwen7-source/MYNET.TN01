import { describe, it, expect, beforeEach, vi } from 'vitest';
import TokenManager from '../tokenManager';

describe('Token Manager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Token Storage', () => {
    it('should set and get access token', () => {
      const token = 'test-token-12345';
      TokenManager.setAccessToken(token);

      expect(TokenManager.getAccessToken()).toBe(token);
    });

    it('should set token with expiry', () => {
      const token = 'test-token';
      const expiresIn = 900;

      TokenManager.setAccessToken(token, expiresIn);

      expect(TokenManager.getAccessToken()).toBe(token);
    });

    it('should return null for expired token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, -1);

      expect(TokenManager.getAccessToken()).toBeNull();
    });
  });

  describe('Token Validation', () => {
    it('should validate active token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, 3600);

      expect(TokenManager.isTokenValid()).toBe(true);
    });

    it('should invalidate expired token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, -1);

      expect(TokenManager.isTokenValid()).toBe(false);
    });

    it('should handle no token gracefully', () => {
      TokenManager.clearTokens();

      const result = TokenManager.isTokenValid();
      expect(typeof result === 'boolean' || result === null).toBe(true);
    });
  });

  describe('Token Refresh Logic', () => {
    it('should suggest refresh when token < 2 min to expiry', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, 60);

      expect(TokenManager.shouldRefreshToken()).toBe(true);
    });

    it('should not suggest refresh when token > 2 min to expiry', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, 3600);

      expect(TokenManager.shouldRefreshToken()).toBe(false);
    });
  });

  describe('Token Clearing', () => {
    it('should clear all tokens', () => {
      TokenManager.setAccessToken('access-token');
      TokenManager.clearTokens();

      expect(TokenManager.getAccessToken()).toBeNull();
    });
  });

  describe('JWT Token Decoding', () => {
    it('should decode valid JWT token', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const decoded = TokenManager.decodeToken(validToken);

      expect(decoded).toBeDefined();
      expect(decoded.name).toBe('John Doe');
    });

    it('should return null for invalid token', () => {
      const decoded = TokenManager.decodeToken('invalid-token');

      expect(decoded).toBeNull();
    });
  });

  describe('User Info Extraction', () => {
    it('should extract user info from valid token', () => {
      const validToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      TokenManager.setAccessToken(validToken);

      const user = TokenManager.getUserFromToken();
      expect(user).toBeDefined();
    });

    it('should return null when no token set', () => {
      TokenManager.clearTokens();

      const user = TokenManager.getUserFromToken();
      expect(user).toBeNull();
    });
  });

  describe('Time to Expiry', () => {
    it('should calculate remaining time correctly', () => {
      const token = 'test-token';
      const expiresIn = 3600;
      TokenManager.setAccessToken(token, expiresIn);

      const timeLeft = TokenManager.getTimeUntilExpiry();

      expect(timeLeft).toBeGreaterThan(0);
      expect(timeLeft).toBeLessThanOrEqual((expiresIn + 1) * 1000);
    });

    it('should return 0 or negative for expired token', () => {
      const token = 'test-token';
      TokenManager.setAccessToken(token, -1);

      const timeLeft = TokenManager.getTimeUntilExpiry();

      expect(timeLeft).toBeLessThanOrEqual(0);
    });
  });
});
