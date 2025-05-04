const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  loan: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Loan'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

repaymentSchema.post('save', async function(doc) {
  const Loan = require('./Loan');
  const loan = await Loan.findById(doc.loan);
  
  if (loan) {
    loan.remainingAmount -= doc.amount;
    if (loan.remainingAmount <= 0) {
      loan.status = 'paid';
    }
    await loan.save();
  }
});

const Repayment = mongoose.model('Repayment', repaymentSchema);
module.exports = Repayment;