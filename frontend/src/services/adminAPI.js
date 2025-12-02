import api from './axiosConfig';
import { errorHandler } from '../utils/errorHandler';

/**
 * Admin API Service
 * Handles all admin-related API calls for user management, content, system config, and analytics
 */

/**
 * User Management API calls
 */
export const adminAPI = {
  // User Management
  users: {
    /**
     * Get all users with pagination and search
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {string} search - Search query
     * @returns {Promise}
     */
    getAll: async (page = 1, limit = 10, search = '') => {
      try {
        const response = await api.get('/admin/users', {
          params: { page, limit, search },
        });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Update user role
     * @param {string} userId - User ID
     * @param {string} role - New role (buyer, supplier, admin, super_admin)
     * @returns {Promise}
     */
    updateRole: async (userId, role) => {
      try {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Block or unblock a user
     * @param {string} userId - User ID
     * @param {boolean} block - Block status
     * @returns {Promise}
     */
    toggleBlock: async (userId, block) => {
      try {
        const response = await api.put(`/admin/users/${userId}/block`, { blocked: block });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Send password reset email
     * @param {string} userId - User ID
     * @returns {Promise}
     */
    resetPassword: async (userId) => {
      try {
        const response = await api.post(`/admin/users/${userId}/reset-password`);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Delete a user
     * @param {string} userId - User ID
     * @returns {Promise}
     */
    delete: async (userId) => {
      try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },
  },

  // Content Management
  content: {
    /**
     * Get all pages
     * @returns {Promise}
     */
    getPages: async () => {
      try {
        const response = await api.get('/admin/content/pages');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Update page content
     * @param {string} pageId - Page ID
     * @param {string} content - Page content
     * @returns {Promise}
     */
    updatePage: async (pageId, content) => {
      try {
        const response = await api.put(`/admin/content/pages/${pageId}`, { content });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Upload file
     * @param {File} file - File to upload
     * @returns {Promise}
     */
    uploadFile: async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/admin/content/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Get all files
     * @returns {Promise}
     */
    getFiles: async () => {
      try {
        const response = await api.get('/admin/content/files');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Delete file
     * @param {string} fileId - File ID
     * @returns {Promise}
     */
    deleteFile: async (fileId) => {
      try {
        const response = await api.delete(`/admin/content/files/${fileId}`);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },
  },

  // System Configuration
  config: {
    /**
     * Get all system config
     * @returns {Promise}
     */
    getAll: async () => {
      try {
        const response = await api.get('/admin/config');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Update system config
     * @param {object} config - Config object with key-value pairs
     * @returns {Promise}
     */
    update: async (config) => {
      try {
        const response = await api.put('/admin/config', config);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Toggle maintenance mode
     * @param {boolean} enabled - Enable/disable maintenance mode
     * @returns {Promise}
     */
    toggleMaintenance: async (enabled) => {
      try {
        const response = await api.put('/admin/config/maintenance', { enabled });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Clear cache
     * @returns {Promise}
     */
    clearCache: async () => {
      try {
        const response = await api.post('/admin/config/cache/clear');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Restart system
     * @returns {Promise}
     */
    restartSystem: async () => {
      try {
        const response = await api.post('/admin/config/system/restart');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },
  },

  // Analytics
  analytics: {
    /**
     * Get dashboard statistics
     * @returns {Promise}
     */
    getStats: async () => {
      try {
        const response = await api.get('/admin/analytics/stats');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Get system health metrics
     * @returns {Promise}
     */
    getHealth: async () => {
      try {
        const response = await api.get('/admin/analytics/health');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Get recent activities
     * @param {number} limit - Number of activities to return
     * @returns {Promise}
     */
    getActivities: async (limit = 10) => {
      try {
        const response = await api.get('/admin/analytics/activities', {
          params: { limit },
        });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Get user statistics
     * @returns {Promise}
     */
    getUserStats: async () => {
      try {
        const response = await api.get('/admin/analytics/users');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },
  },

  // Feature Flags Management
  features: {
    /**
     * Get all feature flags
     * @returns {Promise}
     */
    getAll: async () => {
      try {
        const response = await api.get('/features/all');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Enable a feature
     * @param {string} featureKey - Feature key
     * @returns {Promise}
     */
    enable: async (featureKey) => {
      try {
        const response = await api.put('/features/enable', { feature_key: featureKey });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Disable a feature
     * @param {string} featureKey - Feature key
     * @param {string} reason - Reason for disabling
     * @returns {Promise}
     */
    disable: async (featureKey, reason = '') => {
      try {
        const response = await api.put('/features/disable', { feature_key: featureKey, reason });
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Get features by category
     * @param {string} category - Category name
     * @returns {Promise}
     */
    getByCategory: async (category) => {
      try {
        const response = await api.get(`/features/category/${category}`);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },
  },

  // Subscription Plans Management
  subscriptions: {
    /**
     * Get all subscription plans
     * @returns {Promise}
     */
    getPlans: async () => {
      try {
        const response = await api.get('/subscriptions/plans');
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Create a new subscription plan
     * @param {object} planData - Plan details
     * @returns {Promise}
     */
    createPlan: async (planData) => {
      try {
        const response = await api.post('/admin/subscriptions/plans', planData);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Update a subscription plan
     * @param {string} planId - Plan ID
     * @param {object} planData - Plan details
     * @returns {Promise}
     */
    updatePlan: async (planId, planData) => {
      try {
        const response = await api.put(`/admin/subscriptions/plans/${planId}`, planData);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },

    /**
     * Delete a subscription plan
     * @param {string} planId - Plan ID
     * @returns {Promise}
     */
    deletePlan: async (planId) => {
      try {
        const response = await api.delete(`/admin/subscriptions/plans/${planId}`);
        return response.data;
      } catch (error) {
        const formatted = errorHandler.getUserMessage(error);
        throw formatted;
      }
    },
  },
};

export default adminAPI;
