const Notification = require('../models/Notification');

// Mock notification service
const sendNotification = async (to, message) => {
  // In a real implementation, you would integrate with an SMS/WhatsApp service here
  console.log(`[NOTIFICATION] To: ${to}, Message: ${message}`);
  return { 
    status: 'sent', 
    channel: 'console', // Can be 'sms', 'whatsapp', 'email' in production
    to, 
    message 
  };
};

exports.sendLoanNotification = async (user, customer, loan) => {
  const message = `New loan created for ${customer.name}: ₹${loan.amount} due on ${loan.dueDate.toDateString()}`;
  
  const notification = new Notification({
    type: 'loan_created',
    recipient: customer.phone,
    message,
    owner: user._id,
    relatedLoan: loan._id,
    channel: 'console' // Track notification channel
  });
  
  // Send notification
  const result = await sendNotification(customer.phone, message);
  
  notification.status = result.status;
  await notification.save();
  
  return notification;
};

exports.sendPaymentReminder = async (loan) => {
  const customer = await Customer.findById(loan.customer);
  const user = await User.findById(loan.owner);
  
  const message = `Reminder: Payment of ₹${loan.remainingAmount} for ${loan.description} is due on ${loan.dueDate.toDateString()}`;
  
  const notification = new Notification({
    type: 'payment_reminder',
    recipient: customer.phone,
    message,
    owner: user._id,
    relatedLoan: loan._id,
    channel: 'console'
  });
  
  // Send notification
  const result = await sendNotification(customer.phone, message);
  
  notification.status = result.status;
  await notification.save();
  
  return notification;
};

// Add this if you want to simulate different notification channels
exports.sendTestNotification = async (phone, message) => {
  return sendNotification(phone, message);
};