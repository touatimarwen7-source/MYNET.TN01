
# 🎯 دليل تطوير API احترافي - MyNet.tn

**آخر تحديث:** 2025-01-04  
**الإصدار:** v2.0.0

---

## 📋 جدول المحتويات

1. [معايير تطوير Controllers](#controllers)
2. [معايير تطوير Routes](#routes)
3. [معايير معالجة الأخطاء](#error-handling)
4. [معايير التوثيق](#documentation)
5. [معايير الأمان](#security)
6. [معايير الأداء](#performance)

---

## 🎛️ معايير تطوير Controllers {#controllers}

### القالب القياسي

```javascript
const { getPool } = require('../../config/db');
const { sendOk, sendValidationError, sendNotFound, sendInternalError } = require('../../utils/responseHelper');
const { logger } = require('../../utils/logger');

/**
 * 📦 RESOURCE CONTROLLER
 * Brief description of controller purpose
 */
class ResourceController {
  /**
   * Get all resources
   * @route GET /api/resources
   */
  async getAll(req, res) {
    try {
      const pool = getPool();
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const result = await pool.query(
        `SELECT * FROM resources 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return sendOk(res, {
        resources: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.rowCount
        }
      }, 'Resources retrieved successfully');
    } catch (error) {
      logger.error('Error getting resources:', { error: error.message });
      return sendInternalError(res, 'Failed to retrieve resources');
    }
  }

  /**
   * Get single resource
   * @route GET /api/resources/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pool = getPool();

      const result = await pool.query(
        'SELECT * FROM resources WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return sendNotFound(res, 'Resource');
      }

      return sendOk(res, result.rows[0], 'Resource retrieved successfully');
    } catch (error) {
      logger.error('Error getting resource:', { error: error.message, id: req.params.id });
      return sendInternalError(res, 'Failed to retrieve resource');
    }
  }

  /**
   * Create new resource
   * @route POST /api/resources
   */
  async create(req, res) {
    try {
      const { name, description } = req.body;

      // Validation
      if (!name) {
        return sendValidationError(res, [
          { field: 'name', message: 'Name is required' }
        ]);
      }

      const pool = getPool();
      const result = await pool.query(
        `INSERT INTO resources (name, description, created_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         RETURNING *`,
        [name, description]
      );

      return sendOk(res, result.rows[0], 'Resource created successfully');
    } catch (error) {
      logger.error('Error creating resource:', { error: error.message });
      return sendInternalError(res, 'Failed to create resource');
    }
  }
}

module.exports = ResourceController;
```

### ✅ المعايير الواجب اتباعها

1. **استخدام async/await** - دائماً
2. **معالجة الأخطاء** - try/catch في كل دالة
3. **التسجيل (Logging)** - استخدام logger في حالات الخطأ
4. **استجابات موحدة** - استخدام responseHelper
5. **التحقق من البيانات** - قبل العمليات
6. **JSDoc** - توثيق كل دالة

---

## 🛣️ معايير تطوير Routes {#routes}

### القالب القياسي

```javascript
const express = require('express');
const ResourceController = require('../controllers/ResourceController');
const authMiddleware = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

const router = express.Router();

/**
 * @route   GET /api/resources
 * @desc    Get all resources with pagination
 * @access  Private
 */
router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const controller = new ResourceController();
    return controller.getAll(req, res);
  })
);

/**
 * @route   GET /api/resources/:id
 * @desc    Get resource by ID
 * @access  Private
 */
router.get(
  '/:id',
  authMiddleware,
  validateIdMiddleware,
  asyncHandler(async (req, res) => {
    const controller = new ResourceController();
    return controller.getById(req, res);
  })
);

