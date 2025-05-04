const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotifications,
  sendManualReminder
} = require('../controllers/notificationController');

// Get all notifications
router.get('/', auth, getNotifications);

// Send manual reminder for a loan
router.post('/reminder/:loanId', auth, sendManualReminder);

module.exports = router;