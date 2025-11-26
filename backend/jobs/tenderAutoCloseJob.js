const schedule = require('node-schedule');
const { getPool } = require('../config/db');
const OpeningReportService = require('../services/OpeningReportService');

/**
 * Tender Auto-Close Job
 * Automatically closes expired tenders and generates opening reports
 */
class TenderAutoCloseJob {
  static async runAutoCloseJob() {
    const startTime = Date.now();
    
    let closedCount = 0;
    let errorCount = 0;

    try {
      const pool = getPool();
      const result = await pool.query(
        `SELECT id, tender_number, title, deadline, buyer_id 
         FROM tenders 
         WHERE status = 'published' 
         AND deadline < NOW() 
         AND is_deleted = FALSE 
         ORDER BY deadline ASC
         LIMIT 100`
      );

      if (!result || !result.rows || result.rows.length === 0) {
        return;
      }


      for (const tender of result.rows) {
        if (!tender || !tender.id) {
          continue;
        }

        try {
          const pool = getPool();
          const offersResult = await pool.query(
            `SELECT * FROM offers 
             WHERE tender_id = $1 
             AND status IN ('submitted', 'received')
             AND is_deleted = FALSE`,
            [tender.id]
          );

          const offers = (offersResult && offersResult.rows) || [];

          await OpeningReportService.createOpeningReport(
            tender.id,
            offers,
            tender.buyer_id
          );

          await pool.query(
            `UPDATE tenders 
             SET status = 'closed', updated_at = NOW() 
             WHERE id = $1`,
            [tender.id]
          );

          closedCount++;
        } catch (error) {
          errorCount++;
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    } catch (error) {
    }
  }

  /**
   * Schedule the auto-close job to run every 60 seconds
   * @returns {Object} Scheduled job object
   */
  static scheduleJob() {
    
    try {
      const job = schedule.scheduleJob('*/1 * * * *', async () => {
        await this.runAutoCloseJob();
      });
      
      return job;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TenderAutoCloseJob;
