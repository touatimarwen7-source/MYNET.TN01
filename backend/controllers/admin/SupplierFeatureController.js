const SubscriptionService = require('../../services/SubscriptionService');

class SupplierFeatureController {
  async enableFeature(req, res) {
    try {
      const { supplier_id, feature_key, reason, expires_at } = req.body;
      const adminId = req.user.id;

      if (!supplier_id || !feature_key) {
        return res.status(400).json({
          error: 'supplier_id and feature_key are required',
        });
      }

      const feature = await SubscriptionService.enableSupplierFeature(
        supplier_id,
        feature_key,
        adminId,
        reason,
        expires_at
      );

      res.status(200).json({
        success: true,
        message: `Feature "${feature.feature_name}" enabled for supplier ${supplier_id}`,
        feature,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async disableFeature(req, res) {
    try {
      const { supplier_id, feature_key, reason } = req.body;
      const adminId = req.user.id;

      if (!supplier_id || !feature_key) {
        return res.status(400).json({
          error: 'supplier_id and feature_key are required',
        });
      }

      const feature = await SubscriptionService.disableSupplierFeature(
        supplier_id,
        feature_key,
        adminId,
        reason
      );

      res.status(200).json({
        success: true,
        message: `Feature "${feature.feature_name}" disabled for supplier ${supplier_id}`,
        feature,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSupplierFeatures(req, res) {
    try {
      const { supplier_id } = req.params;
      const features = await SubscriptionService.getSupplierFeatures(supplier_id);

      res.status(200).json({
        success: true,
        supplier_id: parseInt(supplier_id),
        features,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActiveFeatures(req, res) {
    try {
      const { supplier_id } = req.params;
      const features = await SubscriptionService.getSupplierActiveFeatures(supplier_id);

      res.status(200).json({
        success: true,
        supplier_id: parseInt(supplier_id),
        count: features.length,
        features,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllAvailableFeatures(req, res) {
    try {
      const features = await SubscriptionService.getAllAvailableFeatures();

      // Group by category
      const grouped = {};
      features.forEach((f) => {
        if (!grouped[f.category]) {
          grouped[f.category] = [];
        }
        grouped[f.category].push(f);
      });

      res.status(200).json({
        success: true,
        total: features.length,
        features,
        grouped,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFeaturesByCategory(req, res) {
    try {
      const { category } = req.params;
      const features = await SubscriptionService.getFeaturesByCategory(category);

      res.status(200).json({
        success: true,
        category,
        count: features.length,
        features,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkSupplierFeature(req, res) {
    try {
      const { supplier_id, feature_key } = req.params;
      const isEnabled = await SubscriptionService.isSupplierFeatureEnabled(
        supplier_id,
        feature_key
      );

      res.status(200).json({
        success: true,
        supplier_id: parseInt(supplier_id),
        feature_key,
        is_enabled: isEnabled,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SupplierFeatureController();
