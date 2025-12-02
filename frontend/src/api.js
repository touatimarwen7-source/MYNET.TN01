/**
 * API Module - Updated to use secure token management
 * All API calls go through axios with security interceptors
 */

import axiosInstance from './services/axiosConfig';

// API endpoints
export const authAPI = {
  login: (data) => axiosInstance.post('/auth/login', data),
  register: (data) => axiosInstance.post('/auth/register', data),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  getActivity: () => axiosInstance.get('/auth/activity'),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),

  // 🔐 Password Reset & Email Verification
  requestPasswordReset: (data) => axiosInstance.post('/auth/password-reset/request', data),
  verifyResetToken: (data) => axiosInstance.post('/auth/password-reset/verify-token', data),
  resetPassword: (data) => axiosInstance.post('/auth/password-reset/reset', data),
  verifyEmail: (data) => axiosInstance.post('/auth/password-reset/verify-email', data),
  resendVerificationEmail: (data) =>
    axiosInstance.post('/auth/password-reset/resend-verification', data),
};

export const procurementAPI = {
  getTenders: (filters) => axiosInstance.get('/procurement/tenders', { params: filters }),
  getTender: (id) => axiosInstance.get(`/procurement/tenders/${id}`),
  createTender: (data) => axiosInstance.post('/procurement/tenders', data),
  updateTender: (id, data) => axiosInstance.put(`/procurement/tenders/${id}`, data),
  deleteTender: (id) => axiosInstance.delete(`/procurement/tenders/${id}`),
  publishTender: (id) => axiosInstance.post(`/procurement/tenders/${id}/publish`),
  closeTender: (id) => axiosInstance.post(`/procurement/tenders/${id}/close`),
  getMyTenders: (filters) => axiosInstance.get('/procurement/my-tenders', { params: filters }),

  // Direct supply request helpers
  getSuppliers: () => axiosInstance.get('/direct-supply/suppliers'),
  createSupplyRequest: (data) => axiosInstance.post('/direct-supply/create-request', data),

  getOffers: (tenderId) => axiosInstance.get(`/procurement/tenders/${tenderId}/offers`),
  getMyOffers: () => axiosInstance.get('/procurement/my-offers'),
  createOffer: (data) => axiosInstance.post('/procurement/offers', data),
  evaluateOffer: (id, data) => axiosInstance.post(`/procurement/offers/${id}/evaluate`, data),
  selectWinner: (id) => axiosInstance.post(`/procurement/offers/${id}/select-winner`),
  rejectOffer: (id) => axiosInstance.post(`/procurement/offers/${id}/reject`),

  // Supply Request endpoints
  getSupplyRequests: (filters) =>
    axiosInstance.get('/procurement/supply-requests', { params: filters }),
  getSupplyRequest: (id) => axiosInstance.get(`/procurement/supply-requests/${id}`),
  createSupplyRequest: (data) => axiosInstance.post('/procurement/supply-requests', data),
  updateSupplyRequest: (id, data) => axiosInstance.put(`/procurement/supply-requests/${id}`, data),
  getMySupplyRequests: () => axiosInstance.get('/procurement/my-supply-requests'),

  // Invoice endpoints
  getInvoices: (filters) => axiosInstance.get('/procurement/invoices', { params: filters }),
  getInvoice: (id) => axiosInstance.get(`/procurement/invoices/${id}`),
  createInvoice: (data) => axiosInstance.post('/procurement/invoices', data),
  updateInvoice: (id, data) => axiosInstance.put(`/procurement/invoices/${id}`, data),
  getMyInvoices: () => axiosInstance.get('/procurement/my-invoices'),
  approveInvoice: (id, data) => axiosInstance.post(`/procurement/invoices/${id}/approve`, data),

  // Purchase Orders endpoints
  getPurchaseOrders: (filters) =>
    axiosInstance.get('/procurement/purchase-orders', { params: filters }),
  getPurchaseOrder: (id) => axiosInstance.get(`/procurement/purchase-orders/${id}`),
  getMyPurchaseOrders: () => axiosInstance.get('/procurement/my-purchase-orders'),
};

export const searchAPI = {
  searchTenders: (params) => axiosInstance.get('/search/tenders', { params }),
  searchSuppliers: (params) => axiosInstance.get('/search/suppliers', { params }),
};

export const companyProfileAPI = {
  getSupplierProfile: (supplierId) => axiosInstance.get(`/company-profile/supplier/${supplierId}`),
  updateSupplierProfile: (supplierId, data) =>
    axiosInstance.put(`/company-profile/supplier/${supplierId}`, data),
  searchSuppliers: (filters) => axiosInstance.get('/company-profile/search', { params: filters }),
};

export const directSupplyAPI = {
  getSuppliers: () => axiosInstance.get('/direct-supply/suppliers'),
  createRequest: (data) => axiosInstance.post('/direct-supply/create-request', data),
  getMyRequests: () => axiosInstance.get('/direct-supply/my-requests'),
  getReceivedRequests: () => axiosInstance.get('/direct-supply/received-requests'),
  updateRequestStatus: (requestId, status) =>
    axiosInstance.put(`/direct-supply/${requestId}/status`, { status }),
};

export const adminAPI = {
  getUsers: (filters) => axiosInstance.get('/admin/users', { params: filters }),
  getStatistics: () => axiosInstance.get('/admin/statistics'),
  verifyUser: (id) => axiosInstance.post(`/admin/users/${id}/verify`),
  toggleUserStatus: (id, data) => axiosInstance.put(`/admin/users/${id}/toggle-status`, data),
};

export default axiosInstance;
