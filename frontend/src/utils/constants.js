/**
 * ============ GLOBAL CONSTANTS ============
 * Centralized configuration for the entire application
 */

// ============ Procurement Configuration ============
export const PROCUREMENT_STAGES = {
  TENDER: {
    STEPS: [
      { name: 'Informations', description: 'Détails généraux' },
      { name: 'Lots', description: 'Division en lots' },
      { name: 'Exigences', description: 'Critères obligatoires' },
      { name: 'Évaluation', description: "Critères d'évaluation" },
      { name: 'Spécifications', description: 'Cahier des charges et documents' },
      { name: 'Finalisation', description: 'Révision finale' },
    ],
  },
  BID: {
    STEPS: [
      { name: 'Informations', description: 'Détails du fournisseur' },
      { name: 'Éléments', description: 'Articles et prix' },
      { name: 'Conformité', description: 'Conditions et exigences' },
      { name: 'Documents', description: 'Fichiers et justificatifs' },
      { name: 'Révision', description: 'Vérification finale' },
    ],
  },
};

// ============ Categories ============
export const CATEGORIES = [
  { value: 'technology', label: 'Technologie & IT' },
  { value: 'supplies', label: 'Fournitures & Consommables' },
  { value: 'services', label: 'Services' },
  { value: 'construction', label: 'Construction & Travaux' },
  { value: 'other', label: 'Autres' },
];

// ============ Requirements ============
export const REQUIREMENT_TYPES = [
  { value: 'technical', label: 'Technique' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'administrative', label: 'Administratif' },
  { value: 'legal', label: 'Légal' },
];

export const REQUIREMENT_PRIORITIES = [
  { value: 'essential', label: 'Essentielle', color: '#d32f2f' },
  { value: 'important', label: 'Important', color: '#ff9800' },
  { value: 'desirable', label: 'Souhaitable', color: '#4caf50' },
];

// ============ Default Values ============
export const DEFAULT_VALUES = {
  OFFER_VALIDITY_DAYS: '90',
  ALERT_TYPE: 'before_48h',
  AWARD_LEVEL: 'lot',
  SUBMISSION_METHOD: 'electronic',
  EVALUATION_CRITERIA: {
    price: 30,
    quality: 40,
    delivery: 20,
    experience: 10,
  },
};

// ============ File Constraints ============
export const FILE_CONSTRAINTS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

// ============ Draft Configuration ============
export const DRAFT_CONFIG = {
  STORAGE_KEY_PREFIX: 'mynet_draft_',
  TIMESTAMP_KEY_PREFIX: 'mynet_draft_timestamp_',
  EXPIRY_DAYS: 7,
};

// ============ API Error Messages ============
export const API_ERROR_MESSAGES = {
  DEFAULT: 'Une erreur est survenue',
  LOAD_TENDER: 'Erreur lors du chargement de la marchandise',
  CREATE_TENDER: 'Erreur lors de la création de la marchandise',
  SUBMIT_OFFER: "Erreur lors de la soumission de l'offre",
};

// ============ Award Levels ============
export const AWARD_LEVELS = {
  LOT: 'lot',
  ARTICLE: 'article',
  TENDER: 'tender',
  LABELS: {
    lot: 'Par Lot',
    article: 'Par Article',
    tender: "Global (Toute l'appel d'offres)",
  },
};

// ============ UI Configuration ============
export const UI_CONFIG = {
  BORDER_RADIUS: '4px',
  SPACING_UNIT: '8px',
  PRIMARY_COLOR: '#0056B3',
  TEXT_COLOR: '#212121',
  BACKGROUND_COLOR: '#FAFAFA',
  BORDER_COLOR: '#E0E0E0',
};

// ============ Validation Configuration ============
export const VALIDATION_CONFIG = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9+\-\s()]+$/,
  MIN_PASSWORD_LENGTH: 8,
};

export default {
  PROCUREMENT_STAGES,
  CATEGORIES,
  REQUIREMENT_TYPES,
  REQUIREMENT_PRIORITIES,
  DEFAULT_VALUES,
  FILE_CONSTRAINTS,
  DRAFT_CONFIG,
  API_ERROR_MESSAGES,
  AWARD_LEVELS,
  UI_CONFIG,
  VALIDATION_CONFIG,
};
