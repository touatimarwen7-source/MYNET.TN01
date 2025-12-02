// Add these to frontend/src/api.js in authAPI section

export const authAPI_updates = {
  // Password Reset
  requestPasswordReset: (data) => axiosInstance.post('/auth/password-reset/request', data),
  verifyResetToken: (data) => axiosInstance.post('/auth/password-reset/verify-token', data),
  resetPassword: (data) => axiosInstance.post('/auth/password-reset/reset', data),

  // Email Verification
  verifyEmail: (data) => axiosInstance.post('/auth/password-reset/verify-email', data),
  resendVerificationEmail: (data) =>
    axiosInstance.post('/auth/password-reset/resend-verification', data),
};
