const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/messaging/ChatController');
const AuthorizationGuard = require('../security/AuthorizationGuard');

// Send message
router.post(
  '/messages',
  AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
  ChatController.sendMessage.bind(ChatController)
);

// Get conversation for entity
router.get(
  '/conversations/:entityType/:entityId',
  AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
  ChatController.getConversation.bind(ChatController)
);

// Mark messages as read
router.patch(
  '/messages/read',
  AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
  ChatController.markAsRead.bind(ChatController)
);

module.exports = router;
