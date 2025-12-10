import axios from 'axios';

// Use relative path for Vite proxy
const backendURL = '/api';

const axiosInstance = axios.create({
  baseURL: backendURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds timeout for slow backend
  withCredentials: true,
});

console.log('✅ Axios configured with Vite proxy:', backendURL);

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    };

    console.error('❌ API Error:', errorDetails);

    // Handle timeout
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏱️ Request timeout - Backend may be slow or unavailable');
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('🌐 Network Error - Check if backend is running on port 3000');
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;