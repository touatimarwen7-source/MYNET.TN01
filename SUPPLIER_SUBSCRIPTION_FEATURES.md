# 🎯 نظام الاشتراكات والميزات المتقدمة (Supplier Subscription Features)

## ✅ النظام المطبق - Feature Management per Supplier

---

## 📋 الميزات المتاحة (9 ميزات)

### 📊 1. التحليل والتقارير (Analytics & Reporting)

#### تقارير التحليل الموسعة (post_award_reports)
**عند التفعيل (Premium)**:
- وصول لتقرير مفصل بعد انتهاء المناقصة
- مقارنة أدائه بمتوسط السوق
- رؤية نقاط الضعف والقوة

**عند الإلغاء (Basic)**:
- رؤية فقط نتيجة الترسية (فاز/لم يفز)
- لا يرى معلومات مفصلة

#### لوحة إحصائيات الأداء (performance_analytics)
**عند التفعيل (Premium)**:
- Dashboard يعرض KPIs:
  - معدل الفوز (Win Rate)
  - نسبة الامتثال (Compliance Rate)
  - متوسط قيمة العروض
  - وقت الاستجابة

**عند الإلغاء (Basic)**:
- لا توجد لوحة تحكم

#### تصدير سجل المعاملات (export_transactions)
**عند التفعيل (Premium)**:
- تصدير عروض وفواتير (CSV/JSON)
- تحليل ذاتي داخلي

**عند الإلغاء (Basic)**:
- عرض داخل المنصة فقط

---

### 🔗 2. التكامل والكفاءة (Integration & Efficiency)

#### التكامل مع أنظمة ERP (erp_integration)
**عند التفعيل (Premium)**:
- API access للمورد
- دفع الفواتير وأوامر الشراء مباشرة من نظامه (SAP/Oracle)
- تكامل آلي كامل

**عند الإلغاء (Basic)**:
- إدخال يدوي أو تنزيل ورفع يدوي

#### عدد المنتجات (extended_products)
**عند التفعيل (Premium)**:
- حد أقصى: 500 منتج/خدمة في الكتالوج

**عند الإلغاء (Basic)**:
- حد أقصى: 50 منتج فقط

#### سعة التخزين الإضافية (extra_storage)
**عند التفعيل (Premium)**:
- سعة تخزين: 50 GB

**عند الإلغاء (Basic)**:
- سعة تخزين: 5 GB

---

### 🛡️ 3. التنبيهات والأمان (Alerts & Security)

#### التنبيهات الفورية (realtime_alerts)
**عند التفعيل (Premium)**:
- تنبيهات في الوقت الفعلي (In-App/Email)
- عند نشر مناقصة تطابق اهتماماته

**عند الإلغاء (Basic)**:
- ملخص يومي أو أسبوعي فقط

#### المستخدمون المتعددون (team_members)
**عند التفعيل (Premium)**:
- إضافة أعضاء فريق لنفس الحساب
- تعيين أدوار فرعية (Finance, Sales, etc)

**عند الإلغاء (Basic)**:
- مستخدم رئيسي واحد فقط

#### الدعم الفني المباشر (priority_support)
**عند التفعيل (Premium)**:
- قناة دعم مباشرة (Chat Support)
- أولوية عالية

**عند الإلغاء (Basic)**:
- نظام التذاكر أو البريد الإلكتروني

---

## 🚀 API Endpoints

### 1. تفعيل ميزة لمورد معين:
```
PUT /api/admin/supplier-features/enable
Authorization: Bearer {token}
Content-Type: application/json

{
  "supplier_id": 123,
  "feature_key": "erp_integration",
  "reason": "Plan upgrade to Premium",
  "expires_at": "2026-11-21T23:59:59Z"  // اختياري
}
```

**الاستجابة**:
```json
{
  "success": true,
  "message": "Feature \"التكامل مع أنظمة ERP\" enabled for supplier 123",
  "feature": {
    "id": 1,
    "supplier_id": 123,
    "feature_key": "erp_integration",
    "feature_name": "التكامل مع أنظمة ERP",
    "category": "integration",
    "is_enabled": true,
    "enabled_at": "2025-11-21T10:30:00Z",
    "expires_at": "2026-11-21T23:59:59Z"
  }
}
```

### 2. إلغاء تفعيل ميزة:
```
PUT /api/admin/supplier-features/disable
Authorization: Bearer {token}

{
  "supplier_id": 123,
  "feature_key": "erp_integration",
  "reason": "Plan downgrade to Basic"
}
```

### 3. الحصول على جميع الميزات المتاحة:
```
GET /api/admin/supplier-features/available
Authorization: Bearer {token}
```

**الاستجابة**:
```json
{
  "success": true,
  "total": 9,
  "grouped": {
    "analytics": [
      {
        "key": "post_award_reports",
        "name": "تقارير التحليل الموسعة",
        "category": "analytics"
      }
    ],
    "integration": [...],
    "alerts": [...]
  }
}
```

### 4. الحصول على ميزات مورد معين:
```
GET /api/admin/supplier-features/supplier/123
Authorization: Bearer {token}
```

