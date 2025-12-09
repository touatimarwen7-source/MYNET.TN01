
/**
 * 🔒 CRITICAL OPERATIONS VALIDATOR
 * Server-side validation for payment and authentication operations
 */

const { validators } = require('./validationMiddleware');

/**
 * Validate payment data
 */
const validatePayment = (req, res, next) => {
  const { amount, currency, payment_method } = req.body;

  const errors = [];

  // Validate amount
  if (!amount || !validators.isValidDecimal(amount, 0.01, 999999999)) {
    errors.push({ field: 'amount', message: 'Invalid payment amount' });
  }

  // Validate currency
  const allowedCurrencies = ['TND', 'EUR', 'USD'];
  if (!currency || !allowedCurrencies.includes(currency)) {
    errors.push({ field: 'currency', message: 'Invalid currency' });
  }

  // Validate payment method
  const allowedMethods = ['credit_card', 'bank_transfer', 'e-wallet'];
  if (!payment_method || !allowedMethods.includes(payment_method)) {
    errors.push({ field: 'payment_method', message: 'Invalid payment method' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Payment validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validate login credentials
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  // Validate email
  if (!email || !validators.isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  // Validate password presence (not strength, that's for registration)
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  // Check for SQL injection patterns
  const sqlPatterns = [/--/, /;/, /\/\*/, /xp_/, /UNION/i, /SELECT/i, /DROP/i];
  const combinedInput = `${email}${password}`;
  
  if (sqlPatterns.some(pattern => pattern.test(combinedInput))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input detected'
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Login validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validate registration data
 */
const validateRegistration = (req, res, next) => {
  const { email, password, username, phone, role } = req.body;

  const errors = [];

  // Email validation
  if (!email || !validators.isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  // Password strength validation
  if (!password || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }

  // Check password complexity
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    errors.push({ 
      field: 'password', 
      message: 'Password must contain uppercase, lowercase, and numbers' 
    });
  }

  // Username validation
  if (!username || !validators.isValidString(username, 3, 50)) {
    errors.push({ field: 'username', message: 'Username must be 3-50 characters' });
  }

  // Phone validation (if provided)
  if (phone && !validators.isValidPhone(phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  // Role validation
  const allowedRoles = ['buyer', 'supplier', 'viewer'];
  if (role && !allowedRoles.includes(role)) {
    errors.push({ field: 'role', message: 'Invalid role' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Registration validation failed',
      details: errors
    });
  }

  next();
};

/**
 * Validate tender creation
 */
const validateTenderCreation = (req, res, next) => {
  const { title, description, budget_min, budget_max, deadline } = req.body;

  const errors = [];

  // Title validation
  if (!title || !validators.isValidString(title, 5, 500)) {
    errors.push({ field: 'title', message: 'Title must be 5-500 characters' });
  }

  // Description validation
  if (!description || !validators.isValidString(description, 20, 5000)) {
    errors.push({ field: 'description', message: 'Description must be 20-5000 characters' });
  }

  // Budget validation
  if (budget_min && budget_max && parseFloat(budget_min) > parseFloat(budget_max)) {
    errors.push({ field: 'budget', message: 'Minimum budget cannot exceed maximum budget' });
  }

  // Deadline validation
  if (deadline && new Date(deadline) <= new Date()) {
    errors.push({ field: 'deadline', message: 'Deadline must be in the future' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Tender validation failed',
      details: errors
    });
  }

  next();
};

module.exports = {
  validatePayment,
  validateLogin,
  validateRegistration,
  validateTenderCreation
};
