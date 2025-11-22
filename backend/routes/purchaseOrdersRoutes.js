const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create PO from offer - ISSUE FIX #3: Add input validation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { offer_id, notes } = req.body;
    
    // ISSUE FIX #3: Validation
    if (!offer_id) {
      return res.status(400).json({ error: 'offer_id is required' });
    }
    if (notes && notes.length > 2000) {
      return res.status(400).json({ error: 'notes too long (max 2000 chars)' });
    }
    
    const db = req.app.get('db');

    // Get offer details
    const offerResult = await db.query(
      'SELECT * FROM offers WHERE id = $1',
      [offer_id]
    );

    if (offerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    const offer = offerResult.rows[0];

    const result = await db.query(`
      INSERT INTO purchase_orders (
        buyer_id, supplier_id, tender_id, offer_id, po_number, 
        total_amount, status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      offer.buyer_id,
      offer.supplier_id,
      offer.tender_id,
      offer_id,
      `PO-${Date.now()}`,
      offer.total_amount,
      'pending',
      notes || null
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my POs (buyer or supplier)
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const db = req.app.get('db');

    let query = `
      SELECT * FROM purchase_orders 
      WHERE buyer_id = $1 OR supplier_id = $1
    `;
    const params = [req.user.id];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get PO details
router.get('/:poId', authMiddleware, async (req, res) => {
  try {
    const { poId } = req.params;
    const db = req.app.get('db');

    const result = await db.query(
      'SELECT * FROM purchase_orders WHERE id = $1',
      [poId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'PO not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update PO status - ISSUE FIX #2 #3: Add authorization + validation
router.put('/:poId/status', authMiddleware, async (req, res) => {
  try {
    const { poId } = req.params;
    const { status } = req.body;
    
    // ISSUE FIX #3: Validation
    if (!status || !['pending', 'confirmed', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const db = req.app.get('db');

    // ISSUE FIX #2: Authorization check
    const poResult = await db.query(
      'SELECT * FROM purchase_orders WHERE id = $1',
      [poId]
    );
    if (poResult.rows.length === 0) {
      return res.status(404).json({ error: 'PO not found' });
    }
    const po = poResult.rows[0];
    if (po.buyer_id !== req.user.id && po.supplier_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await db.query(`
      UPDATE purchase_orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, poId]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete PO - ISSUE FIX #2 #5: Add authorization + soft delete
router.delete('/:poId', authMiddleware, async (req, res) => {
  try {
    const { poId } = req.params;
    const db = req.app.get('db');

    // ISSUE FIX #2: Authorization - only buyer or admin can delete
    const poResult = await db.query(
      'SELECT * FROM purchase_orders WHERE id = $1',
      [poId]
    );
    if (poResult.rows.length === 0) {
      return res.status(404).json({ error: 'PO not found' });
    }
    const po = poResult.rows[0];
    if (po.buyer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized - only buyer or admin can delete' });
    }

    // ISSUE FIX #5: Soft delete instead of hard delete
    await db.query('UPDATE purchase_orders SET is_deleted = true WHERE id = $1', [poId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
