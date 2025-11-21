const express = require('express');
const SupplierFeatureController = require('../controllers/admin/SupplierFeatureController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkPermission } = require('../security/AuthorizationGuard');

const router = express.Router();

// Admin only - manage supplier features
router.put('/enable', authMiddleware, checkPermission('manage_features'), (req, res) =>
    SupplierFeatureController.enableFeature(req, res)
);

router.put('/disable', authMiddleware, checkPermission('manage_features'), (req, res) =>
    SupplierFeatureController.disableFeature(req, res)
);

// Get all available features
router.get('/available', authMiddleware, checkPermission('view_features'), (req, res) =>
    SupplierFeatureController.getAllAvailableFeatures(req, res)
);

// Get features by category
router.get('/category/:category', authMiddleware, checkPermission('view_features'), (req, res) =>
    SupplierFeatureController.getFeaturesByCategory(req, res)
);

// Get supplier's features
router.get('/supplier/:supplier_id', authMiddleware, checkPermission('view_features'), (req, res) =>
    SupplierFeatureController.getSupplierFeatures(req, res)
);

// Get supplier's active features
router.get('/supplier/:supplier_id/active', authMiddleware, checkPermission('view_features'), (req, res) =>
    SupplierFeatureController.getActiveFeatures(req, res)
);

// Check specific feature for supplier
router.get('/supplier/:supplier_id/check/:feature_key', authMiddleware, (req, res) =>
    SupplierFeatureController.checkSupplierFeature(req, res)
);

module.exports = router;
