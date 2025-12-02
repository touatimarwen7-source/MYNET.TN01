const ChatService = require('../../services/ChatService');

class ChatController {
  async sendMessage(req, res) {
    try {
      const userId = req.user.id;
      const message = await ChatService.sendMessage(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getConversation(req, res) {
    try {
      const { entityType, entityId } = req.params;
      const userId = req.user.id;

      const messages = await ChatService.getConversation(entityType, entityId, userId);

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { messageIds } = req.body;
      const userId = req.user.id;

      await ChatService.markAsRead(messageIds, userId);

      res.json({
        success: true,
        message: 'Messages marked as read',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new ChatController();
