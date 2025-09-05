const Quote = require('../models/Quote');
const User = require('../models/User');

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Private (Admin)
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate('userId', 'name email phone company')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// @desc    Get quotes by user
// @route   GET /api/quotes/my-quotes
// @access  Private (Customer)
const getMyQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quotes
    });
  } catch (error) {
    console.error('Get my quotes error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// @desc    Create new quote
// @route   POST /api/quotes
// @access  Public
const createQuote = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      serviceId,
      serviceTitle,
      categories,
      projectDescription,
      budget,
      timeline,
      amount
    } = req.body;

    // Check if user exists (if logged in)
    let userId = null;
    if (req.user) {
      userId = req.user.id;
    }

    const quote = new Quote({
      name,
      email,
      phone,
      company,
      serviceId,
      serviceTitle,
      categories,
      projectDescription,
      budget,
      timeline,
      amount,
      userId
    });

    await quote.save();

    res.status(201).json({
      success: true,
      message: 'Teklifiniz başarıyla gönderildi',
      data: quote
    });
  } catch (error) {
    console.error('Create quote error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// @desc    Update quote status
// @route   PUT /api/quotes/:id/status
// @access  Private (Admin)
const updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const quote = await Quote.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email phone company');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Teklif durumu güncellendi',
      data: quote
    });
  } catch (error) {
    console.error('Update quote status error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// @desc    Get quote by ID
// @route   GET /api/quotes/:id
// @access  Private
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('userId', 'name email phone company');

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    console.error('Get quote by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

module.exports = {
  getQuotes,
  getMyQuotes,
  createQuote,
  updateQuoteStatus,
  getQuoteById
};