### 5. الحصول على الميزات النشطة فقط:
```
GET /api/admin/supplier-features/supplier/123/active
Authorization: Bearer {token}
```

### 6. التحقق من ميزة محددة:
```
GET /api/admin/supplier-features/supplier/123/check/erp_integration
Authorization: Bearer {token}
```

**الاستجابة**:
```json
{
  "success": true,
  "supplier_id": 123,
  "feature_key": "erp_integration",
  "is_enabled": true
}
```

### 7. الحصول على ميزات بفئة:
```
GET /api/admin/supplier-features/category/analytics
Authorization: Bearer {token}
```

---

## 💻 الاستخدام في الكود

### 1. التحقق من الميزة في Service:

```javascript
const SubscriptionService = require('../services/SubscriptionService');

async function generateReport(supplierId) {
    const hasFeature = await SubscriptionService.isSupplierFeatureEnabled(
        supplierId, 
        'post_award_reports'
    );
    
    if (!hasFeature) {
        throw new Error('المورد يحتاج لترقية خطته للوصول للتقارير');
    }
    
    // توليد التقرير
}
```

### 2. استخدام Middleware في Routes:

```javascript
const supplierFeatureMiddleware = require('../middleware/supplierFeatureMiddleware');

router.get('/reports/:supplier_id',
    supplierFeatureMiddleware('post_award_reports'),
    (req, res) => {
        // التقرير يتم عرضه فقط إذا كانت الميزة مفعلة
    }
);
```

### 3. التحقق في Controller:

```javascript
async generateAnalytics(req, res) {
    const { supplier_id } = req.params;
    
    const hasAnalytics = await SubscriptionService
        .isSupplierFeatureEnabled(supplier_id, 'performance_analytics');
    
    if (!hasAnalytics) {
        return res.status(403).json({
            error: 'Feature not available',
            message: 'Analytics dashboard requires Premium plan'
        });
    }
    
    // توليد التحليلات
}
```

---

## 🎯 سيناريوهات واقعية

### السيناريو 1: ترقية مورد إلى Premium

```
المشتري:
├─ يرقي المورد #123 إلى خطة Premium
└─ المسؤول ينقر: تفعيل جميع ميزات Premium

النتيجة:
├─ تفعيل: post_award_reports
├─ تفعيل: performance_analytics
├─ تفعيل: export_transactions
├─ تفعيل: erp_integration
├─ تفعيل: extended_products (max 500)
├─ تفعيل: extra_storage (50 GB)
├─ تفعيل: realtime_alerts
├─ تفعيل: team_members
└─ تفعيل: priority_support

المورد الآن:
✅ يرى تقارير مفصلة
✅ يصدر البيانات
✅ يرسل الفواتير لـ ERP
✅ يضيف فريقه
✅ يحصل على دعم مباشر
```

### السيناريو 2: رجوع مورد إلى Basic

```
الحالة السابقة: Premium (كل الميزات مفعلة)
الإجراء: رجوع الخطة إلى Basic

التأثير الفوري:
├─ إلغاء: post_award_reports
├─ إلغاء: performance_analytics
├─ إلغاء: export_transactions
├─ إلغاء: erp_integration
├─ إنخفاض max_products من 500 → 50
├─ إنخفاض storage من 50GB → 5GB
├─ إلغاء: realtime_alerts
├─ إلغاء: team_members
└─ إلغاء: priority_support

الحماية من الفقدان:
✅ المناقصات المنتهية لا تُحذف
✅ الفواتير والعروض الموجودة تبقى
✅ فقط الميزات الجديدة غير متاحة
```

### السيناريو 3: تفعيل مؤقت (مع انتهاء صلاحية)

```
المسؤول يفعّل premium_analytics لمدة شهر واحد:

{
  "supplier_id": 456,
  "feature_key": "performance_analytics",
  "reason": "Trial for 1 month",
  "expires_at": "2025-12-21T23:59:59Z"
}

بعد تاريخ الانتهاء:
├─ الميزة تُلغى تلقائياً
├─ المورد يفقد الوصول
└─ إشعار يُرسل للمورد
```

---

## 🔐 الأمان والصلاحيات

### من يمكنه تفعيل/تعطيل الميزات:
- ✅ ADMIN فقط (checkPermission('manage_features'))

### الحماية:
- ✅ تسجيل من فعل التفعيل (admin_id)
- ✅ تسجيل السبب (reason)
- ✅ تسجيل التاريخ (enabled_at, expires_at)
- ✅ منع تعديل البيانات التاريخية

---

## 📊 الإحصائيات

| المقياس | القيمة |
|--------|--------|
| **عدد الميزات** | 9 ميزات |
| **الفئات** | 3 (Analytics, Integration, Alerts) |
| **وقت التفعيل** | فوري |
| **الحماية** | كاملة |

---

## 🎉 الخلاصة

✅ **نظام اشتراكات وميزات متكامل**
✅ **تحكم كامل من المسؤول**
✅ **9 ميزات متقدمة قابلة للتحكم**
✅ **حماية من فقدان البيانات**
✅ **تفعيل/إلغاء فوري**

**الحالة**: جاهز للإنتاج 🚀

