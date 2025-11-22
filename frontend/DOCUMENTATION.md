# MyNet.tn - Developer Documentation

## 📚 Table of Contents

1. [Error Handling System](#error-handling-system)
2. [Error Codes Reference](#error-codes-reference)
3. [JSDoc & Code Documentation](#jsdoc--code-documentation)
4. [Function Signatures](#function-signatures)
5. [Contributing Guidelines](#contributing-guidelines)

---

## Error Handling System

### Overview

The application uses a comprehensive error handling system with centralized error codes and messages.

**Key Features:**
- ✅ Centralized error codes (A001, V001, N001, etc.)
- ✅ User-friendly Arabic error messages
- ✅ Error severity levels (error, warning, info)
- ✅ HTTP status code mapping
- ✅ Retry logic for transient failures
- ✅ Development logging
- ✅ Production error tracking ready

### Error Code Structure

```javascript
{
  code: 'A001',           // Unique error identifier
  message: 'Arabic...',   // User-friendly message (Arabic)
  severity: 'error'       // 'error' | 'warning' | 'info'
}
```

### Using Error Codes

```javascript
import { errorHandler } from './utils/errorHandler';

// Get error message from exception
const error = new Error('Something failed');
const formatted = errorHandler.getUserMessage(error);
// → { code: 'S001', message: 'حدث خطأ...', severity: 'error' }

// Format validation errors
const validationErrors = { email: 'Invalid email' };
const formatted = errorHandler.formatValidationErrors(validationErrors);
// → { email: { code: 'V005', message: 'Invalid email' } }

// Retry transient failures
try {
  await errorHandler.retry(
    () => fetch('/api/data'),
    3,        // max retries
    1000      // initial delay (ms)
  );
} catch (error) {
  console.error('Failed after retries:', error);
}

// Safe error handling (Go-style)
const [error, data] = await errorHandler.handle(
  fetch('/api/data')
);
if (error) {
  console.error(error.code, error.message);
} else {
  console.log('Success:', data);
}
```

---

## Error Codes Reference

### Authentication Errors (A001-A099)

| Code | Message | Severity |
|------|---------|----------|
| A001 | بيانات اعتماد غير صحيحة | error |
| A002 | حسابك مقفول | error |
| A003 | الرمز المميز غير صحيح | error |
| A004 | انتهت صلاحية الجلسة | warning |
| A005 | غير مصرح لك بالوصول | error |
| A006 | انتهت جلستك | warning |

### Validation Errors (V001-V099)

| Code | Message | Severity |
|------|---------|----------|
| V001 | صيغة البريد غير صحيحة | error |
| V002 | كلمة المرور قصيرة جداً | error |
| V003 | كلمة المرور ضعيفة | warning |
| V004 | هذا الحقل مطلوب | error |
| V005 | الصيغة غير صحيحة | error |
| V006 | هذا العنصر موجود بالفعل | error |

### Network Errors (N001-N099)

| Code | Message | Severity |
|------|---------|----------|
| N001 | انقطع الاتصال | warning |
| N002 | لا يوجد اتصال بالإنترنت | error |
| N003 | خادم الويب غير متاح | error |
| N004 | الخدمة غير متاحة | warning |
| N005 | تجاوزت حد الطلبات | warning |
| N006 | فشل الطلب | error |

### Business Logic Errors (B001-B099)

| Code | Message | Severity |
|------|---------|----------|
| B001 | الطلب غير موجود | error |
| B002 | العرض غير موجود | error |
| B003 | الميزانية غير كافية | error |
| B004 | لقد قدمت عرضاً بالفعل | warning |
| B005 | انتهت مهلة الطلب | error |
| B006 | ليس لديك صلاحيات كافية | error |

### File Errors (F001-F099)

| Code | Message | Severity |
|------|---------|----------|
| F001 | حجم الملف كبير جداً | error |
| F002 | نوع الملف غير مدعوم | error |
| F003 | فشل تحميل الملف | error |
| F004 | فشل تحميل الملف | error |

### System Errors (S001-S099)

| Code | Message | Severity |
|------|---------|----------|
| S001 | حدث خطأ في النظام | error |
| S002 | خطأ في قاعدة البيانات | error |
| S003 | خطأ في الذاكرة المؤقتة | warning |
| S004 | خطأ في التكوين | error |

---

## JSDoc & Code Documentation

### Module Documentation

All modules have JSDoc headers:

```javascript
/**
 * Module Description
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * 
 * @module moduleName
 * @requires dependency1 - Description
 * @requires dependency2 - Description
 */
```

### Function Documentation

All functions have complete JSDoc:

```javascript
/**
 * Function description
 * 
 * @param {type} paramName - Parameter description
 * @param {type} [optionalParam='default'] - Optional parameter
 * @returns {type} Return value description
 * 
 * @example
 * const result = functionName('value');
 * console.log(result); // → output
 */
function functionName(paramName, optionalParam = 'default') {
  // implementation
}
```

### Documentation Coverage

**Files with Complete JSDoc:**
- ✅ tokenManager.js - Token storage/retrieval
- ✅ axiosConfig.js - HTTP client configuration
- ✅ csrfProtection.js - CSRF token management
- ✅ validation.js - Input validation utilities
- ✅ errorHandler.js - Error handling
- ✅ errorCodes.js - Error definitions

---

## Function Signatures

### Token Management

```javascript
// Store access token
TokenManager.setAccessToken(token, expiresIn = 900)

// Get access token (null if expired)
TokenManager.getAccessToken() → string | null

// Check if token is valid
TokenManager.isTokenValid() → boolean

// Get time until token expiry
TokenManager.getTimeUntilExpiry() → number

// Should refresh token (< 2 min until expiry)
TokenManager.shouldRefreshToken() → boolean

// Clear all tokens
TokenManager.clearTokens() → void

// Decode JWT token
TokenManager.decodeToken(token) → object | null

// Get user info from token
TokenManager.getUserFromToken() → object | null
```

### Error Handling

```javascript
// Get user-friendly error message
errorHandler.getUserMessage(error, defaultMessage) 
  → { code, message, severity }

// Get error from HTTP status
errorHandler.getStatusError(statusCode) 
  → { code, message, severity }

// Check if error is auth-related
errorHandler.isAuthError(error) → boolean

// Handle auth error and logout
errorHandler.handleAuthError() → void

// Check if error should be retried
errorHandler.isRetryable(error) → boolean

// Format validation errors
errorHandler.formatValidationErrors(errors) 
  → { fieldName: { code, message } }

// Safe promise handler (Go-style)
[error, data] = await errorHandler.handle(promise)

// Retry with exponential backoff
await errorHandler.retry(fn, maxRetries = 3, initialDelay = 1000)
```

### Validation Functions

```javascript
// Email validation
validation.isValidEmail(email) → boolean

// Phone validation
validation.isValidPhone(phone) → boolean

// Number validation
validation.isValidNumber(value, min = 0, max = Infinity) → boolean

// String length validation
validation.isValidLength(str, min = 1, max = 255) → boolean

// Date validation
validation.isValidDate(dateString) → boolean

// URL validation
validation.isValidUrl(url) → boolean

// File validation
validation.isValidFile(file, maxSizeMB = 10, allowedTypes = []) → boolean

// Currency amount validation
validation.isValidAmount(amount, maxAmount = 999999999) → boolean

// Sanitize string (XSS prevention)
validation.sanitizeString(str) → string
```

### CSRF Protection

```javascript
// Generate CSRF token
CSRFProtection.generateToken() → string

// Get CSRF token
CSRFProtection.getToken() → string

// Update meta tag
CSRFProtection.updateMetaTag(token) → void

// Initialize CSRF
CSRFProtection.initialize() → void

// Verify CSRF token
CSRFProtection.verifyToken(responseToken) → boolean

// Clear CSRF token
CSRFProtection.clearToken() → void
```

---

## Contributing Guidelines

### Code Style

1. **Always add JSDoc** - Every function needs JSDoc with @param, @returns, @example
2. **Use error codes** - Never hardcode error messages, use error codes
3. **Consistent naming** - camelCase for functions, UPPER_CASE for constants
4. **Comments** - Add comments for complex logic, not obvious code

### Error Handling

1. **Use error codes** - Import from errorCodes.js
2. **Format errors** - Always use errorHandler.formatError()
3. **Log errors** - Use errorHandler.logError(error, context)
4. **Retry transient** - Use errorHandler.retry() for network requests

### Validation

1. **Use validation functions** - Import from validation.js
2. **Sanitize user input** - Always use validation.sanitizeString()
3. **Format errors** - Use errorHandler.formatValidationErrors()

### Testing

1. **Test error codes** - Verify error code is correct
2. **Test validation** - Test with valid and invalid inputs
3. **Test retry logic** - Test with network failures

### Documentation

1. **JSDoc required** - Every function must have JSDoc
2. **Type hints** - Always specify parameter and return types
3. **Examples** - Add @example for complex functions
4. **Updates** - Update this file when adding features

---

## API Error Map

HTTP status codes are automatically mapped to error codes:

| Status | Error Code | Severity |
|--------|-----------|----------|
| 400 | A001 | error |
| 401 | A005 | error |
| 403 | B006 | error |
| 404 | B001 | error |
| 408 | N001 | warning |
| 429 | N005 | warning |
| 500 | S001 | error |
| 502 | N003 | error |
| 503 | N004 | warning |
| 504 | N001 | warning |

---

## File Structure

```
frontend/src/
├── utils/
│   ├── errorCodes.js          ← Error definitions + codes
│   ├── errorHandler.js        ← Error handling utilities
│   ├── validation.js          ← Validation functions
│   ├── csrfProtection.js      ← CSRF token management
│   └── ...
├── services/
│   ├── tokenManager.js        ← Token storage/retrieval
│   ├── axiosConfig.js         ← HTTP client config
│   └── ...
├── components/
│   └── ... (91 components)
└── pages/
    └── ... (59 pages)
```

---

## Maintenance

### Adding New Error Codes

1. Edit `utils/errorCodes.js`
2. Add to appropriate category (A, V, N, B, F, S)
3. Update HTTP_ERROR_MAP if needed
4. Document in this file

### Adding New Functions

1. Add complete JSDoc with @param, @returns
2. Add @example with usage
3. Use error codes if throwing errors
4. Update this documentation

### Updating Error Messages

1. Edit `utils/errorCodes.js`
2. Always provide Arabic translations
3. Keep messages user-friendly and concise
4. Update HTTP_ERROR_MAP if needed

---

**Last Updated**: November 22, 2025
**Maintained By**: Development Team
