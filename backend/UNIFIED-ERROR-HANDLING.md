# 🔒 Unified Error Handling System

## Overview

All errors must use the unified error factory to ensure consistent responses.

## Error Factory Usage

### Import

```javascript
const { ErrorFactory } = require('../utils/errorFactory');
```

### Error Types Available

#### Validation Errors (400)

```javascript
throw ErrorFactory.validation('Invalid email format');
```

#### Not Found Errors (404)

```javascript
throw ErrorFactory.notFound('Tender not found');
```

#### Unauthorized Errors (401)

```javascript
throw ErrorFactory.unauthorized('Missing authentication token');
```

#### Forbidden Errors (403)

```javascript
throw ErrorFactory.forbidden('Insufficient permissions');
```

#### Conflict Errors (409)

```javascript
throw ErrorFactory.conflict('Email already exists');
```

#### Database Errors (400)

```javascript
throw ErrorFactory.database('Invalid query');
```

#### Server Errors (500)

```javascript
throw ErrorFactory.server('Unexpected error occurred');
```

## Flow

1. **Route Handler** throws error using ErrorFactory
2. **Express Middleware** catches error
3. **Error Handler** formats response uniformly
4. **Response** sent with consistent format

## Response Format

All errors return:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-11-23T12:00:00.000Z"
}
```

## Example Route

```javascript
const { ErrorFactory } = require('../utils/errorFactory');
const asyncHandler = require('../middleware/asyncHandler');

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    // Validation
    if (!req.params.id) {
      throw ErrorFactory.validation('ID is required');
    }

    // Fetch resource
    const resource = await db.query('SELECT * FROM table WHERE id = $1', [req.params.id]);

    // Not found
    if (!resource.rows.length) {
      throw ErrorFactory.notFound('Resource not found');
    }

    // Success - use ResponseFormatter
    res.json(ResponseFormatter.success(resource.rows[0]));
  })
);
```

## Key Rules

1. ✅ Always use ErrorFactory for errors
2. ✅ Use asyncHandler on all route handlers
3. ✅ Let middleware catch and format errors
4. ✅ Don't use `res.status().json()` for errors
5. ✅ Throw errors, don't return them

## Benefits

- 🔒 Consistent error format across all endpoints
- 📊 Easy error logging and tracking
- 🛡️ Safe error messages in production
- 🔧 Easy to maintain and update
- ✅ Standardized response structure
