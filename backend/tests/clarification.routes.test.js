
const request = require('supertest');
const app = require('../app');
const { getPool } = require('../config/db');

describe('Clarification Routes', () => {
  let buyerToken;
  let supplierToken;
  let offerId;
  let clarificationId;

  beforeAll(async () => {
    // Setup test data
    // This assumes you have test users created
  });

  afterAll(async () => {
    const pool = getPool();
    await pool.end();
  });

  describe('POST /api/clarifications/offers/:offerId/clarification', () => {
    it('should create clarification request with valid buyer token', async () => {
      const response = await request(app)
        .post(`/api/clarifications/offers/${offerId}/clarification`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ question: 'Test clarification question' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      clarificationId = response.body.id;
    });

    it('should reject request without question', async () => {
      const response = await request(app)
        .post(`/api/clarifications/offers/${offerId}/clarification`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should reject request from supplier', async () => {
      const response = await request(app)
        .post(`/api/clarifications/offers/${offerId}/clarification`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({ question: 'Test question' });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/clarifications/received', () => {
    it('should get clarifications for supplier', async () => {
      const response = await request(app)
        .get('/api/clarifications/received')
        .set('Authorization', `Bearer ${supplierToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject request from buyer', async () => {
      const response = await request(app)
        .get('/api/clarifications/received')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/clarifications/:clarificationId', () => {
    it('should get clarification by ID for authorized user', async () => {
      const response = await request(app)
        .get(`/api/clarifications/${clarificationId}`)
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', clarificationId);
    });
  });

  describe('POST /api/clarifications/:clarificationId/respond', () => {
    it('should allow supplier to respond', async () => {
      const response = await request(app)
        .post(`/api/clarifications/${clarificationId}/respond`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({ response: 'Test response' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
    });

    it('should reject response without text', async () => {
      const response = await request(app)
        .post(`/api/clarifications/${clarificationId}/respond`)
        .set('Authorization', `Bearer ${supplierToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should reject response from buyer', async () => {
      const response = await request(app)
        .post(`/api/clarifications/${clarificationId}/respond`)
        .set('Authorization', `Bearer ${buyerToken}`)
        .send({ response: 'Test response' });

      expect(response.status).toBe(403);
    });
  });
});
