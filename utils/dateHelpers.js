const moment = require('moment');

exports.calculateDueDate = (issueDate, frequency, graceDays = 0) => {
  let dueDate;
  
  switch (frequency) {
    case 'bi-weekly':
      dueDate = moment(issueDate).add(2, 'weeks');
      break;
    case 'monthly':
      dueDate = moment(issueDate).add(1, 'months');
      break;
    default:
      dueDate = moment(issueDate).add(1, 'months');
  }
  
  return dueDate.add(graceDays, 'days').toDate();
};

exports.isOverdue = (dueDate) => {
  return moment().isAfter(moment(dueDate));
};

exports.formatDate = (date) => {
  return moment(date).format('DD/MM/YYYY');
};