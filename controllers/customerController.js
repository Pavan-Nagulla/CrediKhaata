const Customer = require('../models/Customer');
const Loan = require('../models/Loan');
const { validatePhone, validateTrustScore } = require('../utils/validators');

// Helper function for error responses
const errorResponse = (res, status, message) => {
  return res.status(status).json({ 
    success: false,
    error: message 
  });
};

exports.createCustomer = async (req, res) => {
  try {
    if (!validatePhone(req.body.phone)) {
      return errorResponse(res, 400, 'Invalid phone number format');
    }

    if (req.body.trustScore && !validateTrustScore(req.body.trustScore)) {
      return errorResponse(res, 400, 'Trust score must be between 0-10');
    }

    const customer = new Customer({
      ...req.body,
      owner: req.user._id
    });

    await customer.save();
    
    res.status(201).json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Create Customer Error:', error);
    errorResponse(res, 400, error.message || 'Customer creation failed');
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ owner: req.user._id })
      .select('-__v')
      .lean();

    res.json({
      success: true,
      count: customers.length,
      data: customers
    });

  } catch (error) {
    console.error('Get Customers Error:', error);
    errorResponse(res, 500, 'Server error');
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne(
      { _id: req.params.id, owner: req.user._id }
    ).select('-__v');

    if (!customer) {
      return errorResponse(res, 404, 'Customer not found');
    }

    const loans = await Loan.find(
      { customer: req.params.id, owner: req.user._id }
    )
    .sort({ dueDate: 1 })
    .select('-__v')
    .lean();

    res.json({
      success: true,
      data: {
        customer,
        loans
      }
    });

  } catch (error) {
    console.error('Get Customer By ID Error:', error);
    errorResponse(res, 500, 'Server error');
  }
};

exports.updateCustomer = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'phone', 'address', 'trustScore', 'creditLimit'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return errorResponse(res, 400, 'Invalid updates attempted');
  }

  try {
    if (req.body.phone && !validatePhone(req.body.phone)) {
      return errorResponse(res, 400, 'Invalid phone number format');
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!customer) {
      return errorResponse(res, 404, 'Customer not found');
    }

    res.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Update Customer Error:', error);
    errorResponse(res, 400, error.message || 'Update failed');
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete(
      { _id: req.params.id, owner: req.user._id }
    );

    if (!customer) {
      return errorResponse(res, 404, 'Customer not found');
    }

    await Loan.deleteMany({ customer: req.params.id });

    res.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Delete Customer Error:', error);
    errorResponse(res, 500, 'Server error');
  }
};
