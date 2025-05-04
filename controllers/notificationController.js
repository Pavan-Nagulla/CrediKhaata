const Notification = require('../models/Notification');
const { sendPaymentReminder } = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.send(notifications);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.sendManualReminder = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findOne({ _id: loanId, owner: req.user._id });
    
    if (!loan) {
      return res.status(404).send({ error: 'Loan not found' });
    }

    const notification = await sendPaymentReminder(loan);
    res.send(notification);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};