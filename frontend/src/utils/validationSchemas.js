/**
 * 📋 FORM VALIDATION SCHEMAS
 * Comprehensive validation rules for all forms in the application
 * Using simple, custom validation (not Zod, keeping it lightweight)
 */

/**
 * Validation Rules
 */
const rules = {
  // Email validation
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email invalide',
  },

  // Password validation
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message:
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
  },

  // Phone validation
  phone: {
    pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
    message: 'Numéro de téléphone invalide',
  },

  // URL validation
  url: {
    pattern:
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
    message: 'URL invalide',
  },

  // Number validation
  number: {
    pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
    message: 'Nombre invalide',
  },

  // Date validation
  date: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: 'Format de date invalide (YYYY-MM-DD)',
  },
};

/**
 * Authentication Schema
 */
export const authSchemas = {
  login: {
    email: [
      { required: true, message: 'Email requis' },
      { pattern: rules.email.pattern, message: rules.email.message },
    ],
    password: [
      { required: true, message: 'Mot de passe requis' },
      { minLength: 6, message: 'Au moins 6 caractères' },
    ],
  },

  register: {
    firstName: [
      { required: true, message: 'Prénom requis' },
      { minLength: 2, message: 'Au moins 2 caractères' },
      { maxLength: 50, message: 'Maximum 50 caractères' },
    ],
    lastName: [
      { required: true, message: 'Nom requis' },
      { minLength: 2, message: 'Au moins 2 caractères' },
      { maxLength: 50, message: 'Maximum 50 caractères' },
    ],
    email: [
      { required: true, message: 'Email requis' },
      { pattern: rules.email.pattern, message: rules.email.message },
    ],
    password: [
      { required: true, message: 'Mot de passe requis' },
      { minLength: 8, message: rules.password.message },
    ],
    confirmPassword: [
      { required: true, message: 'Confirmation requise' },
      { match: 'password', message: 'Les mots de passe ne correspondent pas' },
    ],
    phone: [
      { required: true, message: 'Téléphone requis' },
      { pattern: rules.phone.pattern, message: rules.phone.message },
    ],
    role: [{ required: true, message: 'Rôle requis' }],
  },
};

/**
 * Tender & Bid Schemas
 */
export const procurementSchemas = {
  createTender: {
    title: [
      { required: true, message: 'Titre requis' },
      { minLength: 3, message: 'Au moins 3 caractères' },
      { maxLength: 255, message: 'Maximum 255 caractères' },
    ],
    description: [
      { required: true, message: 'Description requise' },
      { minLength: 10, message: 'Au moins 10 caractères' },
      { maxLength: 5000, message: 'Maximum 5000 caractères' },
    ],
    category: [{ required: true, message: 'Catégorie requise' }],
    budget: [
      { required: true, message: 'Budget requis' },
      { pattern: rules.number.pattern, message: rules.number.message },
      { custom: (val) => parseFloat(val) > 0, message: 'Le budget doit être > 0' },
    ],
    currency: [{ required: true, message: 'Devise requise' }],
    deadline: [
      { required: true, message: 'Date limite requise' },
      { custom: (val) => new Date(val) > new Date(), message: 'La date doit être dans le futur' },
    ],
    location: [{ required: true, message: 'Localisation requise' }],
  },

  createBid: {
    amount: [
      { required: true, message: 'Montant requis' },
      { pattern: rules.number.pattern, message: rules.number.message },
      { custom: (val) => parseFloat(val) > 0, message: 'Le montant doit être > 0' },
    ],
    deliveryDate: [
      { required: true, message: 'Date de livraison requise' },
      { pattern: rules.date.pattern, message: rules.date.message },
    ],
    description: [
      { required: true, message: 'Description requise' },
      { minLength: 10, message: 'Au moins 10 caractères' },
    ],
    attachments: [{ required: false, message: '' }],
  },

  createInvoice: {
    invoiceNumber: [
      { required: true, message: 'Numéro de facture requis' },
      { minLength: 3, message: 'Au moins 3 caractères' },
    ],
    amount: [
      { required: true, message: 'Montant requis' },
      { pattern: rules.number.pattern, message: rules.number.message },
      { custom: (val) => parseFloat(val) > 0, message: 'Le montant doit être > 0' },
    ],
    dueDate: [
      { required: true, message: "Date d'échéance requise" },
      { pattern: rules.date.pattern, message: rules.date.message },
    ],
    description: [{ required: true, message: 'Description requise' }],
  },
};

