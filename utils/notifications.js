// Mock SMS/WhatsApp notification function
const sendPaymentReminder = (customer, loan) => {
    console.log(`Sending reminder to ${customer.name} (${customer.phone}) about loan ${loan._id}`);
    console.log(`Message: Dear ${customer.name}, your payment of ${loan.remainingAmount} is due on ${loan.dueDate}.`);
    return true;
  };
  
  // Mock PDF receipt generation
  const generateReceipt = (repayment) => {
    console.log(`Generating receipt for repayment ${repayment._id}`);
    // In a real implementation, we would use a library like pdfkit
    return {
      receiptId: `RCPT-${Date.now()}`,
      amount: repayment.amount,
      date: repayment.paymentDate
    };
  };
  
  module.exports = {
    sendPaymentReminder,
    generateReceipt
  };