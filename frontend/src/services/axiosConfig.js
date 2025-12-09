
import axios from 'axios';
import TokenManager from './tokenManager';
import CSRFProtection from '../utils/csrfProtection';
import { shouldCache, getCacheDuration, isPublicEndpoint } from '../config/apiConfig';
import logger from '../utils/logger';

// ✅ استخدام Vite Proxy (relative path)
const API_BASE_URL = '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('✅ Axios configured to use Vite Proxy:', API_BASE_URL);

// Response Cache
const responseCache = new Map();
const CACHE_DURATION = 2 * 60 * 1000;

const getCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = TokenManager.getAccessToken();
    
    if (token && !isPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = await CSRFProtection.getToken();
    if (csrfToken && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    if (config.method === 'get' && shouldCache(config.url)) {
      const cacheKey = getCacheKey(config);
      const cached = responseCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < getCacheDuration(config.url)) {
        logger.info('Returning cached response for:', config.url);
        return Promise.reject({
          config,
          response: cached.data,
          __fromCache: true,
        });
      }
    }

    return config;
  },
  (error) => {
    logger.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.method === 'get' && shouldCache(response.config.url)) {
      const cacheKey = getCacheKey(response.config);
      responseCache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      });
    }

    if (response.data && typeof response.data.error === 'object') {
      response.data.error = response.data.error.message || JSON.stringify(response.data.error);
    }

    return response;
  },
  async (error) => {
    if (error.__fromCache) {
      return Promise.resolve(error.response);
    }

    if (error.response) {
      if (error.response.data && typeof error.response.data !== 'object') {
        error.response.data = { error: error.response.data };
      }

      if (error.response.data?.error && typeof error.response.data.error === 'object') {
        error.response.data.error = error.response.data.error.message || JSON.stringify(error.response.data.error);
      }

      if (error.response.status === 401) {
        const originalRequest = error.config;

        if (!originalRequest._retry && !isPublicEndpoint(originalRequest.url)) {
          originalRequest._retry = true;

          try {
            const refreshToken = TokenManager.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post('/api/auth/refresh-token', {
                refreshToken,
              });

              const newAccessToken = response.data.accessToken;
              TokenManager.setAccessToken(newAccessToken);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            TokenManager.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        TokenManager.clearTokens();
        window.location.href = '/login';
      }
    } else if (error.code === 'ECONNABORTED') {
      logger.error('Request timeout:', error.config?.url);
    } else if (error.request) {
      if (error.config?.method === 'get' && shouldCache(error.config.url)) {
        const cacheKey = getCacheKey(error.config);
        const cached = responseCache.get(cacheKey);
        
        if (cached) {
          logger.info('Network error, returning stale cache for:', error.config.url);
          return Promise.resolve(cached.data);
        }
      }
      
      logger.error('Network error - no response received:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
