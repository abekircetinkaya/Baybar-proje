const express = require('express');
const router = express.Router();
const {
  register,
  registerCustomer,
  login,
  getMe
} = require('../controllers/authController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/register-customer', registerCustomer);

// Protected routes
router.use(auth);
router.get('/me', getMe);
router.post('/register', adminAuth, register);

module.exports = router;
