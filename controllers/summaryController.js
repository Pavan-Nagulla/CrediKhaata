const Loan = require('../models/Loan');
const Repayment = require('../models/Repayment');
const { isOverdue } = require('../utils/dateHelpers');

exports.getSummary = async (req, res) => {
  try {
    const loans = await Loan.find({ owner: req.user._id });
    const repayments = await Repayment.find({ owner: req.user._id });
    
    const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalCollected = repayments.reduce((sum, repayment) => sum + repayment.amount, 0);
    
    const overdueLoans = loans.filter(loan => 
      loan.status === 'overdue' || 
      (loan.status !== 'paid' && isOverdue(loan.dueDate))
    );
    
    const overdueAmount = overdueLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
    
    // Calculate average repayment time (in days)
    let avgRepaymentTime = 0;
    if (repayments.length > 0) {
      const totalDays = repayments.reduce((sum, repayment) => {
        const loan = loans.find(l => l._id.equals(repayment.loan));
        return loan ? sum + moment(repayment.paymentDate).diff(moment(loan.issueDate), 'days') : sum;
      }, 0);
      avgRepaymentTime = totalDays / repayments.length;
    }
    
    res.send({
      totalLoaned,
      totalCollected,
      overdueAmount,
      avgRepaymentTime: avgRepaymentTime.toFixed(2),
      overdueLoansCount: overdueLoans.length
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

exports.getOverdueLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ owner: req.user._id })
      .populate('customer', 'name phone address')
      .sort({ dueDate: 1 });
    
    const overdueLoans = loans.filter(loan => 
      loan.status === 'overdue' || 
      (loan.status !== 'paid' && isOverdue(loan.dueDate))
      .map(loan => ({
        ...loan.toObject(),
        customer: loan.customer,
        daysOverdue: moment().diff(moment(loan.dueDate), 'days')
      })));
    
    res.send(overdueLoans);
  } catch (e) {
    res.status(500).send();
  }
};