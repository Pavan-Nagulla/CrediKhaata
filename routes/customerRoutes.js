const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCustomer,
  getCustomers,
  getCustomerById,  // Renamed for clarity
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

// Apply auth middleware to all routes
router.use(auth);

// Customer CRUD routes
router.post('/', createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);  // Updated function name
router.patch('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

module.exports = router;
