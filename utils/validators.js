const validator = require('validator');
const mongoose = require('mongoose');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, 'any');
};

const validateMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateLoanAmount = (amount) => {
  return typeof amount === 'number' && amount > 0;
};

const validateTrustScore = (score) => {
  return typeof score === 'number' && score >= 0 && score <= 10;
};

module.exports = {
  validateEmail,
  validatePhone,
  validateMongoId,
  validateLoanAmount,
  validateTrustScore
};