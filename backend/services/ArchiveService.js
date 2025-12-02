const { getPool } = require('../config/db');
const crypto = require('crypto');
const AuditLogService = require('./AuditLogService');

class ArchiveService {
  /**
   * Archive a document with AES-256-GCM encryption
   * Sets expiration date based on retention years
   * @async
   * @param {string} docType - Type of document (tender, offer, invoice, etc)
   * @param {string} docId - ID of document to archive
   * @param {Object} docData - Document data to encrypt and archive
   * @param {number} [retention_years=7] - Years to retain document (default 7)
   * @returns {Promise<Object>} Created archive record
   * @throws {Error} When archiving fails
   */
  static async archiveDocument(docType, docId, docData, retention_years = 7) {
    const pool = getPool();
    try {
      const encryptedData = this.encryptArchiveData(JSON.stringify(docData));
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + retention_years);
      const archiveId = `ARC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const result = await pool.query(
        `INSERT INTO document_archives 
         (archive_id, document_type, document_ref_id, encrypted_data, retention_years, expiration_date, archived_at, status)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)
         RETURNING *`,
        [archiveId, docType, docId, encryptedData, retention_years, expirationDate, 'active']
      );

      await AuditLogService.log(
        null,
        'document_archived',
        docId,
        'archive',
        `${docType} archived for ${retention_years} years`
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieve and decrypt an archived document
   * @async
   * @param {string} archiveId - ID of archive to retrieve
   * @returns {Promise<Object>} Archive record with decrypted data
   * @throws {Error} When archive not found or decryption fails
   */
  static async retrieveArchiveDocument(archiveId) {
    const pool = getPool();
    try {
      const result = await pool.query(
        'SELECT * FROM document_archives WHERE archive_id = $1 AND status = $2',
        [archiveId, 'active']
      );

      if (result.rows.length === 0) {
        throw new Error('Archive not found or expired');
      }

      const archive = result.rows[0];
      const decryptedData = this.decryptArchiveData(archive.encrypted_data);

      return {
        ...archive,
        data: JSON.parse(decryptedData),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all active archives for a tender
   * @async
   * @param {string} tenderId - ID of tender
   * @returns {Promise<Array>} Array of archive records (metadata only)
   * @throws {Error} When database query fails
   */
  static async getArchivesByTender(tenderId) {
    const pool = getPool();
    try {
      const result = await pool.query(
        `SELECT archive_id, document_type, archived_at, retention_years, expiration_date, status
         FROM document_archives
         WHERE document_ref_id = $1 AND status = 'active'
         ORDER BY archived_at DESC`,
        [tenderId]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Encrypt data using AES-256-GCM algorithm
   * @private
   * @param {string} data - Data to encrypt
   * @returns {string} JSON-stringified object with iv, authTag, and encrypted data
   */
  static encryptArchiveData(data) {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(
      process.env.ARCHIVE_KEY || 'default-archive-key-2025',
      'salt',
      32
    );
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return JSON.stringify({
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted,
    });
  }

  /**
   * Decrypt data using AES-256-GCM algorithm
   * @private
   * @param {string} encryptedData - JSON-stringified encrypted object
   * @returns {string} Decrypted data
   * @throws {Error} When decryption fails (authentication error)
   */
  static decryptArchiveData(encryptedData) {
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(
      process.env.ARCHIVE_KEY || 'default-archive-key-2025',
      'salt',
      32
    );
    const parsed = JSON.parse(encryptedData);

    const iv = Buffer.from(parsed.iv, 'hex');
    const authTag = Buffer.from(parsed.authTag, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(parsed.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

module.exports = ArchiveService;