/**
 * Company & Profile Schemas
 */
export const profileSchemas = {
  companyProfile: {
    companyName: [
      { required: true, message: "Nom de l'entreprise requis" },
      { minLength: 2, message: 'Au moins 2 caractères' },
      { maxLength: 255, message: 'Maximum 255 caractères' },
    ],
    registrationNumber: [{ required: true, message: "Numéro d'enregistrement requis" }],
    website: [
      { required: false, message: '' },
      { pattern: rules.url.pattern, message: rules.url.message },
    ],
    phone: [
      { required: true, message: 'Téléphone requis' },
      { pattern: rules.phone.pattern, message: rules.phone.message },
    ],
    email: [
      { required: true, message: 'Email requis' },
      { pattern: rules.email.pattern, message: rules.email.message },
    ],
    address: [
      { required: true, message: 'Adresse requise' },
      { minLength: 5, message: 'Au moins 5 caractères' },
    ],
    city: [{ required: true, message: 'Ville requise' }],
    country: [{ required: true, message: 'Pays requis' }],
    zipCode: [{ required: true, message: 'Code postal requis' }],
  },

  userProfile: {
    firstName: [
      { required: true, message: 'Prénom requis' },
      { minLength: 2, message: 'Au moins 2 caractères' },
    ],
    lastName: [
      { required: true, message: 'Nom requis' },
      { minLength: 2, message: 'Au moins 2 caractères' },
    ],
    email: [
      { required: true, message: 'Email requis' },
      { pattern: rules.email.pattern, message: rules.email.message },
    ],
    phone: [
      { required: true, message: 'Téléphone requis' },
      { pattern: rules.phone.pattern, message: rules.phone.message },
    ],
    bio: [
      { required: false, message: '' },
      { maxLength: 500, message: 'Maximum 500 caractères' },
    ],
  },
};

/**
 * Message & Communication Schemas
 */
export const communicationSchemas = {
  sendMessage: {
    recipient: [{ required: true, message: 'Destinataire requis' }],
    subject: [
      { required: true, message: 'Sujet requis' },
      { minLength: 3, message: 'Au moins 3 caractères' },
      { maxLength: 255, message: 'Maximum 255 caractères' },
    ],
    message: [
      { required: true, message: 'Message requis' },
      { minLength: 10, message: 'Au moins 10 caractères' },
      { maxLength: 5000, message: 'Maximum 5000 caractères' },
    ],
  },
};

/**
 * Search & Filter Schemas
 */
export const searchSchemas = {
  tenderSearch: {
    keyword: [
      { required: false, message: '' },
      { maxLength: 255, message: 'Maximum 255 caractères' },
    ],
    category: [{ required: false, message: '' }],
    minBudget: [
      { required: false, message: '' },
      { pattern: rules.number.pattern, message: rules.number.message },
    ],
    maxBudget: [
      { required: false, message: '' },
      { pattern: rules.number.pattern, message: rules.number.message },
    ],
    location: [{ required: false, message: '' }],
  },
};

/**
 * Admin & Super Admin Schemas
 */
export const adminSchemas = {
  createPage: {
    title: [
      { required: true, message: 'Titre requis' },
      { minLength: 3, message: 'Au moins 3 caractères' },
    ],
    slug: [
      { required: true, message: 'Slug requis' },
      { pattern: /^[a-z0-9-]+$/, message: 'Slug invalide (lettres minuscules, chiffres, tirets)' },
    ],
    content: [
      { required: true, message: 'Contenu requis' },
      { minLength: 10, message: 'Au moins 10 caractères' },
    ],
    description: [
      { required: false, message: '' },
      { maxLength: 500, message: 'Maximum 500 caractères' },
    ],
  },

  createUser: {
    email: [
      { required: true, message: 'Email requis' },
      { pattern: rules.email.pattern, message: rules.email.message },
    ],
    firstName: [{ required: true, message: 'Prénom requis' }],
    lastName: [{ required: true, message: 'Nom requis' }],
    role: [{ required: true, message: 'Rôle requis' }],
    password: [
      { required: true, message: 'Mot de passe requis' },
      { minLength: 8, message: 'Au moins 8 caractères' },
    ],
  },
};

export default {
  authSchemas,
  procurementSchemas,
  profileSchemas,
  communicationSchemas,
  searchSchemas,
  adminSchemas,
  rules,
};
