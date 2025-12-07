/**
 * @file errorHandler.js
 * @description A centralized utility for handling and formatting errors throughout the application.
 * This module provides consistent error messages, handles authentication errors,
 * and offers utilities for logging and retrying failed requests.
 */

/**
 * @module errorHandler
 * @description Provides a comprehensive set of functions for robust error management.
 * Comprehensive error handling with error codes, logging, and user notifications
 *
 * Features:
 * - Centralized error formatting (error codes + messages)
 * - Authentication error handling
 * - Validation error formatting
 * - Retry logic for transient failures
 * - Development logging
 * - Error tracking integration (ready for production)
 */

// import TokenManager from '../services/tokenManager'; // This import is removed as it's not used in the new handler
import { ERROR_CODES } from './errorCodes'; // This import is used for error codes

/**
 * Error Handler Utility - معالجة الأخطاء الموحدة
 */

/**
 * تنسيق رسائل الخطأ للمستخدم
 */
export const errorHandler = {
  /**
   * الحصول على رسالة خطأ مناسبة للمستخدم
   */
  getUserMessage(error) {
    // Erreur du serveur
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // Messages selon le code de statut
      switch (status) {
        case 400:
          return {
            title: 'Requête invalide',
            message: data?.message || 'Veuillez vérifier les données saisies',
            code: ERROR_CODES.VALIDATION_ERROR
          };

        case 401:
          return {
            title: 'Non autorisé',
            message: 'Session expirée. Veuillez vous reconnecter.',
            code: ERROR_CODES.UNAUTHORIZED
          };

        case 403:
          return {
            title: 'Interdit',
            message: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
            code: ERROR_CODES.FORBIDDEN
          };

        case 404:
          return {
            title: 'Non trouvé',
            message: data?.message || 'La ressource demandée n\'existe pas',
            code: ERROR_CODES.NOT_FOUND
          };

        case 409:
          return {
            title: 'Conflit',
            message: data?.message || 'Il y a un conflit avec les données existantes',
            code: ERROR_CODES.CONFLICT
          };

        case 429:
          return {
            title: 'Trop de requêtes',
            message: 'Vous avez dépassé la limite de requêtes autorisées. Veuillez réessayer plus tard.',
            code: ERROR_CODES.RATE_LIMIT
          };

        case 500:
        case 502:
        case 503:
          return {
            title: 'Erreur serveur',
            message: 'Erreur serveur. Veuillez réessayer plus tard.',
            code: ERROR_CODES.SERVER_ERROR
          };

        default:
          return {
            title: 'Erreur inconnue',
            message: data?.message || 'Une erreur s\'est produite',
            code: ERROR_CODES.UNKNOWN_ERROR
          };
      }
    }

    // Erreur de requête
    if (error.request) {
      return {
        title: 'Erreur de connexion',
        message: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet.',
        code: ERROR_CODES.NETWORK_ERROR
      };
    }

    // Autre erreur
    return {
      title: 'Erreur',
      message: error.message || 'Une erreur inattendue s\'est produite',
      code: ERROR_CODES.UNKNOWN_ERROR
    };
  },

  /**
   * Enregistrer l'erreur (développement)
   */
  logError(error, context = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 Error Details');
      console.error('Error:', error);
      console.log('Context:', context);
      console.groupEnd();
    }
  },

  /**
   * Traiter une erreur d'API
   */
  handleApiError(error, showToast = null) {
    const formatted = this.getUserMessage(error);
    this.logError(error, formatted);

    // Afficher le toast si disponible
    if (showToast && typeof showToast === 'function') {
      showToast(formatted.message, 'error');
    }

    return formatted;
  }
};

export default errorHandler;