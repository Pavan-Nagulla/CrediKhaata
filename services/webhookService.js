const axios = require('axios');
const Webhook = require('../models/Webhook');

exports.notifyWebhooks = async (eventType, data) => {
  try {
    const webhooks = await Webhook.find({ eventType, owner: data.owner });
    
    await Promise.all(webhooks.map(async webhook => {
      try {
        const response = await axios.post(webhook.url, {
          event: eventType,
          data,
          timestamp: new Date()
        });
        
        webhook.lastStatus = response.status;
        webhook.lastAttempt = new Date();
        await webhook.save();
      } catch (error) {
        webhook.lastStatus = error.response?.status || 500;
        webhook.lastAttempt = new Date();
        webhook.retryCount += 1;
        await webhook.save();
      }
    }));
  } catch (error) {
    console.error('Webhook notification failed:', error);
  }
};

// Call this after important events like:
// - Loan creation
// - Repayment received
// - Overdue status change