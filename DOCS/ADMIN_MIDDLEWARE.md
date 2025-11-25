# Admin Middleware Documentation

## Overview
MyNet.tn platform features a comprehensive admin middleware suite that provides:
- ✅ Admin-specific rate limiting
- ✅ Input validation and sanitization
- ✅ File upload validation
- ✅ Permission verification
- ✅ Sensitive data protection
- ✅ Admin action logging
- ✅ Concurrent request limiting
- ✅ Query parameter validation
- ✅ Error handling

---

## Middleware Stack

### Location
`backend/middleware/adminMiddleware.js`

### Imported Into
`backend/routes/superAdminRoutes.js`

---

## Complete Middleware List

### 1. **Admin Rate Limiter**
```javascript
adminMiddleware.adminLimiter
```

**Features:**
- 50 requests per 15 minutes for general admin operations
- Applied to all super admin routes
- Only active for super_admin users
- Returns 429 (Too Many Requests) when limit exceeded

**Usage:**
```javascript
router.use(adminMiddleware.adminLimiter);
```

### 2. **Admin Mutation Limiter**
```javascript
adminMiddleware.adminMutationLimiter
```

**Features:**
- Stricter limit: 20 requests per 15 minutes
- Applied to POST/PUT/DELETE operations
- Prevents abuse of data modification endpoints
- Skips GET requests

**Applied to:**
- User role updates
- Block/unblock operations
- Delete operations
- File operations

### 3. **File Upload Limiter**
```javascript
adminMiddleware.adminFileUploadLimiter
```

**Features:**
- 10 file uploads per 1 hour
- Prevents storage abuse
- Applied only to file upload endpoints
- Returns 429 when limit exceeded

**Applied to:**
- POST `/api/super-admin/files` (file upload)

### 4. **Input Validation**
```javascript
adminMiddleware.validateAdminInput
```

**Features:**
- Removes HTML/script tags from input
- Prevents SQL injection attempts
- Sanitizes all string fields
- Enforces maximum field length (5000 chars)
- Applied globally to all admin routes

**Validation Rules:**
```javascript
// Dangerous characters removed
<script>alert('xss')</script> → alert('xss')

// SQL injection attempts blocked
'; DROP TABLE users; -- → DROP TABLE users

// Tags stripped
<img src=x onerror=alert(1)> → img src=x onerror=alert(1)
```

### 5. **Query Parameter Validation**
```javascript
adminMiddleware.validateQueryParams
```

**Features:**
- Whitelist allowed parameters
- Validate pagination values
- Prevent suspicious parameters
- Normalize page/limit values

**Allowed Parameters:**
```
- page (default: 1, min: 1)
- limit (default: 10, max: 100)
- search
- filter
- sort
- action
- status
- user_id
```

**Example:**
```javascript
GET /api/super-admin/audit-logs?page=abc&limit=500&malicious=true

After validation:
{
  page: 1      // Invalid page corrected to 1
  limit: 100   // Limit capped at 100
  // malicious parameter logged and ignored
}
```

### 6. **File Upload Validation**
```javascript
adminMiddleware.validateFileUpload
```

**Features:**
- Validates file size (max 50MB)
- Whitelist allowed MIME types
- Validate filenames
- Prevent double extensions

**Allowed File Types:**
```
- PDF: application/pdf
- Word: .doc, .docx
- Excel: .xls, .xlsx
- Images: jpeg, png, gif, webp
- Archives: zip, rar
```

**Validation:**
```javascript
// File too large → 413 Payload Too Large
// Invalid type → 415 Unsupported Media Type
// Invalid filename → 400 Bad Request
```

### 7. **Permission Validator**
```javascript
adminMiddleware.verifyAdminPermission(permissions)
```

**Features:**
- Verify super_admin role
- Check specific permissions
- Return 403 on insufficient permission
- Flexible permission system

**Usage:**
```javascript
router.post('/users/:id/delete',
  adminMiddleware.verifyAdminPermission(['user_delete']),
  superAdminController.deleteUser
);
```

### 8. **Sensitive Data Protection**
```javascript
adminMiddleware.protectSensitiveData
```

**Features:**
- Remove sensitive fields from responses
- Applied to all response objects
- Recursive sanitization (includes nested objects/arrays)
- Prevents data leakage

**Protected Fields:**
```
- password
- passwordHash
- refreshToken
- refreshTokenId
- apiKey
- secret
- ssn
- bankAccount
```

**Example:**
```javascript
// Response before:
{
  id: 1,
  email: "admin@mynet.tn",
  password: "hashed_password_here",
  apiKey: "secret_api_key"
}

// Response after:
{
  id: 1,
  email: "admin@mynet.tn"
}
```

