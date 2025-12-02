/**
 * ============ ERROR & MESSAGE CONSTANTS ============
 * Centralized error messages and validation messages
 */

// ============ Form Validation Errors ============
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: 'Ce champ est requis',
  INVALID_EMAIL: 'Adresse email invalide',
  INVALID_PHONE: 'Numéro de téléphone invalide',
  INVALID_PRICE: 'Le prix doit être supérieur à 0',
  PRICE_EXCEEDS_BUDGET: 'Le prix dépasse le budget maximum',
  INVALID_FILE_TYPE: 'Type de fichier non autorisé',
  FILE_TOO_LARGE: 'Fichier trop volumineux',
  AT_LEAST_ONE_LOT: 'Au moins un lot est requis',
  LOT_MISSING_ARTICLES: "Le lot n'a pas d'articles",
  ARTICLE_INCOMPLETE: 'Article incomplet',
  INVALID_DATE: 'Date invalide',
  DATE_IN_PAST: 'La date ne peut pas être dans le passé',
  DEADLINE_BEFORE_PUBLICATION: 'La date limite doit être après la date de publication',
};

// ============ API Error Messages ============
export const API_ERRORS = {
  LOAD_TENDER: 'Erreur lors du chargement de la marchandise',
  LOAD_OFFER: "Erreur lors du chargement de l'offre",
  LOAD_OFFERS: 'Erreur lors du chargement des offres',
  CREATE_TENDER: 'Erreur lors de la création de la marchandise',
  CREATE_OFFER: "Erreur lors de la création de l'offre",
  SUBMIT_OFFER: "Erreur lors de la soumission de l'offre",
  SUBMIT_BID: "Erreur lors de la soumission de l'enchère",
  UPDATE_TENDER: 'Erreur lors de la mise à jour de la marchandise',
  DELETE_TENDER: 'Erreur lors de la suppression de la marchandise',
  NETWORK_ERROR: 'Erreur de réseau. Veuillez réessayer',
  UNAUTHORIZED: "Vous n'êtes pas autorisé à effectuer cette action",
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard',
};

// ============ Success Messages ============
export const SUCCESS_MESSAGES = {
  TENDER_CREATED: '✅ Marchandise créée avec succès',
  TENDER_UPDATED: '✅ Marchandise mise à jour avec succès',
  TENDER_PUBLISHED: '✅ Marchandise publiée avec succès',
  OFFER_SUBMITTED: '✅ Offre soumise avec succès',
  OFFER_UPDATED: '✅ Offre mise à jour avec succès',
  BID_SUBMITTED: '✅ Enchère soumise avec succès',
  FILE_UPLOADED: '✅ Fichier téléchargé avec succès',
};

// ============ Confirmation Messages ============
export const CONFIRMATION_MESSAGES = {
  DELETE_TENDER: 'Êtes-vous sûr de vouloir supprimer cette marchandise ?',
  DELETE_OFFER: 'Êtes-vous sûr de vouloir supprimer cette offre ?',
  PUBLISH_TENDER: 'Êtes-vous sûr de vouloir publier cette marchandise ?',
  SUBMIT_TENDER: 'Êtes-vous sûr de vouloir soumettre cette marchandise ?',
};

// ============ Loading Messages ============
export const LOADING_MESSAGES = {
  LOADING: 'Chargement en cours...',
  CREATING: 'Création en cours...',
  UPDATING: 'Mise à jour en cours...',
  SUBMITTING: 'Soumission en cours...',
};

export default {
  VALIDATION_ERRORS,
  API_ERRORS,
  SUCCESS_MESSAGES,
  CONFIRMATION_MESSAGES,
  LOADING_MESSAGES,
};
