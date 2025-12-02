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

The application uses a comprehensive error handling system with centralized error codes and messages in **French**.

**Key Features:**

- ✅ Centralized error codes (A001, V001, N001, etc.)
- ✅ User-friendly French error messages
- ✅ Error severity levels (error, warning, info)
- ✅ HTTP status code mapping
- ✅ Retry logic for transient failures
- ✅ Development logging
- ✅ Production error tracking ready

### Error Code Structure

```javascript
{
  code: 'A001',                  // Unique error identifier
  message: 'Message français',   // User-friendly message (French)
  severity: 'error'              // 'error' | 'warning' | 'info'
}
```

### Using Error Codes

```javascript
import { errorHandler } from './utils/errorHandler';

// Get error message from exception
const error = new Error('Something failed');
const formatted = errorHandler.getUserMessage(error);
// → { code: 'S001', message: 'Une erreur système s\'est produite...', severity: 'error' }

// Format validation errors
const validationErrors = { email: 'Invalid email' };
const formatted = errorHandler.formatValidationErrors(validationErrors);
// → { email: { code: 'V005', message: 'Invalid email' } }

// Retry transient failures
try {
  await errorHandler.retry(
    () => fetch('/api/data'),
    3, // max retries
    1000 // initial delay (ms)
  );
} catch (error) {
  console.error('Failed after retries:', error);
}

// Safe error handling (Go-style)
const [error, data] = await errorHandler.handle(fetch('/api/data'));
if (error) {
  console.error(error.code, error.message);
} else {
  console.log('Success:', data);
}
```

---

## Error Codes Reference

### Authentication Errors (A001-A099)

| Code | Message                                                                       | Severity |
| ---- | ----------------------------------------------------------------------------- | -------- |
| A001 | Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe. | error    |
| A002 | Votre compte est verrouillé. Veuillez réessayer plus tard.                    | error    |
| A003 | Le jeton est invalide ou expiré.                                              | error    |
| A004 | Votre session a expiré. Veuillez vous reconnecter.                            | warning  |
| A005 | Vous n'êtes pas autorisé à accéder à cette ressource.                         | error    |
| A006 | Votre session a expiré. Vous serez redirigé vers la page de connexion.        | warning  |

### Validation Errors (V001-V099)

| Code | Message                                                                                       | Severity |
| ---- | --------------------------------------------------------------------------------------------- | -------- |
| V001 | Le format de l'email est invalide.                                                            | error    |
| V002 | Le mot de passe doit contenir au moins 8 caractères.                                          | error    |
| V003 | Le mot de passe est faible. Utilisez des majuscules, des chiffres et des caractères spéciaux. | warning  |
| V004 | Ce champ est obligatoire.                                                                     | error    |
| V005 | Le format est invalide.                                                                       | error    |
| V006 | Cet élément existe déjà.                                                                      | error    |

### Network Errors (N001-N099)

| Code | Message                                                                | Severity |
| ---- | ---------------------------------------------------------------------- | -------- |
| N001 | La connexion a été perdue. Veuillez réessayer.                         | warning  |
| N002 | Vous n'avez pas de connexion Internet.                                 | error    |
| N003 | Le serveur Web n'est pas disponible. Veuillez réessayer plus tard.     | error    |
| N004 | Le service n'est pas disponible pour le moment.                        | warning  |
| N005 | Vous avez dépassé la limite de requêtes. Veuillez réessayer plus tard. | warning  |
| N006 | La requête a échoué. Veuillez réessayer.                               | error    |

### Business Logic Errors (B001-B099)

| Code | Message                                                                  | Severity |
| ---- | ------------------------------------------------------------------------ | -------- |
| B001 | L'appel d'offres n'a pas été trouvé.                                     | error    |
| B002 | L'offre n'a pas été trouvée.                                             | error    |
| B003 | Le budget est insuffisant.                                               | error    |
| B004 | Vous avez déjà soumis une offre pour cet appel d'offres.                 | warning  |
| B005 | La date limite de cet appel d'offres est dépassée.                       | error    |
| B006 | Vous n'avez pas les permissions suffisantes pour effectuer cette action. | error    |

### File Errors (F001-F099)

| Code | Message                                                                | Severity |
| ---- | ---------------------------------------------------------------------- | -------- |
| F001 | La taille du fichier est trop grande. La limite maximale est de 10 Mo. | error    |
| F002 | Le type de fichier n'est pas supporté.                                 | error    |
| F003 | Le téléchargement du fichier a échoué. Veuillez réessayer.             | error    |
| F004 | Le téléchargement du fichier a échoué.                                 | error    |

### System Errors (S001-S099)

| Code | Message                                                          | Severity |
| ---- | ---------------------------------------------------------------- | -------- |
| S001 | Une erreur système s'est produite. Veuillez réessayer plus tard. | error    |
| S002 | Erreur de base de données.                                       | error    |
| S003 | Erreur de cache.                                                 | warning  |
| S004 | Erreur de configuration.                                         | error    |

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
3. **French messages** - All user-facing messages must be in French
4. **Consistent naming** - camelCase for functions, UPPER_CASE for constants
5. **Comments** - Add comments for complex logic, not obvious code

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
| ------ | ---------- | -------- |
| 400    | A001       | error    |
| 401    | A005       | error    |
| 403    | B006       | error    |
| 404    | B001       | error    |
| 408    | N001       | warning  |
| 429    | N005       | warning  |
| 500    | S001       | error    |
| 502    | N003       | error    |
| 503    | N004       | warning  |
| 504    | N001       | warning  |

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
3. Write message in French
4. Update HTTP_ERROR_MAP if needed
5. Document in this file

### Adding New Functions

1. Add complete JSDoc with @param, @returns
2. Add @example with usage
3. Use error codes if throwing errors
4. Write French error messages
5. Update this documentation

### Updating Error Messages

1. Edit `utils/errorCodes.js`
2. Always provide French translations
3. Keep messages user-friendly and concise
4. Update HTTP_ERROR_MAP if needed

---

**Last Updated**: November 22, 2025  
**Language**: French (Français)  
**Status**: Production Ready ✅