### 9. **Admin Action Logging**
```javascript
adminMiddleware.logAdminAction
```

**Features:**
- Log all admin operations
- Capture request/response details
- Track IP addresses
- Record user agent
- Include request ID for tracing

**Logged Information:**
```javascript
{
  userId: 1,
  action: "POST_/api/super-admin/files",
  method: "POST",
  path: "/api/super-admin/files",
  status: "success|failure",
  statusCode: 200,
  ipAddress: "192.168.1.100",
  userAgent: "Mozilla/5.0...",
  timestamp: "2025-01-20T14:30:45Z",
  requestId: "req_abc123def456"
}
```

### 10. **Concurrent Request Limiter**
```javascript
adminMiddleware.concurrentRequestLimiter()
```

**Features:**
- Limit concurrent requests per admin
- Maximum 10 concurrent requests per user
- Return 429 when limit exceeded
- Automatic cleanup on request completion

**Prevents:**
- Resource exhaustion attacks
- Denial of service
- Overwhelming the server

---

## Request/Response Flow

### Complete Admin Request Flow

```
1. REQUEST ARRIVES
   ↓
2. RATE LIMIT CHECK (adminLimiter)
   ├─ If exceeded → 429 Too Many Requests
   └─ Continue ✓
   ↓
3. CONCURRENT REQUEST CHECK
   ├─ If max concurrent → 429 Too Many Requests
   └─ Continue ✓
   ↓
4. QUERY VALIDATION (validateQueryParams)
   ├─ Normalize pagination
   ├─ Filter suspicious params
   └─ Continue ✓
   ↓
5. INPUT SANITIZATION (validateAdminInput)
   ├─ Remove HTML/script tags
   ├─ Remove SQL injection attempts
   └─ Continue ✓
   ↓
6. FILE VALIDATION (validateFileUpload) - if file upload
   ├─ Check size (max 50MB)
   ├─ Verify MIME type
   ├─ Validate filename
   └─ Continue ✓
   ↓
7. MUTATION LIMITING - if POST/PUT/DELETE
   ├─ Check mutation rate limit
   ├─ If exceeded → 429 Too Many Requests
   └─ Continue ✓
   ↓
8. CONTROLLER EXECUTION
   ├─ Process business logic
   ├─ Query database
   └─ Generate response
   ↓
9. ACTION LOGGING (logAdminAction)
   ├─ Log success/failure
   ├─ Record IP address
   └─ Update audit trail
   ↓
10. SENSITIVE DATA PROTECTION (protectSensitiveData)
    ├─ Remove passwords
    ├─ Remove tokens
    ├─ Remove API keys
    └─ Continue ✓
    ↓
11. RESPONSE SENT
    └─ Sanitized, logged, protected
```

---

## Usage Examples

### Example 1: Upload File

```javascript
// Request
POST /api/super-admin/files
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [document.pdf - 5MB]

// Middleware executes:
1. Rate limit check (10 uploads per 1 hour)
2. Concurrent request check (max 10)
3. Input validation
4. File validation:
   - Size: 5MB < 50MB ✓
   - Type: application/pdf ✓
   - Filename: document.pdf ✓
5. Upload limiter check
6. File upload executes
7. Action logged: "POST_/api/super-admin/files"
8. Response sanitized

// Response
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "document_abc123.pdf",
    "file_path": "/uploads/...",
    "file_size": 5242880
  }
}
```

### Example 2: Update User Role

```javascript
// Request
PUT /api/super-admin/users/5/role
Authorization: Bearer {token}
Content-Type: application/json

{ "role": "admin" }

// Middleware executes:
1. Rate limit check (50 per 15 min) ✓
2. Concurrent check ✓
3. Query validation ✓
4. Input sanitization ✓
5. Mutation limiter (20 per 15 min) ✓
6. Update executes
7. Action logged: "PUT_/api/super-admin/users/5/role"
8. Sensitive fields removed from response

// Response
{
  "success": true,
  "data": {
    "id": 5,
    "email": "user@example.tn",
    "role": "admin"
    // password NOT included
  }
}
```

### Example 3: Rate Limit Exceeded

```javascript
// 51st request in 15 minutes
POST /api/super-admin/pages

// Middleware blocks at rate limit check
↓
Response 429:
{
  "success": false,
  "error": "Too many admin requests, please try again later",
  "retryAfter": "15 minutes"
}
```

---

## Security Features

### 1. XSS Prevention
```javascript
Input: <script>alert('xss')</script>
Result: Stripped → script>alert('xss')</script>
```

