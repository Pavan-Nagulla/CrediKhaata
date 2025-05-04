const mongoose = require('mongoose');
const validator = require('validator');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isMobilePhone(value, 'any')) {
        throw new Error('Phone number is invalid');
      }
    }
  },
  address: {
    type: String,
    trim: true
  },
  trustScore: {
    type: Number,
    default: 5,
    min: 0,
    max: 10
  },
  creditLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;