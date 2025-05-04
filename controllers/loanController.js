const Loan = require('../models/Loan');
const Customer = require('../models/Customer');

// Helper function for error responses
const errorResponse = (res, status, message) => {
  return res.status(status).json({
    success: false,
    error: message
  });
};

exports.createLoan = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.body.customer, owner: req.user._id });

    if (!customer) {
      return errorResponse(res, 404, 'Customer not found');
    }

    const loan = new Loan({
      ...req.body,
      owner: req.user._id
    });

    await loan.save();

    res.status(201).json({
      success: true,
      data: loan
    });

  } catch (error) {
    console.error('Create Loan Error:', error);
    errorResponse(res, 400, error.message || 'Loan creation failed');
  }
};

exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ owner: req.user._id })
      .populate('customer', 'name phone')  // Adjust fields as needed
      .select('-__v')
      .lean();

    res.json({
      success: true,
      count: loans.length,
      data: loans
    });

  } catch (error) {
    console.error('Get Loans Error:', error);
    errorResponse(res, 500, 'Server error');
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      owner: req.user._id
    })
    .populate('customer', 'name phone')
    .select('-__v');

    if (!loan) {
      return errorResponse(res, 404, 'Loan not found');
    }

    res.json({
      success: true,
      data: loan
    });

  } catch (error) {
    console.error('Get Loan By ID Error:', error);
    errorResponse(res, 500, 'Server error');
  }
};

exports.updateLoan = async (req, res) => {
  const allowedUpdates = ['amount', 'dueDate', 'status', 'notes'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(key => allowedUpdates.includes(key));

  if (!isValidOperation) {
    return errorResponse(res, 400, 'Invalid updates attempted');
  }

  try {
    const loan = await Loan.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!loan) {
      return errorResponse(res, 404, 'Loan not found');
    }

    res.json({
      success: true,
      data: loan
    });

  } catch (error) {
    console.error('Update Loan Error:', error);
    errorResponse(res, 400, error.message || 'Update failed');
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!loan) {
      return errorResponse(res, 404, 'Loan not found');
    }

    res.json({
      success: true,
      data: loan
    });

  } catch (error) {
    console.error('Delete Loan Error:', error);
    errorResponse(res, 500, 'Server error');
  }
};
