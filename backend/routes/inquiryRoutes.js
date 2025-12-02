const express = require('express');
const router = express.Router();
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const TenderInquiryService = require('../services/TenderInquiryService');
const AddendumService = require('../services/AddendumService');

// Submit an inquiry
router.post('/tenders/:tenderId/inquiries', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { subject, inquiry_text, attachments } = req.body;
    const supplierId = req.user?.id;

    if (!supplierId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!subject || !inquiry_text) {
      return res
        .status(400)
        .json({ success: false, message: 'Subject and inquiry text are required' });
    }

    const inquiry = await TenderInquiryService.submitInquiry(
      parseInt(tenderId, 10),
      supplierId,
      subject,
      inquiry_text,
      attachments || []
    );

    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get inquiries for a tender
router.get('/tenders/:tenderId/inquiries', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const inquiries = await TenderInquiryService.getInquiriesByTender(
      parseInt(tenderId, 10),
      page,
      limit
    );

    res.status(200).json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get my inquiries (supplier)
router.get('/my-inquiries', async (req, res) => {
  try {
    const supplierId = req.user?.id;

    if (!supplierId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const inquiries = await TenderInquiryService.getMyInquiries(supplierId, page, limit);

    res.status(200).json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Respond to inquiry
router.post('/inquiries/:inquiryId/respond', async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { response_text, attachments } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!response_text) {
      return res.status(400).json({ success: false, message: 'Response text is required' });
    }

    const response = await TenderInquiryService.respondToInquiry(
      parseInt(inquiryId, 10),
      response_text,
      attachments || [],
      userId
    );

    res.status(201).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get inquiry responses
router.get('/inquiries/:inquiryId/responses', async (req, res) => {
  try {
    const { inquiryId } = req.params;

    const responses = await TenderInquiryService.getInquiryResponses(parseInt(inquiryId, 10));

    res.status(200).json({ success: true, count: responses.length, responses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create and publish addendum
router.post('/tenders/:tenderId/addenda', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { title, content, inquiry_responses, supplier_emails } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const addendum = await AddendumService.createAddendum(
      parseInt(tenderId, 10),
      title,
      content,
      inquiry_responses || [],
      userId
    );

    // Notify suppliers
    if (supplier_emails && supplier_emails.length > 0) {
      await AddendumService.notifySuppliers(addendum.id, supplier_emails, userId);
    }

    res.status(201).json({ success: true, addendum });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get addenda for tender
router.get('/tenders/:tenderId/addenda', async (req, res) => {
  try {
    const { tenderId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const addenda = await AddendumService.getAddendaByTender(parseInt(tenderId, 10), page, limit);

    res.status(200).json({ success: true, count: addenda.length, addenda });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get my notifications
router.get('/my-notifications', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const notifications = await AddendumService.getUserNotifications(userId, page, limit);

    res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark notification as read
router.post('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;

    await AddendumService.markNotificationRead(parseInt(notificationId, 10));

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
