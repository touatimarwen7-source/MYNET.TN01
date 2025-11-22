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
    message: 'بيانات اعتماد غير صحيحة. تحقق من بريدك الإلكتروني وكلمة المرور.',
    severity: 'error'
  },
  ACCOUNT_LOCKED: {
    code: 'A002',
    message: 'حسابك مقفول. حاول مرة أخرى لاحقاً.',
    severity: 'error'
  },
  INVALID_TOKEN: {
    code: 'A003',
    message: 'الرمز المميز غير صحيح أو انتهت صلاحيته.',
    severity: 'error'
  },
  TOKEN_EXPIRED: {
    code: 'A004',
    message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.',
    severity: 'warning'
  },
  UNAUTHORIZED: {
    code: 'A005',
    message: 'غير مصرح لك بالوصول إلى هذا المورد.',
    severity: 'error'
  },
  SESSION_EXPIRED: {
    code: 'A006',
    message: 'انتهت جلستك. سيتم إعادة توجيهك لتسجيل الدخول.',
    severity: 'warning'
  }
};

// ============================================
// Validation Errors (V001 - V099)
// ============================================
export const VALIDATION_ERRORS = {
  INVALID_EMAIL: {
    code: 'V001',
    message: 'صيغة البريد الإلكتروني غير صحيحة.',
    severity: 'error'
  },
  PASSWORD_TOO_SHORT: {
    code: 'V002',
    message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.',
    severity: 'error'
  },
  WEAK_PASSWORD: {
    code: 'V003',
    message: 'كلمة المرور ضعيفة. استخدم أحرف كبيرة وأرقام وأحرف خاصة.',
    severity: 'warning'
  },
  REQUIRED_FIELD: {
    code: 'V004',
    message: 'هذا الحقل مطلوب.',
    severity: 'error'
  },
  INVALID_FORMAT: {
    code: 'V005',
    message: 'الصيغة غير صحيحة.',
    severity: 'error'
  },
  FIELD_ALREADY_EXISTS: {
    code: 'V006',
    message: 'هذا العنصر موجود بالفعل.',
    severity: 'error'
  }
};

// ============================================
// Network/API Errors (N001 - N099)
// ============================================
export const NETWORK_ERRORS = {
  NETWORK_TIMEOUT: {
    code: 'N001',
    message: 'انقطع الاتصال. حاول مرة أخرى.',
    severity: 'warning'
  },
  NO_INTERNET: {
    code: 'N002',
    message: 'لا يوجد اتصال بالإنترنت.',
    severity: 'error'
  },
  BAD_GATEWAY: {
    code: 'N003',
    message: 'خادم الويب غير متاح. حاول لاحقاً.',
    severity: 'error'
  },
  SERVICE_UNAVAILABLE: {
    code: 'N004',
    message: 'الخدمة غير متاحة حالياً.',
    severity: 'warning'
  },
  RATE_LIMIT: {
    code: 'N005',
    message: 'لقد تجاوزت حد الطلبات. حاول مرة أخرى لاحقاً.',
    severity: 'warning'
  },
  REQUEST_FAILED: {
    code: 'N006',
    message: 'فشل الطلب. حاول مرة أخرى.',
    severity: 'error'
  }
};

// ============================================
// Business Logic Errors (B001 - B099)
// ============================================
export const BUSINESS_ERRORS = {
  TENDER_NOT_FOUND: {
    code: 'B001',
    message: 'الطلب غير موجود.',
    severity: 'error'
  },
  OFFER_NOT_FOUND: {
    code: 'B002',
    message: 'العرض غير موجود.',
    severity: 'error'
  },
  INSUFFICIENT_BUDGET: {
    code: 'B003',
    message: 'الميزانية غير كافية.',
    severity: 'error'
  },
  DUPLICATE_OFFER: {
    code: 'B004',
    message: 'لقد قدمت عرضاً بالفعل على هذا الطلب.',
    severity: 'warning'
  },
  TENDER_CLOSED: {
    code: 'B005',
    message: 'انتهت مهلة الطلب.',
    severity: 'error'
  },
  PERMISSION_DENIED: {
    code: 'B006',
    message: 'ليس لديك صلاحيات كافية لتنفيذ هذا الإجراء.',
    severity: 'error'
  }
};

// ============================================
// File/Upload Errors (F001 - F099)
// ============================================
export const FILE_ERRORS = {
  FILE_TOO_LARGE: {
    code: 'F001',
    message: 'حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت.',
    severity: 'error'
  },
  INVALID_FILE_TYPE: {
    code: 'F002',
    message: 'نوع الملف غير مدعوم.',
    severity: 'error'
  },
  UPLOAD_FAILED: {
    code: 'F003',
    message: 'فشل تحميل الملف. حاول مرة أخرى.',
    severity: 'error'
  },
  DOWNLOAD_FAILED: {
    code: 'F004',
    message: 'فشل تحميل الملف.',
    severity: 'error'
  }
};

// ============================================
// System Errors (S001 - S099)
// ============================================
export const SYSTEM_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    code: 'S001',
    message: 'حدث خطأ في النظام. يرجى المحاولة لاحقاً.',
    severity: 'error'
  },
  DATABASE_ERROR: {
    code: 'S002',
    message: 'خطأ في قاعدة البيانات.',
    severity: 'error'
  },
  CACHE_ERROR: {
    code: 'S003',
    message: 'خطأ في الذاكرة المؤقتة.',
    severity: 'warning'
  },
  CONFIGURATION_ERROR: {
    code: 'S004',
    message: 'خطأ في التكوين.',
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
      message: 'حدث خطأ غير معروف.',
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
