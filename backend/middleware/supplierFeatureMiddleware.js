const SubscriptionService = require('../services/SubscriptionService');

const supplierFeatureMiddleware = (requiredFeature) => {
    return async (req, res, next) => {
        try {
            // Get supplier ID from request
            const supplierId = req.params.supplier_id || req.body.supplier_id || req.user.userId;

            if (!supplierId) {
                return res.status(400).json({ error: 'Supplier ID not found' });
            }

            // Check if feature is enabled for this supplier
            const isEnabled = await SubscriptionService.isSupplierFeatureEnabled(
                supplierId, 
                requiredFeature
            );

            if (!isEnabled) {
                return res.status(403).json({
                    error: 'Feature not available',
                    feature: requiredFeature,
                    message: 'This feature is not enabled for your subscription',
                    action: 'Please upgrade your subscription or contact support'
                });
            }

            req.featureEnabled = true;
            req.supplierId = supplierId;
            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};

module.exports = supplierFeatureMiddleware;
