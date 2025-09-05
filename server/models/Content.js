const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'services', 'contact', 'admin']
  },
  sections: [{
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    image_url: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['hero', 'text', 'image', 'cta', 'service', 'partner', 'contact'],
      default: 'text'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
