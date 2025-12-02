/**
 * MyNet.tn - Configuration de la Plateforme
 * Langue Officielle: FRANÇAIS
 */

export const PLATFORM_CONFIG = {
  // Langue officielle de la plateforme
  OFFICIAL_LANGUAGE: 'fr',

  // Langue exclusive: FRANÇAIS UNIQUEMENT
  SUPPORTED_LANGUAGES: {
    fr: {
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷',
      direction: 'ltr',
      isOfficial: true,
    },
  },

  // Informations de la plateforme
  PLATFORM_NAME: 'MyNet.tn',
  PLATFORM_SUBTITLE: "Système de Gestion des Appels d'Offres et des Achats",
  PLATFORM_DESCRIPTION: 'Plateforme B2B de e-tendering sécurisée pour le marché tunisien',

  // Configuration de l'authentification
  AUTH: {
    ACCESS_TOKEN_EXPIRY: '1h',
    REFRESH_TOKEN_EXPIRY: '7d',
    MFA_ENABLED: true,
  },

  // Configuration de sécurité
  SECURITY: {
    ENCRYPTION_ALGORITHM: 'AES-256-GCM',
    PASSWORD_HASHING: 'PBKDF2',
    SESSION_TIMEOUT: 15 * 60 * 1000, // 15 minutes
  },

  // Rôles disponibles
  USER_ROLES: {
    ADMIN: 'admin',
    BUYER: 'buyer',
    SUPPLIER: 'supplier',
    ACCOUNTANT: 'accountant',
    VIEWER: 'viewer',
  },
};

export default PLATFORM_CONFIG;