### 2. SQL Injection Prevention
```javascript
Input: '; DROP TABLE users; --
Result: Stripped → DROP TABLE users
```

### 3. File Upload Security
```javascript
- MIME type validation
- Size limit enforcement
- Filename sanitization
- Suspicious extension blocking
```

### 4. Rate Limiting
```javascript
- Admin: 50 requests/15 min
- Mutations: 20 requests/15 min
- File uploads: 10 uploads/1 hour
- Concurrent: 10 per user
```

### 5. Data Protection
```javascript
- Password never exposed
- API keys stripped
- Tokens removed
- SSN hidden
- Bank accounts redacted
```

---

## Configuration

### Rate Limit Tuning

To modify rate limits, edit `backend/middleware/adminMiddleware.js`:

```javascript
// General admin limit
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Time window
  max: 50,                    // Request limit
});

// Mutation limit
const adminMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});

// File upload limit
const adminFileUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 10,                     // 10 uploads per hour
});
```

### File Type Whitelist

Edit allowed file types:

```javascript
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  // Add more types here
];
```

### Maximum File Size

Edit in `backend/routes/superAdminRoutes.js`:

```javascript
const multer = require('multer');
upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Change this
}).single('file');
```

---

## Monitoring

### Audit Logs
All admin actions are logged with:
- User ID
- Action type
- HTTP method and path
- Success/failure status
- HTTP status code
- Client IP address
- User agent
- Request ID (for tracing)
- Timestamp

View logs at: `/api/super-admin/audit-logs`

### Request ID Tracking
Every request gets a unique ID for tracing:
```javascript
// In response headers or logs
X-Request-ID: req_abc123def456

// Use for debugging/tracing specific requests
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input format"
}
```

### 413 Payload Too Large
```json
{
  "success": false,
  "error": "File too large. Maximum size: 50MB"
}
```

### 415 Unsupported Media Type
```json
{
  "success": false,
  "error": "File type not allowed. Allowed types: ..."
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many admin requests, please try again later"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "An error occurred processing your request",
  "requestId": "req_abc123def456"
}
```

---

## Best Practices

### 1. Always Sanitize Input
```javascript
// ✓ Good - Input is sanitized
req.body.title // Already HTML-stripped

// ✗ Bad - Never trust client input
const unsafeHtml = req.body.html; // Don't use directly
```

### 2. Check Rate Limits
```javascript
// Handle 429 responses in frontend
if (error.status === 429) {
  showToast('Too many requests, please wait');
  // Implement exponential backoff
}
```

### 3. Log Important Actions
```javascript
// Always use audit logging for critical operations
await logAuditAction(userId, 'DELETE_USER', `Deleted user ${id}`, 'success');
```

### 4. Validate on Both Sides
```javascript
// Frontend validation (UX)
if (file.size > 50 * 1024 * 1024) {
  // Show error

// Backend validation (Security)
adminMiddleware.validateFileUpload checks again
```

### 5. Protect Sensitive Data
```javascript
// ✓ Good - Middleware removes password
const response = { id: 1, email: '...', role: '...' };

// ✗ Bad - Never include secrets
const response = { id: 1, email: '...', apiKey: '...' };
```

---

## Troubleshooting

### Issue: "Too many requests" error

**Cause:** Hit rate limit
**Solution:** Wait for the time window (15 min for general, 1 hour for uploads)
**Workaround:** Implement exponential backoff in frontend

### Issue: File upload fails with 415

**Cause:** File type not allowed
**Solution:** Check the ALLOWED_TYPES list
**Action:** Ask admin to use supported file types (PDF, Word, Excel, Images)

### Issue: Input appears stripped/sanitized

**Cause:** XSS/SQL injection prevention middleware
**Solution:** This is expected for security
**Note:** HTML in user input is intentionally stripped

### Issue: Concurrent request limit reached

**Cause:** User has 10+ simultaneous requests
**Solution:** Limit concurrent operations in frontend
**Action:** Queue requests instead of sending all at once

---

## Security Summary

```
✅ Rate Limiting          - Prevents abuse and DoS attacks
✅ Input Sanitization     - Blocks XSS and SQL injection
✅ File Validation        - Prevents malicious file uploads
✅ Permission Checking    - Enforces role-based access
✅ Sensitive Data         - Never exposes passwords/keys
✅ Audit Logging          - Complete activity trail
✅ Concurrent Limiting    - Prevents resource exhaustion
✅ Error Handling         - Standardized error responses
```

Your admin operations are fully protected with comprehensive middleware! 🛡️
