const cron = require('node-cron');
const { sendOverdueReminders } = require('../controllers/libraryController');

/**
 * Schedule library email reminders
 * Runs daily at 9:00 AM
 */
const scheduleLibraryReminders = () => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[Cron] Running library email reminders...');
    try {
      const result = await sendOverdueReminders();
      console.log('[Cron] Library reminders sent:', result);
    } catch (error) {
      console.error('[Cron] Error sending library reminders:', error);
    }
  });

  console.log('✓ Library email reminders scheduled (daily at 9:00 AM)');
};

module.exports = {
  scheduleLibraryReminders,
};
