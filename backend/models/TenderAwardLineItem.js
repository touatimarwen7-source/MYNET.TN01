
const BaseEntity = require('./BaseEntity');

class TenderAwardLineItem extends BaseEntity {
    constructor(data = {}) {
        super(data);
        this.tender_id = data.tender_id || null;
        this.line_item_id = data.line_item_id || null;
        this.item_description = data.item_description || '';
        this.total_quantity = data.total_quantity || 0;
        this.unit = data.unit || '';
        this.awarded_offers = data.awarded_offers || []; // Array of {offer_id, supplier_id, quantity, unit_price, total_amount}
        this.status = data.status || 'pending'; // pending, awarded, finalized
        this.notes = data.notes || '';
    }

    toJSON() {
        const baseData = super.toJSON();
        return {
            ...baseData,
            tender_id: this.tender_id,
            line_item_id: this.line_item_id,
            item_description: this.item_description,
            total_quantity: this.total_quantity,
            unit: this.unit,
            awarded_offers: this.awarded_offers,
            status: this.status,
            notes: this.notes
        };
    }
}

module.exports = TenderAwardLineItem;
