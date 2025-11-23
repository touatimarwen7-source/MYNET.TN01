# 📚 MyNet.tn API Documentation

**Base URL:** `http://localhost:3000/api`

## Authentication Endpoints

### POST /auth/register
Register a new user
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "full_name": "string",
  "role": "buyer|supplier|viewer"
}
```

### POST /auth/login
Login user
```json
{
  "email": "string",
  "password": "string"
}
```

---

## Procurement Endpoints

### GET /procurement/tenders
Get all tenders
- **Query Parameters:**
  - `limit` (default: 50, max: 500)
  - `offset` (default: 0)
  - `status` (draft, published, closed, awarded)
  - `category` (filter by category)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "string",
      "description": "string",
      "status": "published",
      "budget_min": 1000,
      "budget_max": 5000,
      "deadline": "2025-12-31T00:00:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 100
  }
}
```

### POST /procurement/tenders
Create tender (buyers only)
```json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "budget_min": 1000,
  "budget_max": 5000,
  "deadline": "2025-12-31T00:00:00Z",
  "requirements": []
}
```

### GET /procurement/offers
Get all offers
- **Query Parameters:**
  - `limit`, `offset` (pagination)
  - `tender_id` (filter by tender)
  - `status` (submitted, evaluated, accepted, rejected)

### POST /procurement/offers
Submit offer (suppliers only)
```json
{
  "tender_id": 1,
  "total_amount": 2500,
  "delivery_time": "30 days",
  "payment_terms": "string",
  "technical_proposal": "string",
  "financial_proposal": "string"
}
```

---

## User Endpoints

### GET /users/:id
Get user profile

### PUT /users/:id
Update user profile

### GET /users/:id/tenders
Get user's tenders (buyers)

### GET /users/:id/offers
Get user's offers (suppliers)

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input",
  "code": "VALIDATION_ERROR"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "An error occurred processing your request",
  "code": "INTERNAL_ERROR"
}
```

---

## Rate Limiting

- **Limit:** 1000 requests per hour per user
- **Response Code:** 429 Too Many Requests
- **Header:** `Retry-After: seconds`

---

## Pagination Guide

All list endpoints support pagination:

```
?limit=50&offset=0
```

- **limit**: 1-500 (default: 50)
- **offset**: Starting position (default: 0)

Response includes:
```json
{
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 500
  }
}
```

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "timestamp": "2025-11-23T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-11-23T12:00:00.000Z"
}
```

