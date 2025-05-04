const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const repaymentController = require('../controllers/repaymentController');

router.post('/repayments', auth, repaymentController.createRepayment);
router.get('/loans/:loanId/repayments', auth, repaymentController.getRepaymentsByLoan);

module.exports = router;