const Repayment = require('../models/Repayment');
const Loan = require('../models/Loan');
const { generateReceipt } = require('../services/pdfService');

exports.createRepayment = async (req, res) => {
  try {
    const loan = await Loan.findOne({ 
      _id: req.body.loan, 
      owner: req.user._id 
    });
    
    if (!loan) return res.status(404).send({ error: 'Loan not found' });
    
    if (req.body.amount > loan.remainingAmount) {
      return res.status(400).send({ 
        error: `Repayment amount exceeds remaining balance of ${loan.remainingAmount}`
      });
    }
    
    const repayment = new Repayment({
      ...req.body,
      owner: req.user._id
    });
    
    await repayment.save();
    
    // Generate PDF receipt
    const receipt = await generateReceipt(repayment);
    
    res.status(201).send({ repayment, receipt });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.getRepaymentsByLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({ 
      _id: req.params.loanId, 
      owner: req.user._id 
    });
    
    if (!loan) return res.status(404).send({ error: 'Loan not found' });
    
    const repayments = await Repayment.find({ 
      loan: req.params.loanId,
      owner: req.user._id 
    }).sort({ paymentDate: -1 });
    
    res.send(repayments);
  } catch (e) {
    res.status(500).send();
  }
};