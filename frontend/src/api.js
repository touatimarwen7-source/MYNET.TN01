
import axiosInstance from './services/axiosConfig';

// Authentication API
export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data)
};

// Procurement API
export const procurementAPI = {
  getTenders: (params) => axiosInstance.get('/procurement/tenders', { params }),
  getTender: (id) => axiosInstance.get(`/procurement/tenders/${id}`),
  createTender: (data) => axiosInstance.post('/procurement/tenders', data),
  updateTender: (id, data) => axiosInstance.put(`/procurement/tenders/${id}`, data),
  deleteTender: (id) => axiosInstance.delete(`/procurement/tenders/${id}`),
  getMyTenders: () => axiosInstance.get('/procurement/my-tenders'),
  
  getOffers: (tenderId) => axiosInstance.get(`/procurement/tenders/${tenderId}/offers`),
  createOffer: (data) => axiosInstance.post('/procurement/offers', data),
  getMyOffers: () => axiosInstance.get('/procurement/my-offers')
};

// Admin API
export const adminAPI = {
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  getStatistics: () => axiosInstance.get('/admin/statistics'),
  verifyUser: (userId) => axiosInstance.post(`/admin/users/${userId}/verify`)
};

// Notification API
export const notificationAPI = {
  getNotifications: () => axiosInstance.get('/notifications'),
  markAsRead: (id) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/mark-all-read')
};

// Search API
export const searchAPI = {
  search: (query) => axiosInstance.get('/search', { params: { q: query } })
};

// Bid API
export const bidAPI = {
  createBid: (data) => axiosInstance.post('/procurement/bids', data),
  getMyBids: () => axiosInstance.get('/procurement/my-bids')
};

// Direct Supply API
export const directSupplyAPI = {
  createRequest: (data) => axiosInstance.post('/procurement/supply-requests', data),
  getMyRequests: () => axiosInstance.get('/procurement/my-supply-requests')
};

// Company Profile API
export const companyProfileAPI = {
  getProfile: () => axiosInstance.get('/profile/company'),
  updateProfile: (data) => axiosInstance.put('/profile/company', data)
};

// Export axios instance as default and named
export const apiClient = axiosInstance;
export default axiosInstance;
