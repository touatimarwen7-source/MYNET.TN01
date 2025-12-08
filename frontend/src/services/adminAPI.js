import axiosInstance from './axiosConfig';

const adminAPI = {
  // Dashboard & Statistics
  dashboard: {
    get: () => axiosInstance.get('/admin/dashboard'),
    getHealth: () => axiosInstance.get('/admin/health'),
    getAnalytics: () => axiosInstance.get('/admin/analytics'),
  },

  // Users
  users: {
    getAll: (page = 1, limit = 10, search = '') => 
      axiosInstance.get('/admin/users', { params: { page, limit, search } }),
    getById: (id) => axiosInstance.get(`/admin/users/${id}`),
    updateRole: (id, role) => axiosInstance.put(`/admin/users/${id}/role`, { role }),
    toggleBlock: (id, blocked) => axiosInstance.post(`/admin/users/${id}/${blocked ? 'block' : 'unblock'}`),
    resetPassword: (id) => axiosInstance.post(`/admin/users/${id}/reset-password`),
    delete: (id) => axiosInstance.delete(`/admin/users/${id}`),
  },

  // Analytics
  analytics: {
    getStats: async () => {
      try {
        const response = await axiosInstance.get('/admin/analytics');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch analytics stats:', error);
        throw error;
      }
    },
    
    getActivities: async (params = {}) => {
      try {
        // التحقق من المعاملات
        const validParams = {
          limit: Math.min(parseInt(params.limit) || 50, 100),
          offset: Math.max(parseInt(params.offset) || 0, 0),
          userId: params.userId,
          actionType: params.actionType,
          startDate: params.startDate,
          endDate: params.endDate
        };

        const response = await axiosInstance.get('/admin/activities/recent', { 
          params: validParams 
        });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        throw error;
      }
    },
    
    getUserStats: async () => {
      try {
        const response = await axiosInstance.get('/admin/analytics/users');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
        throw error;
      }
    },
    
    exportLogs: async (format = 'json', startDate, endDate) => {
      try {
        const response = await axiosInstance.get('/admin/audit-logs/export', { 
          params: { format, startDate, endDate },
          responseType: format === 'csv' ? 'blob' : 'json'
        });
        return response.data;
      } catch (error) {
        console.error('Failed to export logs:', error);
        throw error;
      }
    },
    
    getAdminPerformance: async () => {
      try {
        const response = await axiosInstance.get('/admin/analytics/performance');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch admin performance:', error);
        throw error;
      }
    },
    
    getAdminAssistantsStats: async () => {
      try {
        const response = await axiosInstance.get('/admin/analytics/assistants');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch assistants stats:', error);
        throw error;
      }
    },
  },

  // Content
  content: {
    getPages: () => axiosInstance.get('/admin/content/pages'),
    createPage: (data) => axiosInstance.post('/admin/content/pages', data),
    updatePage: (id, data) => axiosInstance.put(`/admin/content/pages/${id}`, data),
    deletePage: (id) => axiosInstance.delete(`/admin/content/pages/${id}`),
  },

  // Configuration
  config: {
    getAll: () => axiosInstance.get('/admin/config'),
    update: (data) => axiosInstance.put('/admin/config', data),
    toggleMaintenance: (enabled) => axiosInstance.post('/admin/config/maintenance', { enabled }),
    clearCache: () => axiosInstance.post('/admin/config/cache/clear'),
    restartSystem: () => axiosInstance.post('/admin/config/system/restart'),
  },

  // Features
  features: {
    getAll: () => axiosInstance.get('/admin/features'),
    enable: (featureKey) => axiosInstance.post('/admin/features/enable', { feature_key: featureKey }),
    disable: (featureKey) => axiosInstance.post('/admin/features/disable', { feature_key: featureKey }),
  },

  // Subscriptions
  subscriptions: {
    getPlans: () => axiosInstance.get('/admin/subscription-plans'),
    createPlan: (data) => axiosInstance.post('/admin/subscription-plans', data),
    updatePlan: (id, data) => axiosInstance.put(`/admin/subscription-plans/${id}`, data),
    deletePlan: (id) => axiosInstance.delete(`/admin/subscription-plans/${id}`),
  },
};

export default adminAPI;