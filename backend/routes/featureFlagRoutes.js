const express = require('express');
const FeatureFlagController = require('../controllers/admin/FeatureFlagController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

// Only ADMIN can manage feature flags
router.put(
  '/enable',
  authMiddleware.verifyToken,
  authMiddleware.checkPermission('manage_features'),
  (req, res) => FeatureFlagController.enableFeature(req, res)
);

router.put(
  '/disable',
  authMiddleware.verifyToken,
  authMiddleware.checkPermission('manage_features'),
  (req, res) => FeatureFlagController.disableFeature(req, res)
);

router.get(
  '/all',
  authMiddleware.verifyToken,
  authMiddleware.checkPermission('view_features'),
  (req, res) => FeatureFlagController.getAllFeatures(req, res)
);

router.get(
  '/category/:category',
  validateIdMiddleware('category'),
  authMiddleware.verifyToken,
  authMiddleware.checkPermission('view_features'),
  (req, res) => FeatureFlagController.getFeaturesByCategory(req, res)
);

router.get(
  '/:feature_key',
  validateIdMiddleware('feature_key'),
  authMiddleware.verifyToken,
  authMiddleware.checkPermission('view_features'),
  (req, res) => FeatureFlagController.getFeatureStatus(req, res)
);

module.exports = router;
