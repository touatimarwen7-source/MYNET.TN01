
const TenderAwardService = require('../../services/TenderAwardService');

class TenderAwardController {
    /**
     * Initialize line items for tender award
     */
    async initializeAward(req, res) {
        try {
            const { tenderId } = req.params;
            const { lineItems } = req.body;

            if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Line items are required'
                });
            }

            const items = await TenderAwardService.initializeTenderAward(
                tenderId,
                lineItems,
                req.user.userId
            );

            res.status(201).json({
                success: true,
                message: 'Tender award initialized successfully',
                items
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Distribute a line item across suppliers
     */
    async distributeLineItem(req, res) {
        try {
            const { tenderId, lineItemId } = req.params;
            const { distribution } = req.body;

            if (!distribution || !Array.isArray(distribution)) {
                return res.status(400).json({
                    success: false,
                    error: 'Distribution data is required'
                });
            }

            const updatedItem = await TenderAwardService.distributeLineItem(
                tenderId,
                lineItemId,
                distribution,
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: 'Line item distributed successfully',
                item: updatedItem
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Get award details for a tender
     */
    async getAwardDetails(req, res) {
        try {
            const { tenderId } = req.params;

            const details = await TenderAwardService.getTenderAwardDetails(
                tenderId,
                req.user.userId
            );

            res.status(200).json({
                success: true,
                items: details
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * Finalize tender award and create purchase orders
     */
    async finalizeAward(req, res) {
        try {
            const { tenderId } = req.params;

            const result = await TenderAwardService.finalizeTenderAward(
                tenderId,
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: 'Tender award finalized successfully',
                purchaseOrders: result.purchaseOrders,
                supplierCount: result.supplierCount
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new TenderAwardController();
