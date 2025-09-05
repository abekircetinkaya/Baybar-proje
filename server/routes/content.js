const express = require('express');
const router = express.Router();
const {
  getContent,
  updateContent,
  getAllContent
} = require('../controllers/contentController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/:pageName', getContent);

// Protected routes
router.use(auth);
router.get('/', adminAuth, getAllContent);
router.put('/:pageName', adminAuth, updateContent);

module.exports = router;
