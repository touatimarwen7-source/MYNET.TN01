/**
 * Backup Scheduler
 * Automatically runs database backups on a configurable cron schedule
 * Environment variables: BACKUP_SCHEDULE, BACKUP_ENABLED
 */

const schedule = require('node-schedule');
const BackupService = require('./BackupService');

class BackupScheduler {
  /**
   * Initialize backup scheduler with configuration from environment
   * @constructor
   */
  constructor() {
    this.jobs = [];
    this.isRunning = false;
    this.schedulePattern = this.parseSchedule();
    this.isEnabled = process.env.BACKUP_ENABLED !== 'false';
  }

  /**
   * Parse backup schedule from BACKUP_SCHEDULE environment variable
   * Validates cron pattern and falls back to default if invalid
   * Format: "minute hour day month dayOfWeek" (e.g., "0 2 * * *" = 2 AM daily)
   * @private
   * @returns {string} Valid cron pattern (5 fields)
   */
  parseSchedule() {
    const defaultSchedule = '0 2 * * *'; // 2 AM UTC daily

    if (process.env.BACKUP_SCHEDULE) {
      // Validate cron pattern (basic validation - 5 fields)
      const parts = process.env.BACKUP_SCHEDULE.split(' ');
      if (parts.length === 5) {
        return process.env.BACKUP_SCHEDULE;
      }
    }

    return defaultSchedule;
  }

  /**
   * Convert cron pattern to human-readable schedule description
   * Supports common cron patterns with English descriptions
   * @private
   * @returns {string} Human-readable schedule description
   */
  getScheduleDescription() {
    const patterns = {
      '0 2 * * *': 'Daily at 2:00 AM UTC',
      '0 0 * * *': 'Daily at 12:00 AM UTC (midnight)',
      '0 12 * * *': 'Daily at 12:00 PM UTC (noon)',
      '0 */6 * * *': 'Every 6 hours (0, 6, 12, 18)',
      '0 */12 * * *': 'Every 12 hours (0, 12)',
      '0 3 * * 0': 'Weekly on Sunday at 3:00 AM UTC',
      '0 3 * * 1': 'Weekly on Monday at 3:00 AM UTC',
    };
    return patterns[this.schedulePattern] || this.schedulePattern;
  }

  /**
   * Start scheduled backup jobs
   * Schedules backup to run at configured interval
   * Does nothing if backups are disabled via BACKUP_ENABLED=false
   * @returns {void}
   */
  start() {
    try {
      if (!this.isEnabled) {
        return;
      }

      // Schedule backup
      const backupJob = schedule.scheduleJob(this.schedulePattern, async () => {
        await this.performBackup();
      });

      this.jobs.push(backupJob);
      this.isRunning = true;
    } catch (error) {
      // Silently fail scheduler startup
    }
  }

  /**
   * Perform immediate backup operation
   * Called by scheduled job trigger
   * @async
   * @private
   * @returns {Promise<Object>} Backup operation result
   */
  async performBackup() {
    try {
      const result = await BackupService.createBackup();

      if (result.success) {
        // Backup successful
      } else {
        // Backup failed
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop all scheduled backup jobs
   * Cancels all active scheduler jobs and clears job list
   * @returns {void}
   */
  stop() {
    this.jobs.forEach((job) => job.cancel());
    this.jobs = [];
    this.isRunning = false;
  }

  /**
   * Get current scheduler status and configuration
   * @returns {Object} Scheduler status information
   * @returns {boolean} .isRunning - Whether scheduler is currently running
   * @returns {boolean} .isEnabled - Whether backups are enabled (config)
   * @returns {number} .jobsCount - Number of active scheduled jobs
   * @returns {Date} .nextBackup - Next scheduled backup timestamp
   * @returns {string} .schedule - Human-readable schedule description
   * @returns {string} .pattern - Cron pattern being used
   * @returns {number} .maxBackupsRetained - Maximum backup retention count
   * @returns {boolean} .configurable - Whether backup schedule is configurable
   * @returns {Object} .environmentVariables - Configuration environment variables
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      isEnabled: this.isEnabled,
      jobsCount: this.jobs.length,
      nextBackup: this.jobs.length > 0 ? this.jobs[0].nextInvocation() : null,
      schedule: this.getScheduleDescription(),
      pattern: this.schedulePattern,
      maxBackupsRetained: 30,
      configurable: true,
      environmentVariables: {
        BACKUP_SCHEDULE: 'Cron pattern (e.g., "0 2 * * *")',
        BACKUP_ENABLED: 'Set to "false" to disable backups',
      },
    };
  }
}

module.exports = new BackupScheduler();
