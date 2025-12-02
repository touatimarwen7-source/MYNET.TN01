const { getPool } = require('../config/db');
const Invoice = require('../models/Invoice');
const DataMapper = require('../helpers/DataMapper');
const {
  validateSchema,
  createInvoiceSchema,
  markInvoiceAsPaidSchema,
} = require('../utils/validationSchemas');
const { logger } = require('../utils/logger');

class InvoiceService {
  /**
   * Creates a new invoice for a purchase order
   * Verifies PO ownership, generates unique invoice number, handles transaction
   * @async
   * @param {Object} invoiceData - Invoice details (po_id, supplier_id, amount, tax, dates)
   * @returns {Promise<Object>} Created invoice object
   * @throws {Error} If PO not found, unauthorized, or database operation fails
   */
  async createInvoice(invoiceData) {
    // Validate input data type
    const validatedData = validateSchema(invoiceData, createInvoiceSchema);

    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verify purchase order exists and belongs to supplier
      const poCheck = await client.query(
        'SELECT * FROM purchase_orders WHERE id = $1 AND supplier_id = $2',
        [validatedData.po_id, validatedData.supplier_id]
      );

      if (poCheck.rows.length === 0) {
        throw new Error('Purchase order not found or unauthorized');
      }

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Map frontend data to database schema
      const mappedData = DataMapper.mapInvoice(invoiceData);
      const invoice = new Invoice({
        ...mappedData,
        invoice_number: invoiceNumber,
        total: parseFloat(mappedData.amount) + parseFloat(mappedData.tax || 0),
      });

      const result = await client.query(
        `INSERT INTO invoices 
        (id, purchase_order_id, supplier_id, invoice_number, amount, tax, total, 
         issue_date, due_date, status, notes) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *`,
        [
          invoice.id,
          validatedData.po_id,
          validatedData.supplier_id,
          invoice.invoice_number,
          validatedData.amount,
          validatedData.tax || 0,
          invoice.total,
          validatedData.invoice_date,
          validatedData.due_date,
          invoice.status,
          invoice.notes,
        ]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Retrieves all invoices for a supplier with associated purchase order details
   * @async
   * @param {string} supplierId - The ID of the supplier
   * @returns {Promise<Array>} Array of invoice objects ordered by creation date DESC
   * @throws {Error} If database query fails
   */
  async getInvoicesBySupplier(supplierId) {
    const pool = getPool();
    const result = await pool.query(
      `SELECT i.*, po.order_number, po.buyer_id 
       FROM invoices i 
       JOIN purchase_orders po ON i.purchase_order_id = po.id 
       WHERE i.supplier_id = $1 
       ORDER BY i.created_at DESC`,
      [supplierId]
    );
    return result.rows;
  }

  /**
   * Marks an invoice as paid with payment date
   * Updates status to 'paid' and records payment timestamp
   * @async
   * @param {Object} paymentData - Payment data (invoice_id, payment_date)
   * @returns {Promise<Object>} Updated invoice object with status='paid'
   * @throws {Error} If validation fails or database operation fails
   */
  async markAsPaid(paymentData) {
    // Validate input data type
    const validatedData = validateSchema(paymentData, markInvoiceAsPaidSchema);

    const pool = getPool();
    const result = await pool.query(
      `UPDATE invoices 
       SET status = 'paid', payment_date = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [validatedData.payment_date, validatedData.invoice_id]
    );
    return result.rows[0];
  }
}

module.exports = new InvoiceService();
