const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['loan_created', 'payment_reminder', 'payment_received', 'overdue_alert']
  },
  recipient: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  channel: {
    type: String,
    enum: ['console', 'sms', 'whatsapp', 'email'],
    default: 'console'
  },
  relatedLoan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loan'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;