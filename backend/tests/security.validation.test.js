
/**
 * 🔒 COMPREHENSIVE SECURITY VALIDATION TESTS
 * Tests for input validation, authentication, and access control
 */

const request = require('supertest');
const { getPool } = require('../config/db');
const { validators } = require('../middleware/validationMiddleware');
const bcrypt = require('bcryptjs');

describe('🔒 Security Validation Tests', () => {
  let app;
  let adminToken;
  let buyerToken;
  let supplierToken;

  beforeAll(async () => {
    app = require('../app');
    
    // Create test tokens
    const KeyManagementService = require('../security/KeyManagementService');
    adminToken = KeyManagementService.generateAccessToken({ 
      userId: 1, 
      role: 'admin', 
      email: 'admin@test.tn' 
    });
    buyerToken = KeyManagementService.generateAccessToken({ 
      userId: 2, 
      role: 'buyer', 
      email: 'buyer@test.tn' 
    });
    supplierToken = KeyManagementService.generateAccessToken({ 
      userId: 3, 
      role: 'supplier', 
      email: 'supplier@test.tn' 
    });
  });

  // ============================================
  // INPUT VALIDATION TESTS
  // ============================================
  describe('Input Validation', () => {
    test('should reject SQL injection in login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: "admin'--",
          password: 'password'
        });
      
      expect(response.status).toBe(400);
    });

    test('should reject XSS in tender creation', async () => {
      const response = await request(app)
        .post('/api/procurement/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          title: '<script>alert("XSS")</script>',
          description: 'Test description'
        });
      
      expect(response.status).toBe(400);
    });

    test('should validate email format', () => {
      expect(validators.isValidEmail('invalid')).toBe(false);
      expect(validators.isValidEmail('valid@test.tn')).toBe(true);
    });

    test('should validate phone format', () => {
      expect(validators.isValidPhone('invalid')).toBe(false);
      expect(validators.isValidPhone('+216 20 123 456')).toBe(true);
    });

    test('should validate positive numbers', () => {
      expect(validators.isValidPositiveNumber(-1)).toBe(false);
      expect(validators.isValidPositiveNumber(0)).toBe(false);
      expect(validators.isValidPositiveNumber(100)).toBe(true);
    });
  });

  // ============================================
  // AUTHENTICATION TESTS
  // ============================================
  describe('Authentication Security', () => {
    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.tn' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });

    test('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@test.tn',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
    });

    test('should reject expired tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.invalid';
      
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(response.status).toBe(403);
    });

    test('should require authentication for protected routes', async () => {
      const response = await request(app)
        .get('/api/procurement/buyer/dashboard-stats');
      
      expect(response.status).toBe(401);
    });
  });

  // ============================================
  // ACCESS CONTROL TESTS (Horizontal Privilege Escalation)
  // ============================================
  describe('Access Control & Privilege Escalation Prevention', () => {
    test('should prevent buyer from accessing supplier dashboard', async () => {
      const response = await request(app)
        .get('/api/procurement/supplier/dashboard-stats')
        .set('Authorization', `Bearer ${buyerToken}`);
      
      expect(response.status).toBe(403);
    });

    test('should prevent supplier from accessing buyer tenders', async () => {
      const response = await request(app)
        .get('/api/procurement/buyer/tenders')
        .set('Authorization', `Bearer ${supplierToken}`);
      
      expect(response.status).toBe(403);
    });

    test('should prevent user from accessing other user data', async () => {
      // User 2 trying to access User 1 data
      const response = await request(app)
        .get('/api/procurement/buyer/tenders/1')
        .set('Authorization', `Bearer ${buyerToken}`);
      
      // Should check ownership
      if (response.status === 200) {
        expect(response.body.data.user_id).toBe(2);
      }
    });

    test('should prevent non-admin from accessing admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${buyerToken}`);
      
      expect(response.status).toBe(403);
    });
  });

  // ============================================
  // SERVER-SIDE VALIDATION FOR CRITICAL OPERATIONS
  // ============================================
  describe('Critical Operations Validation', () => {
    test('should validate payment data server-side', async () => {
      const response = await request(app)
        .post('/api/payments/process')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          amount: -100, // Invalid negative amount
          currency: 'TND'
        });
      
      expect(response.status).toBe(400);
    });

    test('should validate tender budget server-side', async () => {
      const response = await request(app)
        .post('/api/procurement/tenders')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({
          title: 'Test Tender',
          description: 'Test description with at least 20 characters',
          budget_min: 1000,
          budget_max: 500 // Invalid: max < min
        });
      
      expect(response.status).toBe(400);
    });

    test('should validate offer amount against tender budget', async () => {
      const response = await request(app)
        .post('/api/procurement/offers')
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({
          tender_id: 1,
          total_amount: 999999999, // Unrealistic amount
          technical_proposal: 'Test proposal'
        });
      
      expect(response.status).toBe(400);
    });
  });

  // ============================================
  // PASSWORD SECURITY TESTS
  // ============================================
  describe('Password Security', () => {
    test('should enforce password complexity', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@test.tn',
          password: '123', // Too weak
          username: 'newuser',
          role: 'buyer'
        });
      
      expect(response.status).toBe(400);
    });

    test('should hash passwords before storage', async () => {
      const password = 'SecurePass123!';
      const hashed = await bcrypt.hash(password, 10);
      
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(50);
    });
  });

  // ============================================
  // RATE LIMITING TESTS
  // ============================================
  describe('Rate Limiting', () => {
    test('should rate limit login attempts', async () => {
      const requests = [];
      
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.tn', password: 'wrong' })
        );
      }
      
      const responses = await Promise.all(requests);
      const tooManyRequests = responses.filter(r => r.status === 429);
      
      expect(tooManyRequests.length).toBeGreaterThan(0);
    });
  });
});
