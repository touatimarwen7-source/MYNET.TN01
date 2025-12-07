
import axiosInstance from './services/axiosConfig';

// ============================================
// Authentication API
// ============================================
export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  refreshToken: (refreshToken) => axiosInstance.post('/auth/refresh-token', { refreshToken }),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
};

// ============================================
// Procurement API
// ============================================
export const procurementAPI = {
  getTenders: (params) => axiosInstance.get('/procurement/tenders', { params }),
  getTenderById: (id) => axiosInstance.get(`/procurement/tenders/${id}`),
  createTender: (data) => axiosInstance.post('/procurement/tenders', data),
  updateTender: (id, data) => axiosInstance.put(`/procurement/tenders/${id}`, data),
  deleteTender: (id) => axiosInstance.delete(`/procurement/tenders/${id}`),
  submitOffer: (data) => axiosInstance.post('/procurement/offers', data),
  getOffers: (params) => axiosInstance.get('/procurement/offers', { params }),
  getOfferById: (id) => axiosInstance.get(`/procurement/offers/${id}`),
};

// ============================================
// Admin API
// ============================================
export const adminAPI = {
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  updateUser: (id, data) => axiosInstance.put(`/admin/users/${id}`, data),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),
  getStatistics: () => axiosInstance.get('/admin/statistics'),
};

// ============================================
// Search API
// ============================================
export const searchAPI = {
  searchTenders: (query, filters) => axiosInstance.get('/search/tenders', { params: { query, ...filters } }),
};

// ============================================
// Notifications API
// ============================================
export const notificationAPI = {
  getNotifications: () => axiosInstance.get('/notifications'),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
};

// Export axios instance
export const apiClient = axiosInstance;
export default axiosInstance;
