# API Endpoints Testing Guide - نظام الاستفسارات والإلحاقات

## ملخص الـ API Endpoints (12 endpoint)

---

## 📋 الاستفسارات (Inquiries)

### 1️⃣ إرسال استفسار جديد

```
POST /api/tenders/:tenderId/inquiries
```

**الطلب:**

```bash
curl -X POST http://localhost:3000/api/tenders/1/inquiries \
  -H "Authorization: Bearer SUPPLIER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "استفسار حول شروط الدفع",
    "inquiry_text": "هل يمكن توضيح شروط الدفع والتسليم؟",
    "attachments": []
  }'
```

**الاستجابة الناجحة (201):**

```json
{
  "success": true,
  "inquiry": {
    "id": 1,
    "tender_id": 1,
    "supplier_id": 5,
    "subject": "استفسار حول شروط الدفع",
    "inquiry_text": "هل يمكن توضيح شروط الدفع والتسليم؟",
    "status": "pending",
    "submitted_at": "2025-11-24T21:30:00Z",
    "created_at": "2025-11-24T21:30:00Z"
  }
}
```

**رموز الأخطاء:**

- `400`: الموضوع أو النص مفقود
- `401`: لم يتم تسجيل الدخول
- `500`: خطأ في الخادم

---

### 2️⃣ عرض استفسارات المناقصة

```
GET /api/tenders/:tenderId/inquiries?page=1&limit=10
```

**الطلب:**

```bash
curl http://localhost:3000/api/tenders/1/inquiries?page=1&limit=10 \
  -H "Authorization: Bearer BUYER_TOKEN"
```

**الاستجابة (200):**

```json
{
  "success": true,
  "count": 2,
  "inquiries": [
    {
      "id": 1,
      "tender_id": 1,
      "subject": "استفسار حول شروط الدفع",
      "status": "pending",
      "company_name": "شركة النجاح",
      "username": "supplier1",
      "submitted_at": "2025-11-24T21:30:00Z"
    },
    {
      "id": 2,
      "tender_id": 1,
      "subject": "استفسار حول موقع التسليم",
      "status": "answered",
      "company_name": "شركة الشروق",
      "submitted_at": "2025-11-24T21:45:00Z"
    }
  ]
}
```

---

### 3️⃣ عرض استفسارات المتعهد

```
GET /api/my-inquiries?page=1&limit=10
```

**الطلب:**

```bash
curl http://localhost:3000/api/my-inquiries?page=1&limit=10 \
  -H "Authorization: Bearer SUPPLIER_TOKEN"
```

**الاستجابة (200):**

```json
{
  "success": true,
  "count": 3,
  "inquiries": [
    {
      "id": 1,
      "tender_id": 1,
      "subject": "استفسار حول شروط الدفع",
      "status": "pending",
      "title": "المناقصة الأولى",
      "tender_number": "CONS-2025-001",
      "deadline": "2025-12-31T23:59:59Z"
    }
  ]
}
```

---

## 💬 الردود (Responses)

### 4️⃣ الرد على استفسار

```
POST /api/inquiries/:inquiryId/respond
```

**الطلب:**

```bash
curl -X POST http://localhost:3000/api/inquiries/1/respond \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "response_text": "شكراً على الاستفسار. شروط الدفع 50% عند التوقيع و50% عند التسليم.",
    "attachments": []
  }'
```

**الاستجابة الناجحة (201):**

```json
{
  "success": true,
  "response": {
    "id": 1,
    "inquiry_id": 1,
    "tender_id": 1,
    "response_text": "شكراً على الاستفسار...",
    "answered_by": 3,
    "answered_at": "2025-11-24T21:35:00Z",
    "is_public": true,
    "created_at": "2025-11-24T21:35:00Z"
  }
}
```

**تأثير الرد:**

- ✅ تحديث حالة الاستفسار من `pending` إلى `answered`
- ✅ تسجيل الشخص الذي رد ووقت الرد

---

### 5️⃣ عرض ردود الاستفسار

```
GET /api/inquiries/:inquiryId/responses
```

**الطلب:**

```bash
curl http://localhost:3000/api/inquiries/1/responses \
  -H "Authorization: Bearer SUPPLIER_TOKEN"
```

**الاستجابة (200):**

```json
{
  "success": true,
  "count": 1,
  "responses": [
    {
      "id": 1,
      "inquiry_id": 1,
      "response_text": "شروط الدفع 50% و50%...",
      "username": "buyer@example.com",
      "answered_at": "2025-11-24T21:35:00Z",
      "is_public": true
    }
  ]
}
```

---

## 📄 الملاحق (Addenda)

### 6️⃣ نشر ملحق جديد

```
POST /api/tenders/:tenderId/addenda
```

**الطلب:**

```bash
curl -X POST http://localhost:3000/api/tenders/1/addenda \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ملحق توضيحي - المناقصة الأولى",
    "content": "ملحق المناقصة رقم CONS-2025-001\n\nالاستفسار الأول:\nالسؤال: شروط الدفع؟\nالرد: تم التوضيح أعلاه",
    "inquiry_responses": [],
    "supplier_emails": ["supplier1@example.com", "supplier2@example.com"]
  }'
```

**الاستجابة الناجحة (201):**

```json
{
  "success": true,
  "addendum": {
    "id": 1,
    "tender_id": 1,
    "addendum_number": "ADD-2025-A7K9X",
    "title": "ملحق توضيحي",
    "version": 1,
    "published_at": "2025-11-24T21:40:00Z",
    "published_by": 3,
    "created_at": "2025-11-24T21:40:00Z"
  }
}
```

**عملية تلقائية:**

