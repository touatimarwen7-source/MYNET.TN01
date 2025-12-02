// Email Management Routes - TURN 3 OPTIONAL
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { sendEmail, emailTemplates } = require('../config/emailService');
const router = express.Router();
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

// Send test email
router.post('/send-test', authMiddleware, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email address required' });
    }

    const success = await sendEmail(
      email,
      'MyNet.tn Test Email',
      '<h1>Welcome to MyNet.tn!</h1><p>This is a test email.</p>'
    );

    if (success) {
      res.json({ success: true, message: 'Test email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send offer notification
router.post('/notify-offer', authMiddleware, async (req, res) => {
  try {
    const { buyerEmail, tenderId, supplierName, price } = req.body;
    const template = emailTemplates.newOffer(tenderId, supplierName, price);

    const success = await sendEmail(buyerEmail, template.subject, template.html);

    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send tender update notification
router.post('/notify-tender-update', authMiddleware, async (req, res) => {
  try {
    const { buyerEmail, tenderId, status } = req.body;
    const template = emailTemplates.tenderUpdate(tenderId, status);

    const success = await sendEmail(buyerEmail, template.subject, template.html);

    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
