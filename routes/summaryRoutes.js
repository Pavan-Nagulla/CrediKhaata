const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
  getSummary,
  getOverdueLoans
} = require('../controllers/summaryController');

// Get shopkeeper summary
router.get('/', auth, getSummary);

// Get overdue loans
router.get('/overdue', auth, getOverdueLoans);

module.exports = router;