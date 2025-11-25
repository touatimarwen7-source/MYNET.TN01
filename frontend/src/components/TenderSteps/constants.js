export const REQUIREMENT_TYPES = [
  { value: 'technical', label: 'Technique' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'administrative', label: 'Administratif' },
  { value: 'legal', label: 'Légal' },
];

export const REQUIREMENT_PRIORITIES = [
  { value: 'essential', label: 'Essentielle', color: '#d32f2f' },
  { value: 'important', label: 'Important', color: '#ff9800' },
  { value: 'desirable', label: 'Souhaitable', color: '#4caf50' },
];

export const CATEGORIES = [
  { value: 'technology', label: 'Technologie & IT' },
  { value: 'supplies', label: 'Fournitures & Consommables' },
  { value: 'services', label: 'Services' },
  { value: 'construction', label: 'Construction & Travaux' },
  { value: 'other', label: 'Autres' },
];

export const getInitialFormData = () => ({
  consultation_number: '',
  title: '',
  description: '',
  category: 'technology',
  quantity_required: '',
  unit: '',
  publication_date: '',
  deadline: '',
  opening_date: '',
  queries_start_date: '',
  queries_end_date: '',
  offer_validity_days: '90',
  alert_type: 'before_48h',
  is_public: true,
  lots: [],
  awardLevel: 'lot',
  participation_eligibility: '',
  mandatory_documents: [],
  disqualification_criteria: '',
  submission_method: 'electronic',
  sealed_envelope_requirements: '',
  contact_person: '',
  contact_email: '',
  contact_phone: '',
  technical_specifications: '',
  requirements: [],
  attachments: [],
  specification_documents: [],
  evaluation_criteria: {
    price: 30,
    quality: 40,
    delivery: 20,
    experience: 10,
  },
});
