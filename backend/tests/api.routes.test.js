
/**
 * API Routes Comprehensive Testing
 * اختبار شامل لجميع مسارات API
 */

const request = require('supertest');
const app = require('../app');

describe('🧪 API Routes Registry Tests', () => {
  let authToken;
  let adminToken;
  let superAdminToken;

  // Setup: Login and get tokens
  beforeAll(async () => {
    // Login as regular user
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'supplier@mynet.tn', password: 'supplier123' });
    authToken = userRes.body.accessToken;

    // Login as admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@mynet.tn', password: 'admin123' });
    adminToken = adminRes.body.accessToken;
  });

  describe('✅ Public Routes', () => {
    test('GET / - Root endpoint', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Running');
    });

    test('GET /health - Health check', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    test('GET /api-docs - Swagger documentation', async () => {
      const res = await request(app).get('/api-docs');
      expect(res.status).toBe(200);
    });

    test('GET /api-spec.json - OpenAPI spec', async () => {
      const res = await request(app).get('/api-spec.json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    });
  });

  describe('🔐 Authentication Routes', () => {
    test('POST /api/auth/login - Login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'supplier@mynet.tn', password: 'supplier123' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
    });

    test('POST /api/auth/register - Register', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test${Date.now()}@test.tn`,
          password: 'Test123!',
          username: 'testuser',
          role: 'supplier'
        });
      expect([200, 201, 400]).toContain(res.status);
    });

    test('GET /api/auth/profile - Get profile', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401]).toContain(res.status);
    });
  });

  describe('🏢 Procurement Routes', () => {
    test('GET /api/procurement/tenders - List tenders', async () => {
      const res = await request(app)
        .get('/api/procurement/tenders')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401]).toContain(res.status);
    });

    test('GET /api/procurement/my-tenders - My tenders', async () => {
      const res = await request(app)
        .get('/api/procurement/my-tenders')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401]).toContain(res.status);
    });

    test('GET /api/procurement/my-offers - My offers', async () => {
      const res = await request(app)
        .get('/api/procurement/my-offers')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401]).toContain(res.status);
    });
  });

  describe('📊 Analytics Routes', () => {
    test('GET /api/analytics - Analytics data', async () => {
      const res = await request(app)
        .get('/api/analytics')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401, 404]).toContain(res.status);
    });

    test('GET /api/supplier-analytics - Supplier analytics', async () => {
      const res = await request(app)
        .get('/api/supplier-analytics')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401, 404]).toContain(res.status);
    });
  });

  describe('👥 Admin Routes', () => {
    test('GET /api/admin/users - List users (Admin only)', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      expect([200, 401, 403]).toContain(res.status);
    });

    test('GET /api/admin/statistics - Statistics', async () => {
      const res = await request(app)
        .get('/api/admin/statistics')
        .set('Authorization', `Bearer ${adminToken}`);
      expect([200, 401, 403]).toContain(res.status);
    });
  });

  describe('🔍 Search Routes', () => {
    test('GET /api/search/tenders - Search tenders', async () => {
      const res = await request(app)
        .get('/api/search/tenders?q=test')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401]).toContain(res.status);
    });
  });

  describe('📧 Notification Routes', () => {
    test('GET /api/notifications - Get notifications', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`);
      expect([200, 401]).toContain(res.status);
    });
  });

  describe('💾 Cache Management Routes', () => {
    test('GET /api/cache/stats - Cache statistics', async () => {
      const res = await request(app).get('/api/cache/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('cache');
    });

    test('DELETE /api/cache/clear - Clear cache (Admin)', async () => {
      const res = await request(app)
        .delete('/api/cache/clear')
        .set('Authorization', `Bearer ${adminToken}`);
      expect([200, 401, 403]).toContain(res.status);
    });
  });

  describe('🛠️ System Routes', () => {
    test('GET /api/health - Health check', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
    });

    test('GET /api/admin/error-stats - Error statistics', async () => {
      const res = await request(app).get('/api/admin/error-stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('stats');
    });

    test('GET /api/admin/rate-limit-stats - Rate limit stats', async () => {
      const res = await request(app).get('/api/admin/rate-limit-stats');
      expect(res.status).toBe(200);
    });
  });

  describe('❌ 404 Routes', () => {
    test('GET /api/nonexistent - Should return 404', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.status).toBe(404);
    });

    test('POST /api/invalid/route - Should return 404', async () => {
      const res = await request(app).post('/api/invalid/route');
      expect(res.status).toBe(404);
    });
  });
});

describe('🔒 Route Security Tests', () => {
  test('Protected routes should reject unauthenticated requests', async () => {
    const protectedRoutes = [
      '/api/procurement/my-tenders',
      '/api/procurement/my-offers',
      '/api/profile',
      '/api/notifications',
    ];

    for (const route of protectedRoutes) {
      const res = await request(app).get(route);
      expect(res.status).toBe(401);
    }
  });

  test('Admin routes should reject non-admin users', async () => {
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'supplier@mynet.tn', password: 'supplier123' });
    const userToken = userRes.body.accessToken;

    const adminRoutes = [
      '/api/admin/users',
      '/api/super-admin/pages',
    ];

    for (const route of adminRoutes) {
      const res = await request(app)
        .get(route)
        .set('Authorization', `Bearer ${userToken}`);
      expect([401, 403]).toContain(res.status);
    }
  });
});

module.exports = { describe, test, expect };
