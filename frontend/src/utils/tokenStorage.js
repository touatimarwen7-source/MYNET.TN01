// HTTP-Only Cookies - Meilleure solution de sécurité
// Note: Nécessite une mise à jour du Backend pour définir les cookies HTTP-Only

export const tokenStorage = {
  // Stockage en mémoire plutôt que localStorage
  accessToken: null,
  refreshToken: null,

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    // Envoyer au Backend pour définir les cookies HTTP-Only
  },

  getAccessToken() {
    return this.accessToken;
  },

  getRefreshToken() {
    return this.refreshToken;
  },

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    // Nettoyer les cookies
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },
};

// Demande au Backend: Ajouter le code suivant dans authController.js
/*
// Dans l'endpoint login:
res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: true,  // HTTPS seulement
  sameSite: 'Strict',
  maxAge: 3600000  // 1 heure
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
  maxAge: 604800000  // 7 jours
});
*/
