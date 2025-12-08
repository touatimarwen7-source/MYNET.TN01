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
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validators.isValidEmail(data.email)) {
      errors.email = 'صيغة البريد الإلكتروني غير صحيحة. يجب أن يحتوي على @';
    }

    // Password validation
    if (!data.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (data.password.length < 8) {
      errors.password = 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل';
    } else if (!/[A-Z]/.test(data.password)) {
      errors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل';
    } else if (!/[0-9]/.test(data.password)) {
      errors.password = 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
    }

    // Name validation
    if (!data.name) {
      errors.name = 'الاسم مطلوب';
    } else if (!validators.isValidString(data.name, 2, 100)) {
      errors.name = 'الاسم يجب أن يكون بين 2 و 100 حرف';
    }

    // Phone validation
    if (data.phone && !validators.isValidPhone(data.phone)) {
      errors.phone = 'رقم الهاتف يجب أن يحتوي على أرقام فقط';
    }

    // Company name validation
    if (!data.company_name || data.company_name.trim().length === 0) {
      errors.company_name = 'اسم الشركة مطلوب';
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
      errors.title = 'العنوان مطلوب';
    } else if (!validators.isValidString(data.title, 5, 500)) {
      errors.title = 'العنوان يجب أن يكون بين 5 و 500 حرف';
    }

    // Description validation
    if (!data.description) {
      errors.description = 'الوصف مطلوب';
    } else if (!validators.isValidString(data.description, 10, 10000)) {
      errors.description = 'الوصف يجب أن يكون بين 10 و 10000 حرف';
    }

    // Budget validation
    if (!data.budget && data.budget !== 0) {
      errors.budget = 'الميزانية مطلوبة';
    } else if (!validators.isValidDecimal(data.budget, 0, 999999999)) {
      errors.budget = 'الميزانية يجب أن تكون قيمة موجبة ولا تتجاوز 999,999,999';
    } else if (data.budget < 0) {
      errors.budget = 'الميزانية يجب أن تكون قيمة موجبة';
    }

    // Deadline validation
    if (!data.deadline) {
      errors.deadline = 'الموعد النهائي مطلوب';
    } else if (!validators.isValidDate(data.deadline)) {
      errors.deadline = 'صيغة الموعد النهائي غير صحيحة';
    } else if (new Date(data.deadline) < new Date()) {
      errors.deadline = 'الموعد النهائي يجب أن يكون في المستقبل';
    }

    // Category validation
    if (data.category && !validators.isValidString(data.category, 2, 100)) {
      errors.category = 'الفئة المحددة غير صالحة';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  createOffer: (data) => {
    const errors = {};

    // Tender ID validation
    if (!data.tender_id) {
      errors.tender_id = 'معرّف العطاء مطلوب';
    } else if (!validators.isValidId(data.tender_id)) {
      errors.tender_id = 'معرّف العطاء غير صالح';
    }

    // Offer price validation
    if (!data.offer_price && data.offer_price !== 0) {
      errors.offer_price = 'سعر العرض مطلوب';
    } else if (data.offer_price <= 0) {
      errors.offer_price = 'سعر العرض يجب أن يكون أكبر من صفر';
    } else if (!validators.isValidDecimal(data.offer_price, 0, 999999999)) {
      errors.offer_price = 'سعر العرض غير صالح';
    }

    // Timeline validation
    if (!data.timeline) {
      errors.timeline = 'مدة التسليم مطلوبة';
    } else if (!validators.isValidString(data.timeline, 2, 1000)) {
      errors.timeline = 'مدة التسليم يجب أن تكون بين 2 و 1000 حرف';
    }

    // Technical proposal validation
    if (data.technical_proposal && data.technical_proposal.length < 50) {
      errors.technical_proposal = 'الاقتراح الفني يجب أن يحتوي على 50 حرف على الأقل';
    }

    // Terms validation
    if (data.terms && !validators.isValidString(data.terms, 0, 5000)) {
      errors.terms = 'الشروط يجب ألا تتجاوز 5000 حرف';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  createInvoice: (data) => {
    const errors = {};

    // Supply request ID validation
    if (!data.supply_request_id) {
      errors.supply_request_id = 'معرّف طلب الشراء مطلوب';
    } else if (!validators.isValidId(data.supply_request_id)) {
      errors.supply_request_id = 'معرّف طلب الشراء غير صالح';
    }

    // Amount validation
    if (!data.amount && data.amount !== 0) {
      errors.amount = 'المبلغ مطلوب';
    } else if (typeof data.amount !== 'number' && isNaN(parseFloat(data.amount))) {
      errors.amount = 'المبلغ يجب أن يكون رقماً';
    } else if (!validators.isValidAmount(data.amount)) {
      errors.amount = 'المبلغ يجب أن يكون أكبر من صفر';
    }

    // Tax percentage validation
    if (data.tax_percentage && !validators.isValidPercentage(data.tax_percentage)) {
      errors.tax_percentage = 'نسبة الضريبة يجب أن تكون بين 0% و 100%';
    }

    // Due date validation
    if (!data.due_date) {
      errors.due_date = 'تاريخ الاستحقاق مطلوب';
    } else if (!validators.isValidDate(data.due_date)) {
      errors.due_date = 'صيغة تاريخ الاستحقاق غير صحيحة';
    } else if (data.issue_date && new Date(data.due_date) < new Date(data.issue_date)) {
      errors.due_date = 'تاريخ الاستحقاق يجب أن يكون بعد تاريخ الإصدار';
    }

    // Invoice number validation (if exists, must be unique - checked in controller)
    if (data.invoice_number && !validators.isValidString(data.invoice_number, 1, 50)) {
      errors.invoice_number = 'رقم الفاتورة غير صالح';
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
      return { valid: false, error: 'رقم الصفحة يجب أن يكون رقماً' };
    }
    if (num < 1) {
      return { valid: false, error: 'رقم الصفحة يجب أن يكون 1 على الأقل' };
    }
    if (num > 100000) {
      return { valid: false, error: 'رقم الصفحة يجب ألا يتجاوز 100,000' };
    }
    return { valid: true };
  },

  limit: (limit) => {
    const num = parseInt(limit, 10);
    if (isNaN(num)) {
      return { valid: false, error: 'عدد العناصر يجب أن يكون رقماً' };
    }
    if (num < 1) {
      return { valid: false, error: 'عدد العناصر يجب أن يكون 1 على الأقل' };
    }
    if (num > 1000) {
      return { valid: false, error: 'عدد العناصر يجب ألا يتجاوز 1000' };
    }
    return { valid: true };
  },

  search: (search) => {
    if (!validators.isValidString(search, 1, 500)) {
      return { valid: false, error: 'نص البحث يجب أن يكون بين 1 و 500 حرف' };
    }
    return { valid: true };
  },

  sortBy: (sortBy) => {
    const validFields = ['id', 'created_at', 'updated_at', 'name', 'price', 'rating', 'status'];
    if (!validFields.includes(sortBy)) {
      return { valid: false, error: 'حقل الترتيب غير صالح' };
    }
    return { valid: true };
  },

  sortOrder: (order) => {
    if (order !== 'asc' && order !== 'desc') {
      return { valid: false, error: 'ترتيب الفرز يجب أن يكون asc أو desc' };
    }
    return { valid: true };
  },

  dateRange: (startDate, endDate) => {
    if (!validators.isValidDate(startDate) || !validators.isValidDate(endDate)) {
      return { valid: false, error: 'صيغة التاريخ غير صحيحة' };
    }
    if (new Date(startDate) > new Date(endDate)) {
      return { valid: false, error: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية' };
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
