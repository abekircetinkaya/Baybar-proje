const express = require('express');
const router = express.Router();
const {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
} = require('../controllers/partnerController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/', getPartners);

// Protected routes
router.use(auth);
router.post('/', adminAuth, createPartner);
router.put('/:id', adminAuth, updatePartner);
router.delete('/:id', adminAuth, deletePartner);

module.exports = router;
