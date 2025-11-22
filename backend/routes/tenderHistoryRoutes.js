const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get tender history - ISSUE FIX #1: Add authentication
router.get('/tender/:tenderId', authMiddleware, async (req, res) => {
  try {
    const { tenderId } = req.params;
    const db = req.app.get('db');

    const result = await db.query(`
      SELECT * FROM tender_history 
      WHERE tender_id = $1 
      ORDER BY changed_at DESC
    `, [tenderId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log tender change (internal)
const logTenderChange = async (db, tenderId, changeType, changedBy, details = {}) => {
  try {
    await db.query(`
      INSERT INTO tender_history (tender_id, change_type, changed_by, details)
      VALUES ($1, $2, $3, $4)
    `, [tenderId, changeType, changedBy, JSON.stringify(details)]);
  } catch (error) {
    console.error('Error logging tender history:', error);
  }
};

router.logTenderChange = logTenderChange;

module.exports = router;
