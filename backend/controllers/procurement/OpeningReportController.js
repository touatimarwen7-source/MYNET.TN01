const OpeningReportService = require('../../services/OpeningReportService');

async function getOpeningReport(req, res) {
  try {
    const { tenderId } = req.params;
    const report = await OpeningReportService.getOpeningReportByTenderId(tenderId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Opening report not found' });
    }
    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getBuyerOpeningReports(req, res) {
  try {
    const reports = await OpeningReportService.getOpeningReportsByBuyer(req.user.id);
    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function exportOpeningReport(req, res) {
  try {
    const { reportId } = req.params;
    const { format = 'json' } = req.query;
    const result = await OpeningReportService.exportOpeningReport(reportId, format);
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="opening-report-${reportId}.pdf"`);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="opening-report-${reportId}.json"`
      );
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = { getOpeningReport, getBuyerOpeningReports, exportOpeningReport };
