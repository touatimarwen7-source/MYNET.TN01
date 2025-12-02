/**
 * WebSocket Events Manager
 * Handles all real-time event broadcasting and user notifications via socket.io
 */

class WebSocketEventsManager {
  /**
   * Initialize WebSocket event manager
   * @param {Object} io - Socket.io instance
   */
  constructor(io) {
    this.io = io;
    this.userConnections = new Map(); // Track user connections
  }

  /**
   * Register a new user socket connection
   * @param {string} userId - ID of user connecting
   * @param {string} socketId - Socket.io socket ID
   * @returns {void}
   */
  registerUserConnection(userId, socketId) {
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, []);
    }
    this.userConnections.get(userId).push(socketId);
  }

  /**
   * Remove user socket connection when disconnecting
   * @param {string} userId - ID of user disconnecting
   * @param {string} socketId - Socket.io socket ID to remove
   * @returns {void}
   */
  removeUserConnection(userId, socketId) {
    if (this.userConnections.has(userId)) {
      const connections = this.userConnections.get(userId);
      const index = connections.indexOf(socketId);
      if (index > -1) {
        connections.splice(index, 1);
      }
      if (connections.length === 0) {
        this.userConnections.delete(userId);
      }
    }
  }

  /**
   * Broadcast new offer creation to all tender watchers
   * @param {string} tenderId - ID of tender
   * @param {Object} offerData - Offer details
   * @returns {void}
   */
  emitOfferCreated(tenderId, offerData) {
    this.io.to(`tender-${tenderId}`).emit('offer-created', {
      type: 'offer-created',
      tenderId,
      offerId: offerData.id,
      supplierName: offerData.supplier_name,
      price: offerData.price,
      currency: offerData.currency,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast tender status change to all participants
   * @param {string} tenderId - ID of tender
   * @param {string} status - New tender status
   * @param {string} changedBy - User ID who made the change
   * @returns {void}
   */
  emitTenderStatusChanged(tenderId, status, changedBy) {
    this.io.to(`tender-${tenderId}`).emit('tender-status-changed', {
      type: 'tender-status-changed',
      tenderId,
      status,
      changedBy,
      timestamp: new Date(),
    });
  }

  /**
   * Send new message notification to recipient
   * @param {string} recipientId - ID of message recipient
   * @param {Object} senderData - Sender information
   * @returns {void}
   */
  emitNewMessage(recipientId, senderData) {
    this.io.to(`user-${recipientId}`).emit('message-received', {
      type: 'message-received',
      senderId: senderData.senderId,
      senderName: senderData.senderName,
      message: senderData.message,
      timestamp: new Date(),
    });
  }

  /**
   * Send rating received notification to supplier
   * @param {string} supplierId - ID of rated supplier
   * @param {Object} ratingData - Rating details
   * @returns {void}
   */
  emitRatingReceived(supplierId, ratingData) {
    this.io.to(`user-${supplierId}`).emit('rating-received', {
      type: 'rating-received',
      rating: ratingData.rating,
      reviewer: ratingData.reviewer,
      comment: ratingData.comment,
      timestamp: new Date(),
    });
  }

  /**
   * Send email notification confirmation to user
   * @param {string} userId - ID of user
   * @param {Object} emailData - Email details
   * @returns {void}
   */
  emitEmailNotification(userId, emailData) {
    this.io.to(`user-${userId}`).emit('email-sent', {
      type: 'email-sent',
      subject: emailData.subject,
      recipientEmail: emailData.recipientEmail,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast user online status to all connected clients
   * @param {string} userId - ID of user coming online
   * @returns {void}
   */
  emitUserOnline(userId) {
    this.io.emit('user-online', {
      type: 'user-online',
      userId,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast user offline status to all connected clients
   * @param {string} userId - ID of user going offline
   * @returns {void}
   */
  emitUserOffline(userId) {
    this.io.emit('user-offline', {
      type: 'user-offline',
      userId,
      timestamp: new Date(),
    });
  }

  /**
   * Send generic notification to user
   * @param {string} userId - ID of user to notify
   * @param {Object} notification - Notification object with title and message
   * @returns {void}
   */
  emitNotification(userId, notification) {
    this.io.to(`user-${userId}`).emit('notification', {
      type: 'notification',
      title: notification.title,
      message: notification.message,
      icon: notification.icon,
      action: notification.action,
      timestamp: new Date(),
    });
  }

  /**
   * Broadcast tender update to all tender watchers
   * @param {string} tenderId - ID of tender
   * @param {Object} updateData - Update details including field and new value
   * @returns {void}
   */
  emitTenderUpdated(tenderId, updateData) {
    this.io.to(`tender-${tenderId}`).emit('tender-updated', {
      type: 'tender-updated',
      tenderId,
      field: updateData.field,
      newValue: updateData.newValue,
      oldValue: updateData.oldValue,
      changedBy: updateData.changedBy,
      timestamp: new Date(),
    });
  }

  /**
   * Send statistics update to user
   * @param {string} userId - ID of user
   * @param {Object} stats - Statistics object
   * @returns {void}
   */
  emitStatisticsUpdate(userId, stats) {
    this.io.to(`user-${userId}`).emit('statistics-updated', {
      type: 'statistics-updated',
      stats,
      timestamp: new Date(),
    });
  }

  /**
   * Send critical alert to user
   * @param {string} userId - ID of user
   * @param {Object} alert - Alert object with level, title, and message
   * @returns {void}
   */
  emitCriticalAlert(userId, alert) {
    this.io.to(`user-${userId}`).emit('critical-alert', {
      type: 'critical-alert',
      level: alert.level || 'warning',
      title: alert.title,
      message: alert.message,
      action: alert.action,
      timestamp: new Date(),
    });
  }

  /**
   * Get number of active connections for a user
   * @param {string} userId - ID of user
   * @returns {number} Number of active socket connections
   */
  getUserConnectionCount(userId) {
    return this.userConnections.get(userId)?.length || 0;
  }

  /**
   * Check if user is currently online
   * @param {string} userId - ID of user
   * @returns {boolean} True if user has active connections
   */
  isUserOnline(userId) {
    return this.userConnections.has(userId);
  }

  /**
   * Get total count of all currently online users
   * @returns {number} Number of unique users with active connections
   */
  getOnlineUsersCount() {
    return this.userConnections.size;
  }
}

module.exports = WebSocketEventsManager;
