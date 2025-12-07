/**
 * Token Manager Service
 * Gestion centralisée des tokens JWT
 */
class TokenManager {
  constructor() {
    this.ACCESS_TOKEN_KEY = 'auth_token';
    this.REFRESH_TOKEN_KEY = 'refresh_token';
    this.USER_KEY = 'user_data';
  }

  // Gestion du token d'accès
  setAccessToken(token) {
    if (token) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Gestion du token de rafraîchissement
  setRefreshToken(token) {
    if (token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Gestion des données utilisateur
  setUser(user) {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Gestion complète des tokens
  manageTokens(accessToken, refreshToken, userData) {
    if (accessToken) this.setAccessToken(accessToken);
    if (refreshToken) this.setRefreshToken(refreshToken);
    if (userData) this.setUser(userData);
  }

  // Nettoyage complet
  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Vérification d'authentification
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  // Extraire les données du token JWT
  getUserFromToken(token) {
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
}

// Create singleton instance
const tokenManagerInstance = new TokenManager();

// Export instance as default
export default tokenManagerInstance;

// Export class for testing purposes only
export { TokenManager };