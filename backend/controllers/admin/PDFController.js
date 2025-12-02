const PDFService = require('../../services/PDFService');

class PDFController {
  async generateTenderPDF(req, res) {
    try {
      const { tender_id } = req.params;

      if (!tender_id) {
        return res.status(400).json({ error: 'tender_id is required' });
      }

      const pdf = await PDFService.generateTenderDocument(tender_id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="tender_${tender_id}.pdf"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      pdf.pipe(res);
      pdf.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateOfferReport(req, res) {
    try {
      const { offer_id } = req.params;

      if (!offer_id) {
        return res.status(400).json({ error: 'offer_id is required' });
      }

      const pdf = await PDFService.generateOfferEvaluationReport(offer_id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="offer_report_${offer_id}.pdf"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      pdf.pipe(res);
      pdf.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateAwardCertificate(req, res) {
    try {
      const { tender_id, supplier_id } = req.params;

      if (!tender_id || !supplier_id) {
        return res.status(400).json({ error: 'tender_id and supplier_id are required' });
      }

      const pdf = await PDFService.generateAwardCertificate(tender_id, supplier_id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="award_certificate_${tender_id}_${supplier_id}.pdf"`
      );
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      pdf.pipe(res);
      pdf.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async generateTransactionReport(req, res) {
    try {
      const { supplier_id } = req.params;
      const { start_date, end_date } = req.query;

      if (!supplier_id || !start_date || !end_date) {
        return res
          .status(400)
          .json({ error: 'supplier_id, start_date, and end_date are required' });
      }

      const pdf = await PDFService.generateTransactionReport(supplier_id, start_date, end_date);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="transactions_${supplier_id}.pdf"`
      );
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      pdf.pipe(res);
      pdf.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PDFController();
