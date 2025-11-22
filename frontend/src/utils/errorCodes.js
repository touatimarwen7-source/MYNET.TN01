/**
 * Error Codes System
 * Centralized error definitions for application-wide error handling
 * 
 * Format: { code: 'ERROR_TYPE', message: 'User-friendly message', severity: 'error|warning|info' }
 * Severity: error (critical), warning (recoverable), info (informational)
 */

// ============================================
// Authentication Errors (A001 - A099)
// ============================================
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: {
    code: 'A001',
    message: 'Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.',
    severity: 'error'
  },
  ACCOUNT_LOCKED: {
    code: 'A002',
    message: 'Votre compte est verrouillé. Veuillez réessayer plus tard.',
    severity: 'error'
  },
  INVALID_TOKEN: {
    code: 'A003',
    message: 'Le jeton est invalide ou expiré.',
    severity: 'error'
  },
  TOKEN_EXPIRED: {
    code: 'A004',
    message: 'Votre session a expiré. Veuillez vous reconnecter.',
    severity: 'warning'
  },
  UNAUTHORIZED: {
    code: 'A005',
    message: 'Vous n\'êtes pas autorisé à accéder à cette ressource.',
    severity: 'error'
  },
  SESSION_EXPIRED: {
    code: 'A006',
    message: 'Votre session a expiré. Vous serez redirigé vers la page de connexion.',
    severity: 'warning'
  }
};

// ============================================
// Validation Errors (V001 - V099)
// ============================================
export const VALIDATION_ERRORS = {
  INVALID_EMAIL: {
    code: 'V001',
    message: 'Le format de l\'email est invalide.',
    severity: 'error'
  },
  PASSWORD_TOO_SHORT: {
    code: 'V002',
    message: 'Le mot de passe doit contenir au moins 8 caractères.',
    severity: 'error'
  },
  WEAK_PASSWORD: {
    code: 'V003',
    message: 'Le mot de passe est faible. Utilisez des majuscules, des chiffres et des caractères spéciaux.',
    severity: 'warning'
  },
  REQUIRED_FIELD: {
    code: 'V004',
    message: 'Ce champ est obligatoire.',
    severity: 'error'
  },
  INVALID_FORMAT: {
    code: 'V005',
    message: 'Le format est invalide.',
    severity: 'error'
  },
  FIELD_ALREADY_EXISTS: {
    code: 'V006',
    message: 'Cet élément existe déjà.',
    severity: 'error'
  }
};

// ============================================
// Network/API Errors (N001 - N099)
// ============================================
export const NETWORK_ERRORS = {
  NETWORK_TIMEOUT: {
    code: 'N001',
    message: 'La connexion a été perdue. Veuillez réessayer.',
    severity: 'warning'
  },
  NO_INTERNET: {
    code: 'N002',
    message: 'Vous n\'avez pas de connexion Internet.',
    severity: 'error'
  },
  BAD_GATEWAY: {
    code: 'N003',
    message: 'Le serveur Web n\'est pas disponible. Veuillez réessayer plus tard.',
    severity: 'error'
  },
  SERVICE_UNAVAILABLE: {
    code: 'N004',
    message: 'Le service n\'est pas disponible pour le moment.',
    severity: 'warning'
  },
  RATE_LIMIT: {
    code: 'N005',
    message: 'Vous avez dépassé la limite de requêtes. Veuillez réessayer plus tard.',
    severity: 'warning'
  },
  REQUEST_FAILED: {
    code: 'N006',
    message: 'La requête a échoué. Veuillez réessayer.',
    severity: 'error'
  }
};

// ============================================
// Business Logic Errors (B001 - B099)
// ============================================
export const BUSINESS_ERRORS = {
  TENDER_NOT_FOUND: {
    code: 'B001',
    message: 'L\'appel d\'offres n\'a pas été trouvé.',
    severity: 'error'
  },
  OFFER_NOT_FOUND: {
    code: 'B002',
    message: 'L\'offre n\'a pas été trouvée.',
    severity: 'error'
  },
  INSUFFICIENT_BUDGET: {
    code: 'B003',
    message: 'Le budget est insuffisant.',
    severity: 'error'
  },
  DUPLICATE_OFFER: {
    code: 'B004',
    message: 'Vous avez déjà soumis une offre pour cet appel d\'offres.',
    severity: 'warning'
  },
  TENDER_CLOSED: {
    code: 'B005',
    message: 'La date limite de cet appel d\'offres est dépassée.',
    severity: 'error'
  },
  PERMISSION_DENIED: {
    code: 'B006',
    message: 'Vous n\'avez pas les permissions suffisantes pour effectuer cette action.',
    severity: 'error'
  }
};

