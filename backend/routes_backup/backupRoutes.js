/**
 * 🔄 BACKUP MANAGEMENT API
 * Endpoints for managing database backups
 */

const express = require('express');
const router = express.Router();
const BackupService = require('../services/backup/BackupService');
const { verifyToken } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandlingMiddleware');

// Verify super admin role
const verifySuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ error: 'Only super admins can access backups' });
  }
};

/**
 * GET /api/backups/list
 * List all available backups
 */
router.get(
  '/list',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const result = BackupService.listBackups();
    res.status(result.success ? 200 : 400).json(result);
  })
);

/**
 * GET /api/backups/stats
 * Get backup statistics
 */
router.get(
  '/stats',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const result = BackupService.getBackupStats();
    res.status(result.success ? 200 : 400).json(result);
  })
);

/**
 * GET /api/backups/scheduler/status
 * Get backup scheduler status
 */
router.get(
  '/scheduler/status',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const BackupScheduler = require('../services/backup/BackupScheduler');
    const status = BackupScheduler.getStatus();
    res.status(200).json({
      success: true,
      scheduler: status,
    });
  })
);

/**
 * POST /api/backups/create
 * Create manual backup
 */
router.post(
  '/create',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const result = await BackupService.createBackup();
    res.status(result.success ? 200 : 400).json(result);
  })
);

/**
 * POST /api/backups/verify/:filename
 * Verify backup file integrity
 */
router.post(
  '/verify/:filename',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const result = await BackupService.verifyBackup(filename);
    res.status(result.success ? 200 : 400).json(result);
  })
);

/**
 * GET /api/backups/download/:filename
 * Download backup file
 */
router.get(
  '/download/:filename',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const { filename } = req.params;

    try {
      const filepath = BackupService.getBackupPath(filename);
      res.download(filepath, filename);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

/**
 * POST /api/backups/restore/:filename
 * Restore database from backup
 * WARNING: This will overwrite current database!
 * Requires explicit confirmation flag
 */
router.post(
  '/restore/:filename',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const { confirm } = req.body;

    // Require explicit confirmation
    if (confirm !== true) {
      return res.status(400).json({
        error: 'Restore requires explicit confirmation',
        warning: 'This operation will overwrite the current database',
        example: { confirm: true },
      });
    }

    const result = await BackupService.restoreBackup(filename);
    res.status(result.success ? 200 : 400).json(result);
  })
);

/**
 * DELETE /api/backups/:filename
 * Delete backup file
 */
router.delete(
  '/:filename',
  verifyToken,
  verifySuperAdmin,
  asyncHandler(async (req, res) => {
    const { filename } = req.params;

    try {
      const fs = require('fs');
      const path = require('path');
      const BACKUP_DIR = path.join(__dirname, '../backups');
      const filepath = path.join(BACKUP_DIR, filename);

      // Security: Prevent directory traversal
      if (!filepath.startsWith(BACKUP_DIR)) {
        return res.status(400).json({ error: 'Invalid backup filename' });
      }

      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Backup not found' });
      }

      fs.unlinkSync(filepath);

      res.json({
        success: true,
        message: 'Backup deleted',
        filename,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
);

module.exports = router;
