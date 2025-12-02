/**
 * Unified form helpers for common operations
 * Reduces code duplication across all form components
 */

/**
 * Parse nested field path (e.g., "evaluation_criteria.price" => [...])
 */
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Set nested field value
 */
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    current[key] = current[key] || {};
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
};

/**
 * Format error message consistently
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Une erreur est survenue';
};

/**
 * Calculate step progress percentage
 */
export const calculateProgress = (currentStep, totalSteps) => {
  return ((currentStep + 1) / totalSteps) * 100;
};

/**
 * Format file size for display (e.g., 5242880 => "5MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file constraints
 */
export const validateFile = (
  file,
  maxSizeMB = 10,
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
) => {
  const errors = [];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!file) {
    errors.push('Fichier requis');
    return errors;
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé. Fichiers autorisés: PDF, DOC`);
  }

  if (file.size > maxSizeBytes) {
    errors.push(`Fichier trop volumineux (max ${maxSizeMB}MB)`);
  }

  return errors;
};

/**
 * Validate price constraints
 */
export const validatePrice = (price, { min = 0, max = Infinity, required = true } = {}) => {
  const errors = [];
  const numPrice = parseFloat(price);

  if (required && (!price || price === '')) {
    errors.push('Prix requis');
    return errors;
  }

  if (isNaN(numPrice)) {
    errors.push('Prix invalide (nombre requis)');
    return errors;
  }

  if (numPrice < min) {
    errors.push(`Prix minimum: ${min}`);
  }

  if (numPrice > max) {
    errors.push(`Prix maximum: ${max}`);
  }

  return errors;
};

/**
 * Validate date constraints
 */
export const validateDate = (date, { minDate = null, maxDate = null, required = true } = {}) => {
  const errors = [];

  if (required && !date) {
    errors.push('Date requise');
    return errors;
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    errors.push('Date invalide');
    return errors;
  }

  if (minDate && dateObj < new Date(minDate)) {
    errors.push(`Date minimale: ${minDate}`);
  }

  if (maxDate && dateObj > new Date(maxDate)) {
    errors.push(`Date maximale: ${maxDate}`);
  }

  return errors;
};

/**
 * Validate text field constraints
 */
export const validateTextField = (
  text,
  { minLength = 0, maxLength = Infinity, required = true, pattern = null } = {}
) => {
  const errors = [];

  if (required && (!text || text.trim() === '')) {
    errors.push('Champ requis');
    return errors;
  }

  if (text && text.length < minLength) {
    errors.push(`Minimum ${minLength} caractères`);
  }

  if (text && text.length > maxLength) {
    errors.push(`Maximum ${maxLength} caractères`);
  }

  if (pattern && text && !pattern.test(text)) {
    errors.push('Format invalide');
  }

  return errors;
};

/**
 * Validate Lots structure for CreateTender
 */
export const validateLotsStructure = (lots) => {
  const errors = [];

  if (!lots || lots.length === 0) {
    errors.push('Au moins un lot est requis');
    return errors;
  }

  lots.forEach((lot, idx) => {
    // Check lot has articles
    if (!lot.articles || lot.articles.length === 0) {
      errors.push(`Lot ${idx + 1}: Au moins un article est requis`);
      return;
    }

    // Check article completeness
    lot.articles.forEach((article, aIdx) => {
      if (!article.name || !article.quantity || !article.unit) {
        errors.push(`Lot ${idx + 1}, Article ${aIdx + 1}: Champs obligatoires manquants`);
      }
    });
  });

  return errors;
};

/**
 * Validate award level compatibility with lots count
 */
export const validateAwardLevelCompatibility = (awardLevel, lotsCount) => {
  const errors = [];

  if (awardLevel === 'lot' && lotsCount < 1) {
    errors.push('ترسية par Lot: Au moins 1 lot requis');
  }

  if (awardLevel === 'article') {
    let totalArticles = 0;
    // This requires full lots array, so caller should validate separately
    if (totalArticles < 1) {
      errors.push('ترسية par Article: Au moins 1 article requis');
    }
  }

  return errors;
};
