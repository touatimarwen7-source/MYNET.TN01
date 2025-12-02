# 🛡️ COMPREHENSIVE ERROR HANDLING GUIDE

## Overview

MyNet.tn now features a complete, production-grade error handling system across the entire application:

- ✅ **Backend**: Custom error classes, middleware, standardized responses
- ✅ **Frontend**: Error boundaries, hooks, centralized error handling
- ✅ **API Communication**: Error interceptors, retry logic, user-friendly messages
- ✅ **Forms**: Validation error handling and display
- ✅ **Logging**: Development and production error tracking

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING STACK                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  USER INTERFACE                                              │
│  ├─ ErrorBoundary (Catches React errors)                    │
│  ├─ ToastContainer (Displays error messages)                │
│  └─ Form validation (Field-level errors)                    │
│                                                               │
│  APPLICATION LAYER                                           │
│  ├─ useErrorHandler Hook (Error handling in components)     │
│  ├─ Axios Error Interceptor (API error handling)            │
│  └─ errorHandler Utility (Error formatting & logging)       │
│                                                               │
│  API LAYER                                                   │
│  ├─ Axios Instance (HTTP client with config)                │
│  └─ Token Management (Auto-refresh on 401)                  │
│                                                               │
│  BACKEND API LAYER                                           │
│  ├─ Global Error Handler (Catches all errors)               │
│  ├─ Error Classes (Typed error responses)                   │
│  ├─ Admin Middleware (Rate limiting, validation)            │
│  └─ 404 Handler (Unknown routes)                            │
│                                                               │
│  DATABASE LAYER                                              │
│  └─ PostgreSQL Error Handling (Constraint violations)        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Error Handling

### 1. Error Classes

**Location**: `backend/utils/errorClasses.js`

```javascript
// Base error class
AppError
  ├─ ValidationError (400)
  ├─ AuthenticationError (401)
  ├─ AuthorizationError (403)
  ├─ NotFoundError (404)
  ├─ ConflictError (409)
  ├─ RateLimitError (429)
  ├─ DatabaseError (500)
  ├─ FileError (400)
  └─ ExternalServiceError (502)
```

**Usage**:

```javascript
const { ValidationError, NotFoundError } = require("../utils/errorClasses");

// Throw validation error
throw new ValidationError("Email is required", { field: "email" });

// Throw not found error
throw new NotFoundError("User", userId);
```

### 2. Error Handling Middleware

**Location**: `backend/middleware/errorHandlingMiddleware.js`

**Features**:

- ✅ Global error handler catches all errors
- ✅ 404 handler for unknown routes
- ✅ Validation ID parameter validator
- ✅ Async error wrapper for route handlers
- ✅ Success response helpers

**Usage in Routes**:

```javascript
const { asyncHandler } = require("../middleware/errorHandlingMiddleware");

// Wrap async route handlers
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError("User", req.params.id);
    }
    res.json(user);
  }),
);
```

### 3. Error Response Format

**Success Response** (2xx):

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-01-20T14:30:45Z"
}
```

**Error Response** (4xx/5xx):

```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "RESOURCE_NOT_FOUND",
    "statusCode": 404,
    "details": {
      "resource": "User",
      "id": 123
    },
    "requestId": "req_abc123def456",
    "timestamp": "2025-01-20T14:30:45Z"
  }
}
```

### 4. Common Backend Error Scenarios

**Validation Error**:

```javascript
if (!req.body.email) {
  throw new ValidationError("Email is required", { field: "email" });
}
```

**Not Found**:

```javascript
const user = await User.findById(id);
if (!user) {
  throw new NotFoundError("User", id);
}
```

**Database Constraint Error** (automatic handling):

```javascript
// PostgreSQL unique constraint error (code 23505)
// Automatically converted to ConflictError(409)

// PostgreSQL foreign key error (code 23503)
// Automatically converted to ValidationError(400)
```

**Authorization Error**:

```javascript
if (user.role !== "admin") {
  throw new AuthorizationError("Admin access required");
}
```

---

## Frontend Error Handling

### 1. Error Boundary Component

**Location**: `frontend/src/components/ErrorBoundary.jsx`

Catches React component errors and displays graceful fallback UI.

**Usage**:

```jsx
import ErrorBoundary from "./components/ErrorBoundary";

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

**Features**:

