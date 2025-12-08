
# معيار استيراد Middleware - MyNet.tn

## ✅ الطريقة الصحيحة لاستيراد authMiddleware

### ❌ خطأ - لا تفعل هذا:
```javascript
const authMiddleware = require('../middleware/authMiddleware');
router.get('/path', authMiddleware, handler);
```

### ✅ صحيح - افعل هذا:
```javascript
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// للمصادقة فقط
router.get('/path', verifyToken, handler);

// للمصادقة + التفويض
router.get('/admin', verifyToken, checkRole(['admin']), handler);
```

## 📋 جميع الـ Middleware المتاحة

### من `authMiddleware.js`:
- `verifyToken` - التحقق من الـ token
- `checkRole(roles)` - التحقق من الصلاحيات
- `checkPermission(permission)` - التحقق من الأذونات

### من `validateIdMiddleware.js`:
- `validateIdMiddleware(paramName)` - التحقق من معرّف واحد
- `validateIdMiddleware([param1, param2])` - التحقق من عدة معرّفات

### من `errorHandlingMiddleware.js`:
- `asyncHandler(fn)` - معالجة الأخطاء التلقائية

## 🎯 أمثلة عملية

```javascript
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');

// مسار عام بمصادقة
router.get('/data', 
  verifyToken, 
  asyncHandler(async (req, res) => {
    // logic
  })
);

// مسار للمشرفين فقط
router.post('/admin/create', 
  verifyToken,
  checkRole(['admin', 'super_admin']),
  asyncHandler(async (req, res) => {
    // logic
  })
);

// مسار بمعرّف
router.get('/tender/:id',
  validateIdMiddleware('id'),
  verifyToken,
  asyncHandler(async (req, res) => {
    // logic
  })
);
```

## 🔍 التحقق السريع

استخدم هذا الأمر للبحث عن أي استيرادات خاطئة:
```bash
grep -r "require.*authMiddleware.*)" backend/routes/ | grep -v "verifyToken\|roleMiddleware\|checkRole"
```

إذا ظهرت نتائج، يجب إصلاحها باستخدام الطريقة الصحيحة أعلاه.
