import axios from 'axios';

// Base URL configuration
const getBaseURL = () => {
  // Use environment variable if set, otherwise auto-detect
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // For Replit environment, use 0.0.0.0
  if (window.location.hostname.includes('replit')) {
    return window.location.origin.replace(':5000', ':3000').replace(':80', ':3000');
  }

  // Development: try backend on multiple possible URLs
  if (import.meta.env.DEV) {
    // Check if we can reach the backend
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
    return `http://${hostname}:3000`;
  }

  // Fallback
  return window.location.origin.replace(':5000', ':3000');
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;