/**
 * @route   POST /api/resources
 * @desc    Create new resource
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const controller = new ResourceController();
    return controller.create(req, res);
  })
);

module.exports = router;
```

### ✅ المعايير الواجب اتباعها

1. **JSDoc للتوثيق** - لكل route
2. **asyncHandler** - التفاف جميع handlers
3. **Middleware بالترتيب** - auth → validation → handler
4. **تنسيق موحد** - نفس الأسلوب في جميع الملفات

---

## 🔴 معايير معالجة الأخطاء {#error-handling}

### استخدام Response Helpers

```javascript
// ✅ صحيح
return sendOk(res, data, 'Success message');
return sendValidationError(res, errors, 'Validation failed');
return sendNotFound(res, 'Resource');
return sendForbidden(res, 'Access denied');
return sendInternalError(res, 'Operation failed');

// ❌ خطأ - لا تستخدم
return res.status(200).json({ success: true, data });
return res.status(400).json({ error: 'Bad request' });
```

### معالجة أخطاء قاعدة البيانات

```javascript
try {
  const result = await pool.query(query, values);
} catch (error) {
  // Log the error
  logger.error('Database error:', { 
    error: error.message, 
    code: error.code,
    query: query 
  });
  
  // Return user-friendly error
  return sendInternalError(res, 'Failed to complete operation');
}
```

---

## 📝 معايير التوثيق {#documentation}

### JSDoc للـ Controllers

```javascript
/**
 * 📦 RESOURCE CONTROLLER
 * Manages CRUD operations for resources
 * 
 * @class ResourceController
 * @requires config/db
 * @requires utils/responseHelper
 */

/**
 * Get all resources with pagination
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} req.query.page - Page number (default: 1)
 * @param {number} req.query.limit - Items per page (default: 10)
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 * 
 * @example
 * GET /api/resources?page=1&limit=10
 */
async getAll(req, res) { }
```

### JSDoc للـ Routes

```javascript
/**
 * @route   GET /api/resources/:id
 * @desc    Get a single resource by ID
 * @access  Private (Authenticated users)
 * @params  {string} id - Resource ID
 * @query   None
 * @body    None
 * @returns {Object} 200 - Resource object
 * @returns {Object} 404 - Resource not found
 * @returns {Object} 500 - Internal server error
 */
```

---

## 🔒 معايير الأمان {#security}

### قائمة التحقق الأمني

- [ ] استخدام `authMiddleware` لجميع المسارات المحمية
- [ ] التحقق من الصلاحيات (role-based access)
- [ ] تنقية المدخلات (input sanitization)
- [ ] استخدام parameterized queries لمنع SQL injection
- [ ] عدم إرجاع معلومات حساسة في الأخطاء
- [ ] استخدام HTTPS في الإنتاج
- [ ] تطبيق rate limiting

### مثال على التحقق من الصلاحيات

```javascript
async create(req, res) {
  // Check role
  if (req.user.role !== 'admin') {
    return sendForbidden(res, 'Admin access required');
  }
  
  // Continue with operation...
}
```

---

## ⚡ معايير الأداء {#performance}

### استعلامات قاعدة البيانات

```javascript
// ✅ جيد - استخدام indexes
const result = await pool.query(
  'SELECT * FROM resources WHERE id = $1',
  [id]
);

// ✅ جيد - تحديد الأعمدة المطلوبة
const result = await pool.query(
  'SELECT id, name, created_at FROM resources'
);

// ❌ سيء - SELECT *
const result = await pool.query('SELECT * FROM resources');
```

### Pagination

```javascript
// Always implement pagination for list endpoints
const { page = 1, limit = 10 } = req.query;
const offset = (page - 1) * limit;

const result = await pool.query(
  `SELECT * FROM resources 
   ORDER BY created_at DESC 
   LIMIT $1 OFFSET $2`,
  [limit, offset]
);
```

### Caching

```javascript
// Use caching for frequently accessed data
const cacheKey = `resource:${id}`;
const cached = await redisCache.get(cacheKey);

if (cached) {
  return sendOk(res, JSON.parse(cached), 'Resource retrieved from cache');
}

// Fetch from database and cache
const result = await pool.query('SELECT * FROM resources WHERE id = $1', [id]);
await redisCache.set(cacheKey, JSON.stringify(result.rows[0]), 3600);
```

---

## 🎯 الخلاصة

اتبع هذه المعايير في كل ملف تقوم بإنشائه أو تعديله:

1. ✅ استخدام القوالب القياسية
2. ✅ معالجة الأخطاء بشكل صحيح
3. ✅ توثيق شامل باستخدام JSDoc
4. ✅ تطبيق معايير الأمان
5. ✅ تحسين الأداء
6. ✅ اختبار شامل

**النتيجة: API احترافي، آمن، وقابل للصيانة** 🚀