- ✅ Catches React errors
- ✅ Shows error message to user
- ✅ Shows stack trace in development
- ✅ Auto-refresh after 3 errors
- ✅ Error tracking integration ready

### 2. useErrorHandler Hook

**Location**: `frontend/src/hooks/useErrorHandler.js`

Centralized error handling for components.

**Usage**:

```jsx
import { useErrorHandler } from "../hooks/useErrorHandler";

function MyComponent() {
  const { handleError, handleValidationError, retryOperation } =
    useErrorHandler();

  const fetchData = async () => {
    try {
      const result = await api.get("/data");
      // Use result
    } catch (error) {
      handleError(error, "FETCH_DATA");
    }
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

**Methods**:

- `handleError(error, context)` - Handle and display error
- `handleValidationError(errors)` - Format and display validation errors
- `retryOperation(fn, maxRetries)` - Retry with exponential backoff
- `isRetryable(error)` - Check if error can be retried
- `isAuthError(error)` - Check if auth error

### 3. Error Codes System

**Location**: `frontend/src/utils/errorCodes.js`

Centralized error definitions with user-friendly messages.

**Categories**:

- `AUTH_ERRORS` (A001-A099) - Authentication/authorization
- `VALIDATION_ERRORS` (V001-V099) - Form validation
- `NETWORK_ERRORS` (N001-N099) - API/network issues
- `BUSINESS_ERRORS` (B001-B099) - Business logic
- `FILE_ERRORS` (F001-F099) - File upload/download
- `SYSTEM_ERRORS` (S001-S099) - System/infrastructure

**Usage**:

```javascript
import { formatError, getErrorByCode } from "../utils/errorCodes";

// Format error for display
const userError = formatError(error);
console.log(userError.message); // User-friendly message
console.log(userError.code); // Error code (e.g., 'A001')

// Get error by code
const error = getErrorByCode("V001"); // Invalid email
```

### 4. Error Handler Utility

**Location**: `frontend/src/utils/errorHandler.js`

Enhanced error handling with utilities.

**Methods**:

- `getUserMessage(error)` - Get user-friendly error message
- `getStatusError(statusCode)` - Get error from HTTP status
- `isAuthError(error)` - Check if auth error
- `isRetryable(error)` - Check if retryable
- `formatValidationErrors(errors)` - Format form errors
- `logError(error, context)` - Log error for debugging
- `handle(promise)` - Go-like error handling [error, data]
- `retry(fn, maxRetries)` - Retry with exponential backoff

### 5. Axios Error Interceptor

**Location**: `frontend/src/config/axiosErrorInterceptor.js`

Handles all API error responses automatically.

**Features**:

- ✅ Attaches user-friendly message to error
- ✅ Adds error code for categorization
- ✅ Tracks severity (error/warning/info)
- ✅ Integrates with error handling

**Integration**:

```javascript
import axiosInstance from "./services/axiosConfig";
import { setupErrorInterceptor } from "./config/axiosErrorInterceptor";
import { useErrorHandler } from "./hooks/useErrorHandler";

const { handleError } = useErrorHandler();
setupErrorInterceptor(axiosInstance, handleError);
```

---

## Form Error Handling

### Validation Error Display

```jsx
import { useErrorHandler } from "../hooks/useErrorHandler";

function LoginForm() {
  const { handleValidationError } = useErrorHandler();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      const validationErrors = validateForm(data);
      if (validationErrors) {
        handleValidationError(validationErrors);
        setErrors(validationErrors);
        return;
      }
      // Submit
    } catch (error) {
      // Handle submission error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField error={!!errors.email} helperText={errors.email?.message} />
    </form>
  );
}
```

---

## Error Logging & Tracking

### Development Mode

Comprehensive logging in browser console:

```javascript
console.error("[CONTEXT] [CODE] Message", error);
```

### Production Mode

Ready for integration with error tracking services:

```javascript
// TODO: Add Sentry, LogRocket, Datadog, etc.
if (import.meta.env.MODE === "production") {
  window.errorTrackingService?.captureException(error);
}
```

---

## Error Handling Patterns

### Pattern 1: Try-Catch in Async Function

```javascript
async function fetchUser(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "FETCH_USER");
    throw error;
  }
}
```

### Pattern 2: Retry with Exponential Backoff

```javascript
async function retryFetch() {
  try {
    return await retryOperation(() => api.get("/data"), 3);
  } catch (error) {
    handleError(error, "RETRY_FAILED");
  }
}
```

### Pattern 3: Go-like Error Handling

```javascript
const [error, user] = await handle(api.get(`/users/${id}`));

