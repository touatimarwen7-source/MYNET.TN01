// Request validation middleware
const validationMiddleware = {
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  validatePhone: (phone) => /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone),
  validatePositiveNumber: (n) => Number.isFinite(n) && n > 0,
  validateRating: (r) => Number.isInteger(r) && r >= 1 && r <= 5,
  sanitizeString: (s) => s.trim().substring(0, 10000),
  validateEnum: (value, allowedValues) => allowedValues.includes(value)
};

module.exports = validationMiddleware;
