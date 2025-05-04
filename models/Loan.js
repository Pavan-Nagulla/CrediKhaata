const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  remainingAmount: {
    type: Number,
    required: true,
    min: 0
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  frequency: {
    type: String,
    required: true,
    enum: ['bi-weekly', 'monthly']
  },
  interestRate: {
    type: Number,
    default: 0,
    min: 0
  },
  graceDays: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

loanSchema.pre('save', function(next) {
  if (this.isNew) {
    this.remainingAmount = this.amount;
  }
  next();
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;