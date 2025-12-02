/**
 * API Documentation Routes
 * Provides Swagger/OpenAPI endpoints for API documentation
 */

const swaggerSpec = require('../config/swagger');

module.exports = (app) => {
  /**
   * @swagger
   * /api-docs:
   *   get:
   *     summary: Interactive API Documentation
   *     description: Swagger UI for exploring and testing API endpoints
   *     tags:
   *       - Documentation
   *     responses:
   *       200:
   *         description: Swagger UI HTML page
   */
  app.get('/api/docs', (req, res) => {
    res.json({
      message: 'API Documentation',
      swagger: '/api-docs',
      docs: 'https://swagger.io',
      openapi: '3.0.0',
      endpoints: 95,
      status: 'ready',
    });
  });

  /**
   * @swagger
   * /api/spec.json:
   *   get:
   *     summary: OpenAPI Specification (JSON)
   *     description: Complete OpenAPI specification in JSON format
   *     tags:
   *       - Documentation
   *     responses:
   *       200:
   *         description: OpenAPI specification
   */
  app.get('/api/spec.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  return app;
};
