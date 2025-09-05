const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  updateContactStatus
} = require('../controllers/contactController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.post('/', submitContact);

// Protected routes
router.use(auth);
router.get('/', adminAuth, getContacts);
router.put('/:id', adminAuth, updateContactStatus);

module.exports = router;