- ✅ توليد رقم فريد: `ADD-YYYY-XXXXX`
- ✅ ضبط النسخة = 1
- ✅ إرسال إشعارات لجميع المتعهدين المرسلة إليهم رسالة البريد

---

### 7️⃣ عرض ملاحق المناقصة

```
GET /api/tenders/:tenderId/addenda?page=1&limit=10
```

**الطلب:**

```bash
curl http://localhost:3000/api/tenders/1/addenda?page=1&limit=10 \
  -H "Authorization: Bearer SUPPLIER_TOKEN"
```

**الاستجابة (200):**

```json
{
  "success": true,
  "count": 2,
  "addenda": [
    {
      "id": 1,
      "addendum_number": "ADD-2025-A7K9X",
      "title": "ملحق توضيحي",
      "version": 1,
      "content": "محتوى الملحق...",
      "published_at": "2025-11-24T21:40:00Z",
      "username": "buyer@example.com"
    },
    {
      "id": 2,
      "addendum_number": "ADD-2025-B2K5Y",
      "title": "ملحق إضافي",
      "version": 2,
      "published_at": "2025-11-24T22:00:00Z"
    }
  ]
}
```

---

## 🔔 الإشعارات (Notifications)

### 8️⃣ عرض إشعارات المستخدم

```
GET /api/my-notifications?page=1&limit=10
```

**الطلب:**

```bash
curl http://localhost:3000/api/my-notifications?page=1&limit=10 \
  -H "Authorization: Bearer SUPPLIER_TOKEN"
```

**الاستجابة (200):**

```json
{
  "success": true,
  "count": 3,
  "notifications": [
    {
      "id": 1,
      "addendum_id": 1,
      "addendum_number": "ADD-2025-A7K9X",
      "title": "ملحق جديد على المناقصة",
      "tender_title": "المناقصة الأولى",
      "tender_number": "CONS-2025-001",
      "sent_at": "2025-11-24T21:40:05Z",
      "read_at": null,
      "notification_method": "email"
    },
    {
      "id": 2,
      "addendum_id": 1,
      "addendum_number": "ADD-2025-A7K9X",
      "sent_at": "2025-11-24T21:40:05Z",
      "read_at": "2025-11-24T22:15:00Z"
    }
  ]
}
```

---

### 9️⃣ تحديد الإشعار كمقروء

```
POST /api/notifications/:notificationId/read
```

**الطلب:**

```bash
curl -X POST http://localhost:3000/api/notifications/1/read \
  -H "Authorization: Bearer SUPPLIER_TOKEN" \
  -H "Content-Type: application/json"
```

**الاستجابة الناجحة (200):**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

**التأثير:**

- ✅ تحديث `read_at` بوقت القراءة الحالي
- ✅ سيختفي من قائمة الإشعارات الجديدة

---

## 📊 مثال عملي - الدورة الكاملة

### 1. المتعهد يرسل استفسار

```bash
# الخطوة 1
curl -X POST http://localhost:3000/api/tenders/1/inquiries \
  -H "Authorization: Bearer SUPPLIER_TOKEN" \
  -d '{"subject": "شروط", "inquiry_text": "استفسار"}'

# الرد: inquiry.id = 5
```

### 2. صاحب المناقصة يرد

```bash
# الخطوة 2
curl -X POST http://localhost:3000/api/inquiries/5/respond \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -d '{"response_text": "رد مفصل..."}'

# تأثير: inquiry.status تغير من pending إلى answered
```

### 3. نشر ملحق

```bash
# الخطوة 3
curl -X POST http://localhost:3000/api/tenders/1/addenda \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -d '{
    "title": "ملحق",
    "content": "محتوى...",
    "supplier_emails": ["supplier@example.com"]
  }'

# الرد: addendum.id = 12, addendum_number = ADD-2025-XXXXX
# تأثير: إشعارات تُرسل تلقائياً
```

### 4. المتعهد يستقبل الإشعار

```bash
# الخطوة 4
curl http://localhost:3000/api/my-notifications \
  -H "Authorization: Bearer SUPPLIER_TOKEN"

# الرد: notifications = [{ addendum_number: "ADD-2025-XXXXX", read_at: null }]

# تحديث كمقروء
curl -X POST http://localhost:3000/api/notifications/[notif_id]/read \
  -H "Authorization: Bearer SUPPLIER_TOKEN"

# الرد: { success: true }
```

---

## ✅ معايير النجاح للـ API

| الـ Endpoint      | الطلب           | الاستجابة            | الحالة |
| ----------------- | --------------- | -------------------- | ------ |
| POST inquiries    | موضوع + نص      | 201 + inquiry id     | ✅     |
| GET inquiries     | bearer token    | 200 + array          | ✅     |
| GET my-inquiries  | bearer token    | 200 + my inquiries   | ✅     |
| POST respond      | response text   | 201 + response id    | ✅     |
| GET responses     | inquiry id      | 200 + array          | ✅     |
| POST addenda      | title + content | 201 + ADD-YYYY-XXXXX | ✅     |
| GET addenda       | page + limit    | 200 + array          | ✅     |
| GET notifications | page + limit    | 200 + array          | ✅     |
| POST read         | notification id | 200 + success        | ✅     |

---

## 🧪 أدوات الاختبار الموصى بها

### Postman / Insomnia

```
1. استيراد جميع الـ endpoints
2. تعيين متغيرات: token, tenderId, etc.
3. تشغيل Collection مرتين (مرة كـ supplier، مرة كـ buyer)
```

### cURL (سطر الأوامر)

```bash
# حفظ token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"supplier@example.com","password":"pass"}' | jq -r '.token')

# استخدام في الطلبات
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/my-inquiries
```

### Swagger UI

```
http://localhost:3000/api-docs
```
