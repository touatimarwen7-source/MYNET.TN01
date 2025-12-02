const FeatureFlagService = require('../../services/FeatureFlagService');

class FeatureFlagController {
  async enableFeature(req, res) {
    try {
      const { feature_key } = req.body;
      const adminId = req.user.id;

      if (!feature_key) {
        return res.status(400).json({ error: 'feature_key is required' });
      }

      const feature = await FeatureFlagService.enableFeature(feature_key, adminId);

      res.status(200).json({
        success: true,
        message: `Feature "${feature.feature_name}" enabled successfully`,
        feature,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async disableFeature(req, res) {
    try {
      const { feature_key, reason } = req.body;
      const adminId = req.user.id;

      if (!feature_key) {
        return res.status(400).json({ error: 'feature_key is required' });
      }

      const feature = await FeatureFlagService.disableFeature(feature_key, adminId, reason);

      res.status(200).json({
        success: true,
        message: `Feature "${feature.feature_name}" disabled successfully`,
        feature,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllFeatures(req, res) {
    try {
      const features = await FeatureFlagService.getAllFeatures();

      res.status(200).json({
        success: true,
        count: features.length,
        features,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFeaturesByCategory(req, res) {
    try {
      const { category } = req.params;
      const features = await FeatureFlagService.getFeaturesByCategory(category);

      res.status(200).json({
        success: true,
        count: features.length,
        features,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFeatureStatus(req, res) {
    try {
      const { feature_key } = req.params;
      const feature = await FeatureFlagService.getFeatureStatus(feature_key);

      if (!feature) {
        return res.status(404).json({ error: 'Feature not found' });
      }

      res.status(200).json({
        success: true,
        feature,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FeatureFlagController();
