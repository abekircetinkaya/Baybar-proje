const Partner = require('../models/Partner');

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true })
      .select('-__v')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Get partners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new partner
// @route   POST /api/partners
// @access  Private (Admin)
const createPartner = async (req, res) => {
  try {
    const { name, logo_url, website, description, order } = req.body;

    const partner = new Partner({
      name,
      logo_url,
      website,
      description,
      order: order || 0
    });

    await partner.save();

    res.status(201).json({
      success: true,
      data: partner,
      message: 'Partner created successfully'
    });
  } catch (error) {
    console.error('Create partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update partner
// @route   PUT /api/partners/:id
// @access  Private (Admin)
const updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const partner = await Partner.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    res.json({
      success: true,
      data: partner,
      message: 'Partner updated successfully'
    });
  } catch (error) {
    console.error('Update partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete partner
// @route   DELETE /api/partners/:id
// @access  Private (Admin)
const deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Partner not found'
      });
    }

    res.json({
      success: true,
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    console.error('Delete partner error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner
};
