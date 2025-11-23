/**
 * Validation Helpers - Comprehensive form validation
 */

// File validation
export const validateFile = (file, maxSizeMB = 10, allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) => {
  if (!file) return { valid: false, error: 'Fichier requis' };
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `Taille maximale: ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Type de fichier non autorisé' };
  }
  
  return { valid: true };
};

// Price validation
export const validatePrice = (price, maxBudget = null) => {
  const numPrice = parseFloat(price);
  
  if (!price || isNaN(numPrice)) {
    return { valid: false, error: 'Prix invalide' };
  }
  
  if (numPrice <= 0) {
    return { valid: false, error: 'Le prix doit être supérieur à 0' };
  }
  
  if (maxBudget && numPrice > maxBudget) {
    return { valid: false, error: `Le prix dépasse le budget maximum (${maxBudget} TND)` };
  }
  
  return { valid: true };
};

// Lots validation
export const validateLots = (lots, awardLevel) => {
  if (!lots || lots.length === 0) {
    return { valid: false, error: 'Au moins un lot est requis' };
  }
  
  // Check each lot has articles
  for (const lot of lots) {
    if (!lot.articles || lot.articles.length === 0) {
      return { 
        valid: false, 
        error: `Le lot "${lot.objet}" n'a pas d'articles` 
      };
    }
    
    // Check each article has required fields
    for (const article of lot.articles) {
      if (!article.name || !article.quantity || !article.unit) {
        return { 
          valid: false, 
          error: `Article incomplet dans le lot "${lot.objet}"` 
        };
      }
    }
  }
  
  // Award level validation
  if (awardLevel === 'article') {
    // Each lot can have multiple articles
    return { valid: true };
  } else if (awardLevel === 'lot') {
    // Each lot is awarded to one supplier
    return { valid: true };
  } else if (awardLevel === 'tender') {
    // Entire tender is awarded to one supplier
    return { valid: true };
  }
  
  return { valid: false, error: 'Niveau de ترسية invalide' };
};

// Line items validation (for offers/bids)
export const validateLineItems = (lineItems, budgetMax) => {
  if (!lineItems || lineItems.length === 0) {
    return { valid: false, error: 'Au moins un article est requis' };
  }
  
  let totalPrice = 0;
  
  for (let i = 0; i < lineItems.length; i++) {
    const item = lineItems[i];
    
    if (!item.unit_price || isNaN(parseFloat(item.unit_price))) {
      return { 
        valid: false, 
        error: `Article ${i + 1}: Prix unitaire invalide` 
      };
    }
    
    const price = parseFloat(item.unit_price);
    if (price <= 0) {
      return { 
        valid: false, 
        error: `Article ${i + 1}: Le prix doit être supérieur à 0` 
      };
    }
    
    const quantity = parseFloat(item.quantity) || 1;
    totalPrice += price * quantity;
  }
  
  if (budgetMax && totalPrice > budgetMax) {
    return { 
      valid: false, 
      error: `Le total (${totalPrice.toFixed(2)} TND) dépasse le budget (${budgetMax} TND)` 
    };
  }
  
  return { valid: true };
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, error: 'Email invalide' };
  }
  return { valid: true };
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
  if (!phone || !phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 8) {
    return { valid: false, error: 'Numéro de téléphone invalide' };
  }
  return { valid: true };
};

// Budget validation
export const validateBudget = (min, max) => {
  // Allow empty budgets - they can be filled later
  if (!min && !max) {
    return { valid: true };
  }
  
  const minNum = parseFloat(min);
  const maxNum = parseFloat(max);
  
  if ((min && isNaN(minNum)) || (max && isNaN(maxNum))) {
    return { valid: false, error: 'Les budgets doivent être des nombres valides' };
  }
  
  if ((minNum && minNum < 0) || (maxNum && maxNum < 0)) {
    return { valid: false, error: 'Le budget ne peut pas être négatif' };
  }
  
  if (minNum > maxNum && minNum && maxNum) {
    return { valid: false, error: 'Budget min doit être ≤ budget max' };
  }
  
  return { valid: true };
};

// Deadline validation - Allow moving to next step without deadline
export const validateDeadline = (deadline) => {
  // Deadline is optional for navigating steps
  if (!deadline) {
    return { valid: true };
  }
  
  const date = new Date(deadline);
  const now = new Date();
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Format de date invalide' };
  }
  
  if (date <= now) {
    return { valid: false, error: 'La date doit être dans le futur' };
  }
  
  return { valid: true };
};

// API Error Handler
export const handleAPIError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 401) {
    return 'Non authentifié. Veuillez vous connecter.';
  }
  
  if (error.response?.status === 403) {
    return 'Accès refusé. Vous n\'avez pas les permissions.';
  }
  
  if (error.response?.status === 404) {
    return 'Ressource non trouvée.';
  }
  
  if (error.response?.status === 409) {
    return 'Conflit: Les données n\'ont pas pu être traitées.';
  }
  
  if (error.response?.status === 413) {
    return 'Fichier trop volumineux.';
  }
  
  if (error.response?.status === 422) {
    return 'Données invalides. Veuillez vérifier vos entrées.';
  }
  
  if (error.message === 'Network Error') {
    return 'Erreur réseau. Vérifiez votre connexion.';
  }
  
  return error.message || 'Une erreur inconnue s\'est produite';
};
