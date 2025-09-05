const Content = require('../models/Content');

// @desc    Get content by page name
// @route   GET /api/content/:pageName
// @access  Public
const getContent = async (req, res) => {
  try {
    const { pageName } = req.params;
    
    const content = await Content.findOne({ 
      pageName, 
      isActive: true 
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update content by page name
// @route   PUT /api/content/:pageName
// @access  Private (Admin)
const updateContent = async (req, res) => {
  try {
    const { pageName } = req.params;
    const { sections, seo } = req.body;

    const content = await Content.findOneAndUpdate(
      { pageName },
      { 
        sections: sections || [],
        seo: seo || {},
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: content,
      message: 'Content updated successfully'
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all content pages
// @route   GET /api/content
// @access  Private (Admin)
const getAllContent = async (req, res) => {
  try {
    const contents = await Content.find({ isActive: true })
      .select('-__v')
      .sort({ pageName: 1 });

    res.json({
      success: true,
      data: contents
    });
  } catch (error) {
    console.error('Get all content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getContent,
  updateContent,
  getAllContent
};
