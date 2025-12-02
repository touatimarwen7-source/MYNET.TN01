const BaseEntity = require('./BaseEntity');

class Message extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.sender_id = data.sender_id || null;
    this.receiver_id = data.receiver_id || null;
    this.related_entity_type = data.related_entity_type || ''; // tender, purchase_order, invoice
    this.related_entity_id = data.related_entity_id || null;
    this.subject = data.subject || '';
    this.content = data.content || '';
    this.is_read = data.is_read || false;
    this.attachments = data.attachments || [];
    this.parent_message_id = data.parent_message_id || null; // for threading
  }

  static get tableName() {
    return 'messages';
  }
}

module.exports = Message;
