
import axios from 'axios';

// Use direct backend URL instead of proxy
const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://0.0.0.0:3000/api';

const axiosInstance = axios.create({
  baseURL: backendURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

console.log('✅ Axios configured with backend URL:', backendURL);

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
