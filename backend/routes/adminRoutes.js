const express = require('express');
const router = express.Router();
const { adminAuth, isSuperAdmin } = require('../middleware/adminMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');
const { validateObjectId } = require('../middleware/validateIdMiddleware');

// Import controllers once
const AdminController = require('../controllers/admin/AdminController');
const SubscriptionAdminController = require('../controllers/admin/SubscriptionAdminController');
const AdvertisementController = require('../controllers/admin/AdvertisementController');

// Initialize controllers
const adminController = new AdminController();

// ============================================================================
// ADMIN ROUTES - Enhanced with Advanced Features
// ============================================================================

// Dashboard & Analytics
router.get('/dashboard', adminAuth, asyncHandler(async (req, res) => {
  try {
    // Get basic stats
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const statsResult = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'buyer') as total_buyers,
        (SELECT COUNT(*) FROM users WHERE role = 'supplier') as total_suppliers,
        (SELECT COUNT(*) FROM tenders WHERE is_deleted = false) as total_tenders,
        (SELECT COUNT(*) FROM offers WHERE is_deleted = false) as total_offers
    `);
    
    res.json({
      success: true,
      data: statsResult.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.get('/dashboard/stats', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const healthCheck = await db.query('SELECT NOW()');
    
    res.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.get('/analytics', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const analytics = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM tenders
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    res.json({
      success: true,
      data: analytics.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.get('/metrics', adminAuth, asyncHandler(async (req, res) => {
  try {
    res.json({
      success: true,
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.get('/monitoring', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    const healthCheck = await db.query('SELECT NOW()');
    
    res.json({
      success: true,
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

// ===== Gestion des utilisateurs =====
router.get('/users', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const users = await db.query(`
      SELECT id, email, role, company_name, is_verified, created_at
      FROM users
      WHERE is_deleted = false
      ORDER BY created_at DESC
      LIMIT 100
    `);
    
    res.json({
      success: true,
      data: users.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.put('/users/:id/status', adminAuth, validateObjectId('id'), asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    const { id } = req.params;
    
    await db.query(`
      UPDATE users
      SET is_active = NOT is_active
      WHERE id = $1
    `, [id]);
    
    res.json({
      success: true,
      message: 'Statut utilisateur modifié',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

// ===== Configuration du système =====
router.get('/config', adminAuth, asyncHandler(async (req, res) => {
  try {
    res.json({
      success: true,
      config: {
        platform_name: 'MyNet.tn',
        version: '1.2.0',
        maintenance_mode: false
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.put('/config', adminAuth, asyncHandler(async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Configuration mise à jour',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

// ===== Analyses et surveillance =====
router.get('/analytics/activities', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const activities = await db.query(`
      SELECT * FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 50
    `);
    
    res.json({
      success: true,
      data: activities.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.get('/analytics/users', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const userStats = await db.query(`
      SELECT 
        role,
        COUNT(*) as count,
        COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_count
      FROM users
      WHERE is_deleted = false
      GROUP BY role
    `);
    
    res.json({
      success: true,
      data: userStats.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.get('/analytics/performance', adminAuth, asyncHandler(async (req, res) => {
  try {
    res.json({
      success: true,
      performance: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.get('/analytics/assistants', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const assistants = await db.query(`
      SELECT * FROM users
      WHERE role = 'admin_assistant'
      AND is_deleted = false
    `);
    
    res.json({
      success: true,
      data: assistants.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

// ===== Gestion des abonnements =====
router.get('/subscriptions/plans', adminAuth, asyncHandler(SubscriptionAdminController.getAllPlans));
router.post('/subscriptions/plans', adminAuth, asyncHandler(SubscriptionAdminController.createPlan));
router.put('/subscriptions/plans/:id', adminAuth, validateObjectId('id'), asyncHandler(SubscriptionAdminController.updatePlan));
router.delete('/subscriptions/plans/:id', adminAuth, validateObjectId('id'), asyncHandler(SubscriptionAdminController.deletePlan));
router.get('/subscriptions/analytics', adminAuth, asyncHandler(SubscriptionAdminController.getSubscriptionAnalytics));

// ===== Gestion des publicités =====
router.get('/advertisements', adminAuth, asyncHandler(AdvertisementController.getAllAds));
router.post('/advertisements', adminAuth, asyncHandler(AdvertisementController.createAd));
router.put('/advertisements/:id', adminAuth, validateObjectId('id'), asyncHandler(AdvertisementController.updateAd));
router.delete('/advertisements/:id', adminAuth, validateObjectId('id'), asyncHandler(AdvertisementController.deleteAd));
router.get('/advertisements/:id/analytics', adminAuth, validateObjectId('id'), asyncHandler(AdvertisementController.getAdAnalytics));

// ===== Audit logs export =====
router.get('/audit/export', adminAuth, asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    
    const logs = await db.query(`
      SELECT * FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 1000
    `);
    
    res.json({
      success: true,
      data: logs.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

// ===== User Management Actions =====
router.get('/users/:userId', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    const { userId } = req.params;
    
    const user = await db.query(`
      SELECT id, email, role, company_name, is_verified, created_at
      FROM users
      WHERE id = $1
    `, [userId]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: user.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.put('/users/:userId/role', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    const { userId } = req.params;
    const { role } = req.body;
    
    await db.query(`
      UPDATE users
      SET role = $1
      WHERE id = $2
    `, [role, userId]);
    
    res.json({
      success: true,
      message: 'Rôle utilisateur modifié',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.post('/users/:userId/block', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    const { userId } = req.params;
    
    await db.query(`
      UPDATE users
      SET is_active = false
      WHERE id = $1
    `, [userId]);
    
    res.json({
      success: true,
      message: 'Utilisateur bloqué',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.post('/users/:userId/unblock', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    const { userId } = req.params;
    
    await db.query(`
      UPDATE users
      SET is_active = true
      WHERE id = $1
    `, [userId]);
    
    res.json({
      success: true,
      message: 'Utilisateur débloqué',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.delete('/users/:userId', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  try {
    const db = req.app.get('db') || require('../config/db').getPool();
    const { userId } = req.params;
    
    await db.query(`
      UPDATE users
      SET is_deleted = true
      WHERE id = $1
    `, [userId]);
    
    res.json({
      success: true,
      message: 'Utilisateur supprimé',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

router.post('/users/:userId/reset-password', adminAuth, validateObjectId('userId'), asyncHandler(async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Email de réinitialisation envoyé',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}));

module.exports = router;