const BaseEntity = require('./BaseEntity');

class Tender extends BaseEntity {
  constructor(data = {}) {
    super(data);
    this.tender_number = data.tender_number || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.budget_min = data.budget_min || 0;
    this.budget_max = data.budget_max || 0;
    this.currency = data.currency || 'TND';
    this.status = data.status || 'draft';
    this.publish_date = data.publish_date || null;
    this.deadline = data.deadline || null;
    this.opening_date = data.opening_date || null;
    this.requirements = data.requirements || [];
    this.attachments = data.attachments || [];
    this.lots = data.lots || [];
    this.buyer_id = data.buyer_id || null;
    this.is_public = data.is_public || true;
    this.evaluation_criteria = data.evaluation_criteria || {};
    this.participation_eligibility = data.participation_eligibility || '';
    this.mandatory_documents = data.mandatory_documents || [];
    this.disqualification_criteria = data.disqualification_criteria || '';
    this.submission_method = data.submission_method || 'electronic';
    this.sealed_envelope_requirements = data.sealed_envelope_requirements || '';
    this.contact_person = data.contact_person || '';
    this.contact_email = data.contact_email || '';
    this.contact_phone = data.contact_phone || '';
    this.technical_specifications = data.technical_specifications || '';
    this.queries_start_date = data.queries_start_date || null;
    this.queries_end_date = data.queries_end_date || null;
    this.offer_validity_days = data.offer_validity_days || 90;
    this.alert_type = data.alert_type || 'before_48h';
  }

  toJSON() {
    const baseData = super.toJSON();
    return {
      ...baseData,
      tender_number: this.tender_number,
      title: this.title,
      description: this.description,
      category: this.category,
      budget_min: this.budget_min,
      budget_max: this.budget_max,
      currency: this.currency,
      status: this.status,
      publish_date: this.publish_date,
      deadline: this.deadline,
      opening_date: this.opening_date,
      requirements: this.requirements,
      attachments: this.attachments,
      lots: this.lots,
      buyer_id: this.buyer_id,
      is_public: this.is_public,
      evaluation_criteria: this.evaluation_criteria,
      participation_eligibility: this.participation_eligibility,
      mandatory_documents: this.mandatory_documents,
      disqualification_criteria: this.disqualification_criteria,
      submission_method: this.submission_method,
      sealed_envelope_requirements: this.sealed_envelope_requirements,
      contact_person: this.contact_person,
      contact_email: this.contact_email,
      contact_phone: this.contact_phone,
      technical_specifications: this.technical_specifications,
      queries_start_date: this.queries_start_date,
      queries_end_date: this.queries_end_date,
      offer_validity_days: this.offer_validity_days,
      alert_type: this.alert_type,
    };
  }
}

module.exports = Tender;
