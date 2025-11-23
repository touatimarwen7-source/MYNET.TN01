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
    
    if (!data.email || !validators.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!data.password || data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!data.name || !validators.isValidString(data.name, 2, 100)) {
      errors.name = 'Name must be 2-100 characters';
    }
    
    if (data.phone && !validators.isValidPhone(data.phone)) {
      errors.phone = 'Invalid phone format';
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
    
    if (!data.title || !validators.isValidString(data.title, 5, 500)) {
      errors.title = 'Title must be 5-500 characters';
    }
    
    if (!data.description || !validators.isValidString(data.description, 10, 10000)) {
      errors.description = 'Description must be 10-10000 characters';
    }
    
    if (!data.budget || !validators.isValidDecimal(data.budget, 0, 999999999)) {
      errors.budget = 'Invalid budget amount';
    }
    
    if (!data.deadline || !validators.isValidDate(data.deadline)) {
      errors.deadline = 'Invalid deadline date';
    }
    
    if (data.category && !validators.isValidString(data.category, 2, 100)) {
      errors.category = 'Invalid category';
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
  },

  createOffer: (data) => {
    const errors = {};
    
    if (!data.tender_id || !validators.isValidId(data.tender_id)) {
      errors.tender_id = 'Invalid tender ID';
    }
    
    if (!data.offer_price || !validators.isValidDecimal(data.offer_price, 0, 999999999)) {
      errors.offer_price = 'Invalid offer price';
    }
    
    if (!data.timeline || !validators.isValidString(data.timeline, 2, 1000)) {
      errors.timeline = 'Invalid timeline';
    }
    
    if (!data.terms && data.terms && !validators.isValidString(data.terms, 0, 5000)) {
      errors.terms = 'Terms too long (max 5000 characters)';
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
  },

  createInvoice: (data) => {
    const errors = {};
    
    if (!data.supply_request_id || !validators.isValidId(data.supply_request_id)) {
      errors.supply_request_id = 'Invalid supply request ID';
    }
    
    if (!data.amount || !validators.isValidAmount(data.amount)) {
      errors.amount = 'Invalid invoice amount';
    }
    
    if (data.tax_percentage && !validators.isValidPercentage(data.tax_percentage)) {
      errors.tax_percentage = 'Tax must be 0-100%';
    }
    
    if (!data.due_date || !validators.isValidDate(data.due_date)) {
      errors.due_date = 'Invalid due date';
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
 * Pagination/Query Validators
 */
const queryValidators = {
  page: (page) => {
    const num = parseInt(page, 10);
    return num && num > 0 && num <= 100000;
  },

  limit: (limit) => {
    const num = parseInt(limit, 10);
    // Prevent DoS - limit max records per request
    return num && num > 0 && num <= 1000;
  },

  search: (search) => {
    return validators.isValidString(search, 1, 500);
  },

  sortBy: (sortBy) => {
    const validFields = ['id', 'created_at', 'updated_at', 'name', 'price', 'rating', 'status'];
    return validFields.includes(sortBy);
  },

  sortOrder: (order) => {
    return order === 'asc' || order === 'desc';
  },

  dateRange: (startDate, endDate) => {
    if (!validators.isValidDate(startDate) || !validators.isValidDate(endDate)) {
      return false;
    }
    return new Date(startDate) <= new Date(endDate);
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
