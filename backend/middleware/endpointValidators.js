/**
 * 🛡️ ENDPOINT-SPECIFIC VALIDATORS
 * Validates input for specific API endpoints
 * Prevents SQL injection, XSS, and data validation errors
 */

const { validators, validateFields, sanitizers } = require('./validationMiddleware');

/**
 * Authentication Validators
 */
const authValidators = {
  register: (data) => {
    const errors = {};

    // Email validation
    if (!data.email) {
      errors.email = 'L\'adresse email est requise';
    } else if (!validators.isValidEmail(data.email)) {
      errors.email = 'Format d\'email invalide. Doit contenir @';
    }

    // Password validation
    if (!data.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (data.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/[A-Z]/.test(data.password)) {
      errors.password = 'Le mot de passe doit contenir au moins une majuscule';
    } else if (!/[0-9]/.test(data.password)) {
      errors.password = 'Le mot de passe doit contenir au moins un chiffre';
    }

    // Name validation
    if (!data.name) {
      errors.name = 'Le nom est requis';
    } else if (!validators.isValidString(data.name, 2, 100)) {
      errors.name = 'Le nom doit contenir entre 2 et 100 caractères';
    }

    // Phone validation
    if (data.phone && !validators.isValidPhone(data.phone)) {
      errors.phone = 'Le numéro de téléphone ne doit contenir que des chiffres';
    }

    // Company name validation
    if (!data.company_name || data.company_name.trim().length === 0) {
      errors.company_name = 'Le nom de l\'entreprise est requis';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  login: (data) => {
    const errors = {};

    if (!data.email || !validators.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (!data.password || typeof data.password !== 'string') {
      errors.password = 'Password is required';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  updateProfile: (data) => {
    const errors = {};

    if (data.email && !validators.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (data.phone && !validators.isValidPhone(data.phone)) {
      errors.phone = 'Invalid phone format';
    }

    if (data.name && !validators.isValidString(data.name, 2, 100)) {
      errors.name = 'Name must be 2-100 characters';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },
};

/**
 * Procurement Validators
 */
const procurementValidators = {
  createTender: (data) => {
    const errors = {};

    // Title validation
    if (!data.title) {
      errors.title = 'Le titre est requis';
    } else if (!validators.isValidString(data.title, 5, 500)) {
      errors.title = 'Le titre doit contenir entre 5 et 500 caractères';
    }

    // Description validation
    if (!data.description) {
      errors.description = 'La description est requise';
    } else if (!validators.isValidString(data.description, 10, 10000)) {
      errors.description = 'La description doit contenir entre 10 et 10000 caractères';
    }

    // Budget validation
    if (!data.budget && data.budget !== 0) {
      errors.budget = 'Le budget est requis';
    } else if (!validators.isValidDecimal(data.budget, 0, 999999999)) {
      errors.budget = 'Le budget doit être positif et ne pas dépasser 999,999,999';
    } else if (data.budget < 0) {
      errors.budget = 'Le budget doit être positif';
    }

    // Deadline validation
    if (!data.deadline) {
      errors.deadline = 'La date limite est requise';
    } else if (!validators.isValidDate(data.deadline)) {
      errors.deadline = 'Format de date limite invalide';
    } else if (new Date(data.deadline) < new Date()) {
      errors.deadline = 'La date limite doit être dans le futur';
    }

    // Category validation
    if (data.category && !validators.isValidString(data.category, 2, 100)) {
      errors.category = 'Catégorie invalide';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  createOffer: (data) => {
    const errors = {};

    // Tender ID validation
    if (!data.tender_id) {
      errors.tender_id = 'L\'identifiant de l\'appel d\'offres est requis';
    } else if (!validators.isValidId(data.tender_id)) {
      errors.tender_id = 'Identifiant de l\'appel d\'offres invalide';
    }

    // Offer price validation
    if (!data.offer_price && data.offer_price !== 0) {
      errors.offer_price = 'Le prix de l\'offre est requis';
    } else if (data.offer_price <= 0) {
      errors.offer_price = 'Le prix de l\'offre doit être supérieur à zéro';
    } else if (!validators.isValidDecimal(data.offer_price, 0, 999999999)) {
      errors.offer_price = 'Prix de l\'offre invalide';
    }

    // Timeline validation
    if (!data.timeline) {
      errors.timeline = 'Le délai de livraison est requis';
    } else if (!validators.isValidString(data.timeline, 2, 1000)) {
      errors.timeline = 'Le délai de livraison doit contenir entre 2 et 1000 caractères';
    }

    // Technical proposal validation
    if (data.technical_proposal && data.technical_proposal.length < 50) {
      errors.technical_proposal = 'La proposition technique doit contenir au moins 50 caractères';
    }

    // Terms validation
    if (data.terms && !validators.isValidString(data.terms, 0, 5000)) {
      errors.terms = 'Les conditions ne doivent pas dépasser 5000 caractères';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  createInvoice: (data) => {
    const errors = {};

    // Supply request ID validation
    if (!data.supply_request_id) {
      errors.supply_request_id = 'L\'identifiant de la demande d\'approvisionnement est requis';
    } else if (!validators.isValidId(data.supply_request_id)) {
      errors.supply_request_id = 'Identifiant de la demande d\'approvisionnement invalide';
    }

    // Amount validation
    if (!data.amount && data.amount !== 0) {
      errors.amount = 'Le montant est requis';
    } else if (typeof data.amount !== 'number' && isNaN(parseFloat(data.amount))) {
      errors.amount = 'Le montant doit être un nombre';
    } else if (!validators.isValidAmount(data.amount)) {
      errors.amount = 'Le montant doit être supérieur à zéro';
    }

    // Tax percentage validation
    if (data.tax_percentage && !validators.isValidPercentage(data.tax_percentage)) {
      errors.tax_percentage = 'Le pourcentage de taxe doit être entre 0% et 100%';
    }

    // Due date validation
    if (!data.due_date) {
      errors.due_date = 'La date d\'échéance est requise';
    } else if (!validators.isValidDate(data.due_date)) {
      errors.due_date = 'Format de date d\'échéance invalide';
    } else if (data.issue_date && new Date(data.due_date) < new Date(data.issue_date)) {
      errors.due_date = 'La date d\'échéance doit être après la date d\'émission';
    }

    // Invoice number validation (if exists, must be unique - checked in controller)
    if (data.invoice_number && !validators.isValidString(data.invoice_number, 1, 50)) {
      errors.invoice_number = 'Numéro de facture invalide';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },
};

/**
 * Review Validators
 */
const reviewValidators = {
  createReview: (data) => {
    const errors = {};

    if (!data.supplier_id || !validators.isValidId(data.supplier_id)) {
      errors.supplier_id = 'Invalid supplier ID';
    }

    if (!data.rating || !validators.isValidRating(data.rating)) {
      errors.rating = 'Rating must be 1-5 stars';
    }

    if (data.comment && !validators.isValidString(data.comment, 0, 2000)) {
      errors.comment = 'Comment too long (max 2000 characters)';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },
};

/**
 * Pagination/Query Validators with Arabic error messages
 */
const queryValidators = {
  page: (page) => {
    const num = parseInt(page, 10);
    if (isNaN(num)) {
      return { valid: false, error: 'Le numéro de page doit être un nombre' };
    }
    if (num < 1) {
      return { valid: false, error: 'Le numéro de page doit être au moins 1' };
    }
    if (num > 100000) {
      return { valid: false, error: 'Le numéro de page ne doit pas dépasser 100,000' };
    }
    return { valid: true };
  },

  limit: (limit) => {
    const num = parseInt(limit, 10);
    if (isNaN(num)) {
      return { valid: false, error: 'Le nombre d\'éléments doit être un nombre' };
    }
    if (num < 1) {
      return { valid: false, error: 'Le nombre d\'éléments doit être au moins 1' };
    }
    if (num > 1000) {
      return { valid: false, error: 'Le nombre d\'éléments ne doit pas dépasser 1000' };
    }
    return { valid: true };
  },

  search: (search) => {
    if (!validators.isValidString(search, 1, 500)) {
      return { valid: false, error: 'Le texte de recherche doit contenir entre 1 et 500 caractères' };
    }
    return { valid: true };
  },

  sortBy: (sortBy) => {
    const validFields = ['id', 'created_at', 'updated_at', 'name', 'price', 'rating', 'status'];
    if (!validFields.includes(sortBy)) {
      return { valid: false, error: 'Champ de tri invalide' };
    }
    return { valid: true };
  },

  sortOrder: (order) => {
    if (order !== 'asc' && order !== 'desc') {
      return { valid: false, error: 'L\'ordre de tri doit être asc ou desc' };
    }
    return { valid: true };
  },

  dateRange: (startDate, endDate) => {
    if (!validators.isValidDate(startDate) || !validators.isValidDate(endDate)) {
      return { valid: false, error: 'Format de date invalide' };
    }
    if (new Date(startDate) > new Date(endDate)) {
      return { valid: false, error: 'La date de début doit être avant la date de fin' };
    }
    return { valid: true };
  },
};

/**
 * ID Parameter Validator
 */
const idValidators = {
  validateId: (id) => {
    if (!id || !validators.isValidId(id)) {
      return { error: 'Invalid ID format' };
    }
    return null;
  },

  validateIds: (ids) => {
    if (!Array.isArray(ids) || !validators.isValidArray(ids, 1, 1000)) {
      return { error: 'Invalid ID list' };
    }
    for (const id of ids) {
      if (!validators.isValidId(id)) {
        return { error: `Invalid ID format: ${id}` };
      }
    }
    return null;
  },
};

/**
 * Middleware: Attach validators to request
 */
function attachValidators(req, res, next) {
  req.authValidators = authValidators;
  req.procurementValidators = procurementValidators;
  req.reviewValidators = reviewValidators;
  req.queryValidators = queryValidators;
  req.idValidators = idValidators;
  next();
}

module.exports = {
  authValidators,
  procurementValidators,
  reviewValidators,
  queryValidators,
  idValidators,
  attachValidators,
};