// ============================================
// File/Upload Errors (F001 - F099)
// ============================================
export const FILE_ERRORS = {
  FILE_TOO_LARGE: {
    code: 'F001',
    message: 'La taille du fichier est trop grande. La limite maximale est de 10 Mo.',
    severity: 'error'
  },
  INVALID_FILE_TYPE: {
    code: 'F002',
    message: 'Le type de fichier n\'est pas supporté.',
    severity: 'error'
  },
  UPLOAD_FAILED: {
    code: 'F003',
    message: 'Le téléchargement du fichier a échoué. Veuillez réessayer.',
    severity: 'error'
  },
  DOWNLOAD_FAILED: {
    code: 'F004',
    message: 'Le téléchargement du fichier a échoué.',
    severity: 'error'
  }
};

// ============================================
// System Errors (S001 - S099)
// ============================================
export const SYSTEM_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    code: 'S001',
    message: 'Une erreur système s\'est produite. Veuillez réessayer plus tard.',
    severity: 'error'
  },
  DATABASE_ERROR: {
    code: 'S002',
    message: 'Erreur de base de données.',
    severity: 'error'
  },
  CACHE_ERROR: {
    code: 'S003',
    message: 'Erreur de cache.',
    severity: 'warning'
  },
  CONFIGURATION_ERROR: {
    code: 'S004',
    message: 'Erreur de configuration.',
    severity: 'error'
  }
};

// ============================================
// Error Map: Status Code → Error
// ============================================
export const HTTP_ERROR_MAP = {
  400: AUTH_ERRORS.INVALID_CREDENTIALS,
  401: AUTH_ERRORS.UNAUTHORIZED,
  403: AUTH_ERRORS.PERMISSION_DENIED,
  404: BUSINESS_ERRORS.TENDER_NOT_FOUND,
  408: NETWORK_ERRORS.NETWORK_TIMEOUT,
  429: NETWORK_ERRORS.RATE_LIMIT,
  500: SYSTEM_ERRORS.INTERNAL_SERVER_ERROR,
  502: NETWORK_ERRORS.BAD_GATEWAY,
  503: NETWORK_ERRORS.SERVICE_UNAVAILABLE,
  504: NETWORK_ERRORS.NETWORK_TIMEOUT
};

// ============================================
// Error Helper Functions
// ============================================

/**
 * Get error by code
 * @param {string} code - Error code (e.g., 'A001')
 * @returns {Object|null} Error object or null if not found
 */
export function getErrorByCode(code) {
  const allErrors = {
    ...AUTH_ERRORS,
    ...VALIDATION_ERRORS,
    ...NETWORK_ERRORS,
    ...BUSINESS_ERRORS,
    ...FILE_ERRORS,
    ...SYSTEM_ERRORS
  };
  
  return Object.values(allErrors).find(err => err.code === code) || null;
}

/**
 * Get error from HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Error object
 */
export function getErrorFromStatusCode(statusCode) {
  return HTTP_ERROR_MAP[statusCode] || SYSTEM_ERRORS.INTERNAL_SERVER_ERROR;
}

/**
 * Format error for display
 * @param {Object|string} error - Error object or message
 * @returns {Object} Formatted error { code, message, severity }
 */
export function formatError(error) {
  if (!error) {
    return {
      code: 'UNKNOWN',
      message: 'Une erreur inconnue s\'est produite.',
      severity: 'error'
    };
  }

  // If already formatted
  if (error.code && error.message) {
    return error;
  }

  // If HTTP error object
  if (error.response?.status) {
    return getErrorFromStatusCode(error.response.status);
  }

  // If error message string
  if (typeof error === 'string') {
    return {
      code: 'ERROR',
      message: error,
      severity: 'error'
    };
  }

  // Fallback
  return SYSTEM_ERRORS.INTERNAL_SERVER_ERROR;
}

export default {
  AUTH_ERRORS,
  VALIDATION_ERRORS,
  NETWORK_ERRORS,
  BUSINESS_ERRORS,
  FILE_ERRORS,
  SYSTEM_ERRORS,
  HTTP_ERROR_MAP,
  getErrorByCode,
  getErrorFromStatusCode,
  formatError
};
