const express = require('express');
const router = express.Router();
const {
  getQuotes,
  getMyQuotes,
  createQuote,
  updateQuoteStatus,
  getQuoteById
} = require('../controllers/quoteController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', createQuote);

// Protected routes
router.use(protect);

// Customer routes
router.get('/my-quotes', getMyQuotes);

// Admin routes
router.get('/', authorize('admin', 'editor'), getQuotes);
router.get('/:id', getQuoteById);
router.put('/:id/status', authorize('admin', 'editor'), updateQuoteStatus);

module.exports = router;
