const express = require('express');
const router = express.Router();
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const AuthController = require('../controllers/authController');
const AuthorizationGuard = require('../security/AuthorizationGuard');
const { ddosProtectionMiddleware, authLimiter } = require('../middleware/ddosProtectionMiddleware');
const enhancedRateLimiting = require('../middleware/enhancedRateLimiting');

router.post(
  '/register',
  authLimiter,
  enhancedRateLimiting.register,
  AuthController.register.bind(AuthController)
);
router.post(
  '/login',
  authLimiter,
  enhancedRateLimiting.login,
  AuthController.login.bind(AuthController)
);
router.post('/refresh-token', AuthController.refreshToken.bind(AuthController));
router.get(
  '/profile',
  AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
  AuthController.getProfile.bind(AuthController)
);
router.put(
  '/profile',
  AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
  AuthController.updateProfile.bind(AuthController)
);

module.exports = router;
