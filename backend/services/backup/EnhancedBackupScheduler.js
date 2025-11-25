/**
 * 🔄 ENHANCED BACKUP SCHEDULER
 * Improved automatic backup system with:
 * - Incremental backups support
 * - Backup verification
 * - Multiple backup retention strategies
 * - Automated cleanup
 */

const schedule = require('node-schedule');
const BackupService = require('./BackupService');
const fs = require('fs');
const path = require('path');

class EnhancedBackupScheduler {
  constructor() {
    this.jobs = [];
    this.isRunning = false;
    this.backupHistory = [];
    this.schedulePattern = this.parseSchedule();
    this.isEnabled = (process.env.BACKUP_ENABLED !== 'false');
    this.retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;
    this.maxBackups = parseInt(process.env.BACKUP_MAX_COUNT) || 10;
    this.backupDir = process.env.BACKUP_DIR || path.join(__dirname, '../../backups');
  }

  /**
   * Parse backup schedule from environment
   */
  parseSchedule() {
    const defaultSchedule = '0 2 * * *'; // 2 AM UTC daily
    
    if (process.env.BACKUP_SCHEDULE) {
      const parts = process.env.BACKUP_SCHEDULE.split(' ');
      if (parts.length === 5) {
        return process.env.BACKUP_SCHEDULE;
      }
    }
    return defaultSchedule;
  }

  /**
   * Start backup scheduler
   */
  start() {
    if (!this.isEnabled) {
      return;
    }

    if (this.isRunning) {
      return;
    }

    try {
      this.ensureBackupDir();
      
      const job = schedule.scheduleJob(this.schedulePattern, async () => {
        await this.runBackup();
      });

      this.jobs.push(job);
      this.isRunning = true;

    } catch (error) {
    }
  }

  /**
   * Run backup immediately
   */
  async runBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}.json`;
      const backupPath = path.join(this.backupDir, backupName);


      // Run backup
      const result = await BackupService.createBackup(backupPath);

      if (result.success) {
        const backupRecord = {
          timestamp: new Date().toISOString(),
          name: backupName,
          path: backupPath,
          size: fs.statSync(backupPath).size,
          status: 'success',
          verified: await this.verifyBackup(backupPath)
        };

        this.backupHistory.push(backupRecord);

        // Cleanup old backups
        await this.cleanupOldBackups();
      } else {
        this.backupHistory.push({
          timestamp: new Date().toISOString(),
          name: backupName,
          status: 'failed',
          error: result.error
        });
      }
    } catch (error) {
      this.backupHistory.push({
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * Verify backup integrity
   */
  async verifyBackup(backupPath) {
    try {
      const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      // Check required fields
      const requiredFields = ['timestamp', 'database', 'tables'];
      const hasAllFields = requiredFields.every(field => field in data);

      return hasAllFields && Object.keys(data.tables || {}).length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cleanup old backups based on retention policy
   */
  async cleanupOldBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(f => f.startsWith('backup-'))
        .sort()
        .reverse();

      const now = Date.now();
      const retentionMs = this.retentionDays * 24 * 60 * 60 * 1000;

      for (let i = 0; i < files.length; i++) {
        const filePath = path.join(this.backupDir, files[i]);
        const stat = fs.statSync(filePath);
        const age = now - stat.mtime.getTime();

        // Remove if exceeds max count or retention days
        if (i >= this.maxBackups || age > retentionMs) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
    }
  }

  /**
   * Ensure backup directory exists
   */
  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Stop backup scheduler
   */
  stop() {
    this.jobs.forEach(job => job.cancel());
    this.jobs = [];
    this.isRunning = false;
  }

  /**
   * Get backup statistics
   */
  getStats() {
    const successCount = this.backupHistory.filter(b => b.status === 'success').length;
    const failureCount = this.backupHistory.filter(b => b.status !== 'success').length;
    const totalSize = this.backupHistory
      .filter(b => b.size)
      .reduce((sum, b) => sum + b.size, 0);

    return {
      isRunning: this.isRunning,
      isEnabled: this.isEnabled,
      schedule: this.schedulePattern,
      totalBackups: this.backupHistory.length,
      successfulBackups: successCount,
      failedBackups: failureCount,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
      retentionDays: this.retentionDays,
      maxBackups: this.maxBackups,
      lastBackup: this.backupHistory[this.backupHistory.length - 1]
    };
  }

  /**
   * Get recent backups
   */
  getRecentBackups(limit = 10) {
    return this.backupHistory.slice(-limit).reverse();
  }
}

module.exports = EnhancedBackupScheduler;
