
import axios from 'axios';
import tokenManager from '../services/tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

console.log('🔧 Axios Config - API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor - Ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Logging pour debug
    console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      hasAuth: !!token
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Gestion des erreurs
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Logging détaillé des erreurs
    console.error('❌ Response Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Gestion des erreurs réseau
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.userMessage = 'La requête a expiré. Vérifiez votre connexion.';
      } else if (error.message === 'Network Error') {
        error.userMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      } else {
        error.userMessage = 'Erreur de communication avec le serveur.';
      }
      return Promise.reject(error);
    }

    // Gestion 401 - Token expiré
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        
        if (!refreshToken) {
          tokenManager.clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        tokenManager.setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Gestion 400 - Erreurs de validation
    if (error.response.status === 400) {
      error.userMessage = error.response.data?.error || 'Requête invalide.';
    }

    // Gestion 403 - Accès refusé
    if (error.response.status === 403) {
      error.userMessage = "Vous n'avez pas les permissions nécessaires.";
    }

    // Gestion 404 - Ressource non trouvée
    if (error.response.status === 404) {
      error.userMessage = 'Ressource non trouvée.';
    }

    // Gestion 500 - Erreur serveur
    if (error.response.status >= 500) {
      error.userMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
