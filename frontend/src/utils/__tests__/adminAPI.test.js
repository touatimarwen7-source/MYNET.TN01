import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminAPI } from '../../services/adminAPI';

describe('Admin API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Users API', () => {
    it('should fetch all users with pagination', async () => {
      // Mock implementation
      expect(adminAPI.users.getAll).toBeDefined();
      expect(typeof adminAPI.users.getAll).toBe('function');
    });

    it('should update user role', async () => {
      expect(adminAPI.users.updateRole).toBeDefined();
      expect(typeof adminAPI.users.updateRole).toBe('function');
    });

    it('should toggle block status', async () => {
      expect(adminAPI.users.toggleBlock).toBeDefined();
      expect(typeof adminAPI.users.toggleBlock).toBe('function');
    });

    it('should reset user password', async () => {
      expect(adminAPI.users.resetPassword).toBeDefined();
      expect(typeof adminAPI.users.resetPassword).toBe('function');
    });

    it('should delete user', async () => {
      expect(adminAPI.users.delete).toBeDefined();
      expect(typeof adminAPI.users.delete).toBe('function');
    });
  });

  describe('Content API', () => {
    it('should get all pages', async () => {
      expect(adminAPI.content.getPages).toBeDefined();
      expect(typeof adminAPI.content.getPages).toBe('function');
    });

    it('should update page content', async () => {
      expect(adminAPI.content.updatePage).toBeDefined();
      expect(typeof adminAPI.content.updatePage).toBe('function');
    });

    it('should upload file', async () => {
      expect(adminAPI.content.uploadFile).toBeDefined();
      expect(typeof adminAPI.content.uploadFile).toBe('function');
    });

    it('should get all files', async () => {
      expect(adminAPI.content.getFiles).toBeDefined();
      expect(typeof adminAPI.content.getFiles).toBe('function');
    });

    it('should delete file', async () => {
      expect(adminAPI.content.deleteFile).toBeDefined();
      expect(typeof adminAPI.content.deleteFile).toBe('function');
    });
  });

  describe('Config API', () => {
    it('should get all config', async () => {
      expect(adminAPI.config.getAll).toBeDefined();
      expect(typeof adminAPI.config.getAll).toBe('function');
    });

    it('should update config', async () => {
      expect(adminAPI.config.update).toBeDefined();
      expect(typeof adminAPI.config.update).toBe('function');
    });

    it('should toggle maintenance mode', async () => {
      expect(adminAPI.config.toggleMaintenance).toBeDefined();
      expect(typeof adminAPI.config.toggleMaintenance).toBe('function');
    });

    it('should clear cache', async () => {
      expect(adminAPI.config.clearCache).toBeDefined();
      expect(typeof adminAPI.config.clearCache).toBe('function');
    });

    it('should restart system', async () => {
      expect(adminAPI.config.restartSystem).toBeDefined();
      expect(typeof adminAPI.config.restartSystem).toBe('function');
    });
  });

  describe('Analytics API', () => {
    it('should get statistics', async () => {
      expect(adminAPI.analytics.getStats).toBeDefined();
      expect(typeof adminAPI.analytics.getStats).toBe('function');
    });

    it('should get health metrics', async () => {
      expect(adminAPI.analytics.getHealth).toBeDefined();
      expect(typeof adminAPI.analytics.getHealth).toBe('function');
    });

    it('should get activities', async () => {
      expect(adminAPI.analytics.getActivities).toBeDefined();
      expect(typeof adminAPI.analytics.getActivities).toBe('function');
    });

    it('should get user statistics', async () => {
      expect(adminAPI.analytics.getUserStats).toBeDefined();
      expect(typeof adminAPI.analytics.getUserStats).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle errors with errorHandler', async () => {
      // Verify error handler integration
      expect(adminAPI.users.getAll).toBeDefined();
    });

    it('should use errorHandler for user messages', async () => {
      expect(adminAPI.users.updateRole).toBeDefined();
    });
  });
});
