
/**
 * Authentication API
 * Handles login, register, password reset, email verification
 */
import axiosInstance from '../services/axiosConfig.js';

export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/profile'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  requestPasswordReset: (data) => axiosInstance.post('/auth/request-password-reset', data),
  verifyResetToken: (data) => axiosInstance.post('/auth/verify-reset-token', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  verifyEmail: (data) => axiosInstance.post('/auth/verify-email', data),
  resendVerificationEmail: (data) => axiosInstance.post('/auth/resend-verification', data),
  getActivity: () => axiosInstance.get('/auth/activity'),
};
