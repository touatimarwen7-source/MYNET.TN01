const express = require('express');
const router = express.Router();
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const OpeningReportService = require('../services/OpeningReportService');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');

/**
 * GET /api/opening-reports/tenders/:tenderId/opening-report
 * Get opening report for a specific tender
 */
router.get('/tenders/:tenderId/opening-report', asyncHandler(async (req, res) => {
  const { tenderId } = req.params;

  if (!tenderId || isNaN(tenderId)) {
    return res.status(400).json({
      success: false,
      message: 'Tender ID must be a valid number',
    });
  }

  const report = await OpeningReportService.getOpeningReportByTenderId(parseInt(tenderId, 10));

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Opening report not found for this tender',
    });
  }

  res.status(200).json({ 
    success: true, 
    data: report,
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /api/opening-reports/my-opening-reports
 * Get all opening reports for the logged-in buyer
 */
router.get('/my-opening-reports', asyncHandler(async (req, res) => {
  // Check authentication via header token if needed
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // If using token-based auth, verify token here
  // For now, we'll require user info from request
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'User authentication required',
    });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination parameters',
    });
  }

  const reports = await OpeningReportService.getOpeningReportsByBuyer(req.user.id, page, limit);

  res.status(200).json({
    success: true,
    data: reports,
    pagination: {
      page,
      limit,
      count: reports.length
    },
    timestamp: new Date().toISOString()
  });
}));

/**
 * GET /api/opening-reports/:reportId/export
 * Export opening report in specified format
 */
router.get('/:reportId/export', asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  const { format = 'json' } = req.query;

  if (!reportId || isNaN(reportId)) {
    return res.status(400).json({
      success: false,
      message: 'Report ID must be a valid number',
    });
  }

  const validFormats = ['json', 'pdf'];
  if (!validFormats.includes(format)) {
    return res.status(400).json({
      success: false,
      message: `Invalid format. Supported: ${validFormats.join(', ')}`,
    });
  }

  const result = await OpeningReportService.exportOpeningReport(parseInt(reportId, 10), format);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="opening-report-${reportId}-${Date.now()}.${format}"`
  );

  res.status(200).json({
    success: true,
    data: result,
    timestamp: new Date().toISOString()
  });
}));

module.exports = router;
