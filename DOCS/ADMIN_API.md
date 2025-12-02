# MyNet.tn Super Admin API Documentation

## Overview

Complete API reference for MyNet.tn Super Admin management system. All endpoints are protected with JWT authentication and require `super_admin` role.

**Base URL:** `http://localhost:3000/api/super-admin`

**Authentication:** All requests must include `Authorization: Bearer {token}` header

---

## Table of Contents

1. [Static Pages](#1-static-pages)
2. [File Management](#2-file-management)
3. [Document Management](#3-document-management)
4. [Email Notifications](#4-email-notifications)
5. [User Management](#5-user-management)
6. [Audit Logs](#6-audit-logs)
7. [Health Monitoring](#7-health-monitoring)
8. [Backup & Restore](#8-backup--restore)
9. [Subscription Plans](#9-subscription-plans)
10. [Feature Control](#10-feature-control)

---

## 1. Static Pages

### List All Pages

```
GET /pages
```

**Query Parameters:**

```javascript
page=1&limit=10&search=services
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "About Us",
      "slug": "about-us",
      "content": "Company information...",
      "meta_description": "SEO description",
      "created_at": "2025-01-20T10:00:00Z",
      "updated_at": "2025-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Single Page

```
GET /pages/:id
```

**Example:**

```
GET /pages/1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "About Us",
    "slug": "about-us",
    "content": "...",
    "meta_description": "...",
    "created_at": "2025-01-20T10:00:00Z"
  }
}
```

---

### Create New Page

```
POST /pages
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Services",
  "slug": "services",
  "content": "Our services include...",
  "meta_description": "MyNet.tn services",
  "meta_keywords": "procurement, B2B"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Page created successfully",
  "data": {
    "id": 2,
    "title": "Services",
    "slug": "services",
    ...
  }
}
```

---

### Update Page

```
PUT /pages/:id
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Services Updated",
  "content": "Updated services...",
  "meta_description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Page updated successfully",
  "data": { ... }
}
```

---

### Delete Page

```
DELETE /pages/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Page deleted successfully"
}
```

---

## 2. File Management

### List All Files

```
GET /files
```

**Query Parameters:**

```
page=1&limit=10&type=pdf
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "document.pdf",
      "original_name": "Document.pdf",
      "file_path": "/uploads/file_1234.pdf",
      "file_type": "pdf",
      "file_size": 2048000,
      "uploaded_by": 1,
      "uploaded_at": "2025-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

### Upload File

```
POST /files
Content-Type: multipart/form-data
```

**Form Data:**

```
file: [binary file content]
```

**Constraints:**

- Max file size: 50MB
- Supported types: pdf, doc, docx, xls, xlsx, jpg, png, gif, zip, rar

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 101,
    "filename": "document_abc123.pdf",
    "original_name": "MyDocument.pdf",
    "file_path": "/uploads/document_abc123.pdf",
    "file_size": 2048000,
    "file_type": "pdf"
  }
}
```

---

### Delete File

```
DELETE /files/:id
```

**Response:**

```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## 3. Document Management

### List All Documents

```
GET /documents
```

**Query Parameters:**

```
page=1&limit=10&search=contract
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Service Contract",
      "description": "Main service agreement",
      "content": "Contract terms...",
      "version": 2,
      "created_at": "2025-01-20T10:00:00Z",
      "updated_at": "2025-01-20T12:00:00Z"
    }
  ]
}
```

---

### Create Document

```
POST /documents
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Privacy Policy",
  "description": "Platform privacy policy",
  "content": "We collect the following data..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Document created successfully",
  "data": {
    "id": 5,
    "name": "Privacy Policy",
    "version": 1,
    ...
  }
}
```

---

### Delete Document

```
DELETE /documents/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## 4. Email Notifications

### List Sent Emails

```
GET /emails
```

**Query Parameters:**

```
page=1&limit=10&status=sent
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "recipient": "user@example.tn",
      "subject": "Welcome to MyNet.tn",
      "body": "Welcome email content...",
      "status": "sent",
      "sent_at": "2025-01-20T10:00:00Z"
    }
  ]
}
```

---

### Send Email

```
POST /emails/send
Content-Type: application/json
```

**Request Body:**

```json
{
  "recipient": "user@example.tn",
  "subject": "Account Notification",
  "body": "Important notification text",
  "cc": ["admin@mynet.tn"],
  "bcc": ["archive@mynet.tn"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "id": 150,
    "recipient": "user@example.tn",
    "status": "sent",
    "sent_at": "2025-01-20T14:30:00Z"
  }
}
```

---

## 5. User Management

### List All Users

```
GET /users
```

**Query Parameters:**

```
page=1&limit=10&role=supplier&status=active
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "supplier@company.tn",
      "name": "Company Name",
      "role": "supplier",
      "is_active": true,
      "created_at": "2025-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 10
  }
}
```

---

### Update User Role

```
PUT /users/:id/role
Content-Type: application/json
```

**Request Body:**

```json
{
  "role": "admin"
}
```

**Available Roles:**

- `buyer` - Buyer account
- `supplier` - Supplier account
- `admin` - Admin account
- `super_admin` - Super admin account

**Response:**

```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": 1,
    "email": "user@company.tn",
    "role": "admin"
  }
}
```

---

### Block User

```
POST /users/:id/block
```

**Response:**

```json
{
  "success": true,
  "message": "User blocked successfully"
}
```

---

### Unblock User

```
POST /users/:id/unblock
```

**Response:**

```json
{
  "success": true,
  "message": "User unblocked successfully"
}
```

---

## 6. Audit Logs

### Get Audit Logs

```
GET /audit-logs
```

**Query Parameters:**

```
page=1&limit=10&action=CREATE_PAGE&user_id=1
```

**Available Actions:**

```
CREATE_PAGE, UPDATE_PAGE, DELETE_PAGE
UPLOAD_FILE, DELETE_FILE
CREATE_DOCUMENT, DELETE_DOCUMENT
SEND_EMAIL
UPDATE_USER_ROLE, BLOCK_USER, UNBLOCK_USER
CREATE_BACKUP, RESTORE_BACKUP
CREATE_PLAN, UPDATE_PLAN
ENABLE_FEATURE, DISABLE_FEATURE
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "CREATE_PAGE",
      "description": "Created page: About Us",
      "status": "success",
      "ip_address": "192.168.1.100",
      "created_at": "2025-01-20T14:30:45Z"
    }
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 10
  }
}
```

---

## 7. Health Monitoring

### Get System Health

```
GET /health
```

**Response:**

```json
{
  "success": true,
  "data": {
    "database": {
      "status": "healthy",
      "response_time": "5ms",
      "connections": 8
    },
    "server": {
      "cpu": 35,
      "memory": 42,
      "disk": 58,
      "status": "healthy"
    },
    "timestamp": "2025-01-20T14:30:00Z",
    "uptime": 3600000
  }
}
```

---

## 8. Backup & Restore

### List Backups

```
GET /backups
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "backup_name": "backup_2025_01_20_10_00",
      "backup_size": 52428800,
      "created_at": "2025-01-20T10:00:00Z",
      "status": "completed"
    }
  ]
}
```

---

### Create Backup

```
POST /backups/create
```

**Response:**

```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "id": 2,
    "backup_name": "backup_2025_01_20_14_30",
    "backup_size": 52428800,
    "created_at": "2025-01-20T14:30:00Z",
    "status": "completed"
  }
}
```

---

### Restore Backup

```
POST /backups/:id/restore
```

**Response:**

```json
{
  "success": true,
  "message": "Backup restored successfully"
}
```

**⚠️ Warning:** This operation will restore the entire database to the backup state.

---

## 9. Subscription Plans

### List Subscription Plans

```
GET /subscription-plans
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic",
      "description": "For small suppliers",
      "price": 29.99,
      "currency": "TND",
      "duration_months": 1,
      "features": ["Feature 1", "Feature 2"],
      "created_at": "2025-01-20T10:00:00Z"
    }
  ]
}
```

---

### Create Subscription Plan

```
POST /subscription-plans
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Premium",
  "description": "For enterprise suppliers",
  "price": 99.99,
  "currency": "TND",
  "duration_months": 12,
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Plan created successfully",
  "data": {
    "id": 3,
    "name": "Premium",
    ...
  }
}
```

---

### Update Subscription Plan

```
PUT /subscription-plans/:id
Content-Type: application/json
```

**Request Body:**

```json
{
  "price": 89.99,
  "features": ["Updated Feature 1", "New Feature"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Plan updated successfully",
  "data": { ... }
}
```

---

### Delete Subscription Plan

```
DELETE /subscription-plans/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Plan deleted successfully"
}
```

---

## 10. Feature Control

### List Features

```
GET /features
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "advanced_search",
      "description": "Advanced search functionality",
      "enabled": true,
      "created_at": "2025-01-20T10:00:00Z"
    }
  ]
}
```

---

### Toggle Feature

```
PUT /features/:id/toggle
Content-Type: application/json
```

**Request Body:**

```json
{
  "enabled": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Feature toggled successfully",
  "data": {
    "id": 1,
    "name": "advanced_search",
    "enabled": false
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation failed: field_name is required"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Accès refusé. Aucun jeton fourni."
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Insufficient permissions. super_admin role required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## cURL Examples

### Authenticate

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mynet.tn",
    "password": "password123"
  }'
```

### List Pages

```bash
curl -X GET "http://localhost:3000/api/super-admin/pages?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Page

```bash
curl -X POST http://localhost:3000/api/super-admin/pages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Services",
    "slug": "services",
    "content": "Our services...",
    "meta_description": "Services description"
  }'
```

### Upload File

```bash
curl -X POST http://localhost:3000/api/super-admin/files \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

### Get Audit Logs

```bash
curl -X GET "http://localhost:3000/api/super-admin/audit-logs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Send Email

```bash
curl -X POST http://localhost:3000/api/super-admin/emails/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "user@example.tn",
    "subject": "Test Email",
    "body": "Test email content"
  }'
```

---

## Endpoint Summary

| #   | Category  | Method | Endpoint                  | Purpose         |
| --- | --------- | ------ | ------------------------- | --------------- |
| 1   | Pages     | GET    | `/pages`                  | List all pages  |
| 2   | Pages     | GET    | `/pages/:id`              | Get single page |
| 3   | Pages     | POST   | `/pages`                  | Create page     |
| 4   | Pages     | PUT    | `/pages/:id`              | Update page     |
| 5   | Pages     | DELETE | `/pages/:id`              | Delete page     |
| 6   | Files     | GET    | `/files`                  | List files      |
| 7   | Files     | POST   | `/files`                  | Upload file     |
| 8   | Files     | DELETE | `/files/:id`              | Delete file     |
| 9   | Documents | GET    | `/documents`              | List documents  |
| 10  | Documents | POST   | `/documents`              | Create document |
| 11  | Documents | DELETE | `/documents/:id`          | Delete document |
| 12  | Emails    | GET    | `/emails`                 | List emails     |
| 13  | Emails    | POST   | `/emails/send`            | Send email      |
| 14  | Users     | GET    | `/users`                  | List users      |
| 15  | Users     | PUT    | `/users/:id/role`         | Change role     |
| 16  | Users     | POST   | `/users/:id/block`        | Block user      |
| 17  | Users     | POST   | `/users/:id/unblock`      | Unblock user    |
| 18  | Audit     | GET    | `/audit-logs`             | Get audit logs  |
| 19  | Health    | GET    | `/health`                 | System health   |
| 20  | Backups   | GET    | `/backups`                | List backups    |
| 21  | Backups   | POST   | `/backups/create`         | Create backup   |
| 22  | Backups   | POST   | `/backups/:id/restore`    | Restore backup  |
| 23  | Plans     | GET    | `/subscription-plans`     | List plans      |
| 24  | Plans     | POST   | `/subscription-plans`     | Create plan     |
| 25  | Plans     | PUT    | `/subscription-plans/:id` | Update plan     |
| 26  | Plans     | DELETE | `/subscription-plans/:id` | Delete plan     |
| 27  | Features  | GET    | `/features`               | List features   |
| 28  | Features  | PUT    | `/features/:id/toggle`    | Toggle feature  |

**Total: 30 API Endpoints**

---

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token

1. Call `POST /api/auth/login` with email and password
2. Response includes `accessToken` (valid for 15 minutes)
3. Use token in all Super Admin API requests

---

## Rate Limiting

- API requests are rate-limited to prevent abuse
- Default: 100 requests per minute per IP address
- Implement exponential backoff for retries

---

## Support

For API issues or questions:

- Check the Audit Logs endpoint (`/audit-logs`) to see successful operations
- Review error messages in response bodies
- Ensure authentication token is valid
- Verify super_admin role is assigned
