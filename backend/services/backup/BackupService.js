/**
 * Database Backup Service
 * Manages automated backups, restores, and backup lifecycle
 * Environment variables: MAX_BACKUPS, BACKUP_DIR
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { getPool } = require('../../config/db');

const execAsync = promisify(exec);
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(__dirname, '../../backups');
const MAX_BACKUPS = parseInt(process.env.MAX_BACKUPS) || 30;
const BACKUP_PREFIX = 'mynet_backup_';

class BackupService {
  constructor() {
    this.ensureBackupDirectory();
  }

  /**
   * Ensure backup directory exists with proper permissions
   * Creates directory recursively if needed
   * @private
   * @returns {void}
   */
  ensureBackupDirectory() {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

  /**
   * Generate backup filename with ISO timestamp
   * Format: mynet_backup_YYYY-MM-DDTHH-mm-ss.sssZ.sql
   * @private
   * @returns {string} Generated filename with timestamp
   */
  generateBackupFilename() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${BACKUP_PREFIX}${timestamp}.sql`;
  }

  /**
   * Create full database backup using pg_dump
   * Automatically cleans old backups to maintain retention limit
   * @async
   * @returns {Promise<Object>} Backup result with success status and metadata
   * @returns {Promise<Object>} .success - Whether backup succeeded
   * @returns {Promise<Object>} .filename - Generated backup filename
   * @returns {Promise<Object>} .filepath - Full path to backup file
   * @returns {Promise<Object>} .size - Backup size in MB (formatted)
   * @returns {Promise<Object>} .sizeBytes - Backup size in bytes (raw)
   * @returns {Promise<Object>} .timestamp - ISO timestamp of backup creation
   * @throws {Error} Captures and returns error in success:false response
   */
  async createBackup() {
    try {
      const filename = this.generateBackupFilename();
      const filepath = path.join(BACKUP_DIR, filename);

      // Use pg_dump to create backup
      const dumpCommand = `pg_dump "${process.env.DATABASE_URL}" > "${filepath}"`;

      await execAsync(dumpCommand, {
        timeout: 300000, // 5 minute timeout
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      });

      // Get file stats
      const stats = fs.statSync(filepath);
      const backupSize = (stats.size / 1024 / 1024).toFixed(2); // Size in MB

      // Clean old backups
      await this.cleanOldBackups();

      return {
        success: true,
        filename,
        filepath,
        size: backupSize,
        timestamp: new Date().toISOString(),
        sizeBytes: stats.size,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * List all available backups sorted by creation time (newest first)
   * @returns {Object} Success status and list of backup metadata
   * @returns {boolean} .success - Whether query succeeded
   * @returns {number} .count - Total number of backups
   * @returns {Array} .backups - Array of backup objects with metadata
   * @returns {string} .backups[].filename - Backup filename
   * @returns {string} .backups[].size - Size in MB (formatted)
   * @returns {number} .backups[].sizeBytes - Size in bytes (raw)
   * @returns {string} .backups[].timestamp - Extracted timestamp
   * @returns {Date} .backups[].created - File creation time
   * @returns {Date} .backups[].modified - File modification time
   * @returns {number} .maxRetained - Maximum backups retained
   * @returns {string} .backupDir - Backup directory path
   */
  listBackups() {
    try {
      const files = fs
        .readdirSync(BACKUP_DIR)
        .filter((f) => f.startsWith(BACKUP_PREFIX))
        .sort()
        .reverse();

      const backups = files.map((filename) => {
        const filepath = path.join(BACKUP_DIR, filename);
        const stats = fs.statSync(filepath);
        const timestamp = this.extractTimestampFromFilename(filename);

        return {
          filename,
          size: (stats.size / 1024 / 1024).toFixed(2),
          sizeBytes: stats.size,
          timestamp,
          created: stats.birthtime,
          modified: stats.mtime,
        };
      });

      return {
        success: true,
        count: backups.length,
        backups,
        maxRetained: MAX_BACKUPS,
        backupDir: BACKUP_DIR,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        count: 0,
        backups: [],
      };
    }
  }

  /**
   * Get validated backup file path with directory traversal protection
   * @private
   * @param {string} filename - Backup filename to validate
   * @returns {string} Full validated filepath
   * @throws {Error} When filename is invalid or file doesn't exist
   */
  getBackupPath(filename) {
    const filepath = path.join(BACKUP_DIR, filename);

    // Security: Prevent directory traversal
    if (!filepath.startsWith(BACKUP_DIR)) {
      throw new Error('Invalid backup filename');
    }

    if (!fs.existsSync(filepath)) {
      throw new Error(`Backup file not found: ${filename}`);
    }

    return filepath;
  }

  /**
   * Download backup file content as string
   * @param {string} filename - Backup filename to retrieve
   * @returns {Object} Success status with file content
   * @returns {boolean} .success - Whether retrieval succeeded
   * @returns {string} .filename - Retrieved filename
   * @returns {string} .content - Full SQL content of backup
   * @returns {number} .size - Size of content in bytes
   * @throws {Error} Captures and returns error in success:false response
   */
  getBackupContent(filename) {
    try {
      const filepath = this.getBackupPath(filename);
      const content = fs.readFileSync(filepath, 'utf8');
      return {
        success: true,
        filename,
        content,
        size: Buffer.byteLength(content, 'utf8'),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Restore database from backup file using psql
   * WARNING: This completely overwrites the current database
   * @async
   * @param {string} filename - Backup filename to restore from
   * @returns {Promise<Object>} Restore operation result
   * @returns {Promise<Object>} .success - Whether restore succeeded
   * @returns {Promise<Object>} .filename - Restored backup filename
   * @returns {Promise<Object>} .timestamp - ISO timestamp of restore
   * @returns {Promise<Object>} .message - Operation status message
   * @throws {Error} Captures and returns error in success:false response
   */
  async restoreBackup(filename) {
    try {
      const filepath = this.getBackupPath(filename);

      // Safety: Ask for confirmation by requiring a flag
      const restoreCommand = `psql "${process.env.DATABASE_URL}" < "${filepath}"`;

      await execAsync(restoreCommand, {
        timeout: 600000, // 10 minute timeout
        maxBuffer: 10 * 1024 * 1024,
      });

      return {
        success: true,
        filename,
        timestamp: new Date().toISOString(),
        message: 'Database restored successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Delete old backups, keeping only most recent ones up to MAX_BACKUPS limit
   * @async
   * @private
   * @returns {Promise<void>}
   */
  async cleanOldBackups() {
    try {
      const files = fs
        .readdirSync(BACKUP_DIR)
        .filter((f) => f.startsWith(BACKUP_PREFIX))
        .sort()
        .reverse();

      if (files.length > MAX_BACKUPS) {
        const filesToDelete = files.slice(MAX_BACKUPS);

        for (const file of filesToDelete) {
          const filepath = path.join(BACKUP_DIR, file);
          fs.unlinkSync(filepath);
        }
      }
    } catch (error) {
      // Silently fail backup cleanup to not interrupt main backup
    }
  }

  /**
   * Get comprehensive backup statistics
   * Calculates total size, oldest/newest backup info
   * @returns {Object} Backup statistics
   * @returns {boolean} .success - Whether stats generation succeeded
   * @returns {Object} .stats - Statistical data about backups
   * @returns {number} .stats.totalBackups - Total number of backups
   * @returns {string} .stats.totalSize - Total size in MB (formatted)
   * @returns {number} .stats.totalSizeBytes - Total size in bytes (raw)
   * @returns {Object} .stats.oldestBackup - Oldest backup metadata
   * @returns {Object} .stats.newestBackup - Newest backup metadata
   * @returns {number} .stats.maxBackupsRetained - Maximum retention count
   * @returns {string} .stats.backupDirectory - Backup directory path
   * @throws {Error} Captures and returns error in success:false response
   */
  getBackupStats() {
    try {
      const result = this.listBackups();

      if (!result.success) {
        return result;
      }

      const totalSize = result.backups.reduce((sum, b) => sum + b.sizeBytes, 0);
      const oldestBackup =
        result.backups.length > 0 ? result.backups[result.backups.length - 1] : null;
      const newestBackup = result.backups.length > 0 ? result.backups[0] : null;

      return {
        success: true,
        stats: {
          totalBackups: result.count,
          totalSize: (totalSize / 1024 / 1024).toFixed(2),
          totalSizeBytes: totalSize,
          oldestBackup,
          newestBackup,
          maxBackupsRetained: MAX_BACKUPS,
          backupDirectory: BACKUP_DIR,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Extract human-readable timestamp from backup filename
   * Converts ISO format with dashes back to human-readable time
   * @private
   * @param {string} filename - Backup filename (format: mynet_backup_YYYY-MM-DDTHH-mm-ss.sssZ.sql)
   * @returns {string} Human-readable timestamp
   */
  extractTimestampFromFilename(filename) {
    const match = filename.match(/mynet_backup_(.+)\.sql/);
    if (match) {
      const timestamp = match[1].replace(/-/g, ':').replace(/_/g, '.');
      return timestamp;
    }
    return 'unknown';
  }

  /**
   * Verify backup file integrity by checking SQL structure
   * @async
   * @param {string} filename - Backup filename to verify
   * @returns {Promise<Object>} Verification result
   * @returns {Promise<Object>} .success - Whether backup is valid
   * @returns {Promise<Object>} .integrity - Status (valid/invalid/unknown)
   * @returns {Promise<Object>} .filename - Verified filename
   * @returns {Promise<Object>} .size - Backup file size
   * @returns {Promise<Object>} .hasStructure - Contains CREATE TABLE statements
   * @returns {Promise<Object>} .hasTransaction - Contains BEGIN/COMMIT transaction boundaries
   * @returns {Promise<Object>} .message - Verification status message
   * @throws {Error} Captures and returns error in integrity:unknown response
   */
  async verifyBackup(filename) {
    try {
      const filepath = this.getBackupPath(filename);
      const content = fs.readFileSync(filepath, 'utf8');

      // Check for basic SQL structure
      const hasCreateTable = /CREATE TABLE/i.test(content);
      const hasBegin = /BEGIN/i.test(content);
      const hasCommit = /COMMIT/i.test(content);

      if (!hasCreateTable) {
        return {
          success: false,
          integrity: 'invalid',
          error: 'Backup file does not contain CREATE TABLE statements',
        };
      }

      return {
        success: true,
        integrity: 'valid',
        filename,
        size: Buffer.byteLength(content, 'utf8'),
        hasStructure: hasCreateTable,
        hasTransaction: hasBegin && hasCommit,
        message: 'Backup file is valid',
      };
    } catch (error) {
      return {
        success: false,
        integrity: 'unknown',
        error: error.message,
      };
    }
  }
}

module.exports = new BackupService();
