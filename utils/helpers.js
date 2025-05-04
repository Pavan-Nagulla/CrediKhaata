const moment = require('moment');

const calculateDueDate = (issueDate, frequency, graceDays = 0) => {
  let dueDate;
  if (frequency === 'bi-weekly') {
    dueDate = moment(issueDate).add(2, 'weeks');
  } else {
    dueDate = moment(issueDate).add(1, 'month');
  }
  return dueDate.add(graceDays, 'days').toDate();
};

const isLoanOverdue = (loan) => {
  return loan.status !== 'paid' && moment().isAfter(moment(loan.dueDate).add(loan.graceDays, 'days'));
};

module.exports = {
  calculateDueDate,
  isLoanOverdue
};