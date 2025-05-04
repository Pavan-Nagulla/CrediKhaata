const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan
} = require('../controllers/loanController');

// Apply auth middleware to all routes
router.use(auth);

// Loan CRUD routes
router.post('/', createLoan);
router.get('/', getLoans);
router.get('/:id', getLoanById);       // Must match exported function
router.patch('/:id', updateLoan);
router.delete('/:id', deleteLoan);

module.exports = router;
