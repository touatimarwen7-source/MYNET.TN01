const FeatureFlagService = require('../services/FeatureFlagService');

const featureFlagMiddleware = (requiredFeature) => {
  return async (req, res, next) => {
    try {
      const isEnabled = await FeatureFlagService.isFeatureEnabled(requiredFeature);

      if (!isEnabled) {
        return res.status(403).json({
          error: 'Feature is currently disabled',
          feature: requiredFeature,
          message: 'This feature has been disabled by the administrator',
        });
      }

      req.featureEnabled = true;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

module.exports = featureFlagMiddleware;
