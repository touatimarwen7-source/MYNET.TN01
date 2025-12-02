const BaseEntity = require('./BaseEntity');

class ArchivePolicy extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.entity_type = data.entity_type || ''; // tender, offer, invoice, purchase_order
    this.retention_days = data.retention_days || 2555; // 7 years default
    this.archive_action = data.archive_action || 'archive'; // archive, delete
    this.is_active = data.is_active !== undefined ? data.is_active : true;
  }

  static get tableName() {
    return 'archive_policies';
  }
}

module.exports = ArchivePolicy;