if (error) {
  console.error(error.message);
  return;
}

// Use user safely
```

### Pattern 4: Validation Error Handling

```javascript
try {
  await submitForm(data);
} catch (error) {
  if (error.response?.status === 400) {
    handleValidationError(error.response.data.validation);
  } else {
    handleError(error, "FORM_SUBMISSION");
  }
}
```

---

## Common Error Scenarios

### Scenario 1: Network Error

**User sees**: "La connexion a été perdue. Veuillez réessayer."
**Code**: N001
**Action**: Show retry button, implement exponential backoff

### Scenario 2: Authentication Error

**User sees**: "Votre session a expiré. Veuillez vous reconnecter."
**Code**: A004
**Action**: Redirect to login, clear tokens

### Scenario 3: Validation Error

**User sees**: "Ce champ est obligatoire."
**Code**: V004
**Action**: Highlight field, show error message

### Scenario 4: Rate Limit

**User sees**: "Vous avez dépassé la limite de requêtes. Veuillez réessayer plus tard."
**Code**: N005
**Action**: Queue requests, wait before retrying

### Scenario 5: Server Error

**User sees**: "Une erreur système s'est produite. Veuillez réessayer plus tard."
**Code**: S001
**Action**: Log error, offer support contact

---

## Best Practices

### 1. Always Show User-Friendly Messages

```javascript
// ✓ Good
throw new ValidationError("Email format is invalid");

// ✗ Bad
throw new Error("email regex failed");
```

### 2. Include Context

```javascript
// ✓ Good
handleError(error, "LOGIN_ATTEMPT");

// ✗ Bad
handleError(error);
```

### 3. Log Errors for Debugging

```javascript
// ✓ Good
errorHandler.logError(error, "API_CALL");

// ✗ Bad
console.log(error);
```

### 4. Never Expose Sensitive Data

```javascript
// ✓ Good
throw new AuthorizationError("Access denied");

// ✗ Bad
throw new AuthorizationError(`User ${user.id} doesn't have role ${role}`);
```

### 5. Implement Retry Logic

```javascript
// ✓ Good
await retryOperation(() => api.get("/data"), 3);

// ✗ Bad
try {
  await api.get("/data");
} catch (e) {
  throw e;
}
```

### 6. Use Error Boundaries

```javascript
// ✓ Good
<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>

// ✗ Bad
<RiskyComponent />
```

---

## Files Reference

| File                                            | Purpose                 |
| ----------------------------------------------- | ----------------------- |
| `backend/utils/errorClasses.js`                 | Error class definitions |
| `backend/middleware/errorHandlingMiddleware.js` | Global error handler    |
| `frontend/src/components/ErrorBoundary.jsx`     | React error boundary    |
| `frontend/src/hooks/useErrorHandler.js`         | Error handling hook     |
| `frontend/src/utils/errorCodes.js`              | Error codes & messages  |
| `frontend/src/utils/errorHandler.js`            | Error utilities         |
| `frontend/src/config/axiosErrorInterceptor.js`  | API error interceptor   |
| `frontend/src/services/axiosConfig.js`          | Axios configuration     |

---

## Testing Error Handling

### Test Authentication Error

1. Go to admin page without login
2. Should see 401 error
3. Should redirect to login

### Test Validation Error

1. Submit form without required field
2. Should show field-level error
3. Should highlight field in red

### Test Rate Limit

1. Send 50+ requests in 15 minutes
2. Should see 429 error
3. Should show retry message

### Test Network Error

1. Turn off internet
2. Try API call
3. Should show offline message with retry

---

## Summary

Your MyNet.tn platform now has:

✅ **8 Error Classes** - Typed, categorized errors
✅ **Global Error Handler** - Catches all backend errors
✅ **Error Boundary** - Prevents React crashes
✅ **Error Hook** - Centralized component error handling
✅ **Error Codes** - 30+ user-friendly error messages
✅ **Error Utilities** - Formatting, retry, logging
✅ **Error Interceptor** - Automatic API error handling
✅ **Validation Errors** - Form error display
✅ **Logging** - Development and production tracking

**All errors are now handled gracefully with user-friendly messages!** 🎉
