/**
 * Baybar Kurumsal Tanıtım Sitesi - SSS Modeli
 * Sıkça Sorulan Sorular için MongoDB modeli
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Soru alanı zorunludur'],
    trim: true,
    maxlength: [500, 'Soru en fazla 500 karakter olabilir']
  },
  answer: {
    type: String,
    required: [true, 'Cevap alanı zorunludur'],
    trim: true,
    maxlength: [2000, 'Cevap en fazla 2000 karakter olabilir']
  },
  category: {
    type: String,
    required: [true, 'Kategori alanı zorunludur'],
    enum: {
      values: ['genel', 'hizmetler', 'fiyatlandirma', 'teknik', 'destek'],
      message: 'Geçersiz kategori seçimi'
    },
    default: 'genel'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  isHelpful: {
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
faqSchema.index({ category: 1, isActive: 1, order: 1 });
faqSchema.index({ question: 'text', answer: 'text', tags: 'text' });
faqSchema.index({ createdAt: -1 });

// Virtual for helpfulness ratio
faqSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.isHelpful.helpful + this.isHelpful.notHelpful;
  if (total === 0) return 0;
  return (this.isHelpful.helpful / total * 100).toFixed(1);
});

// Pre-save middleware
faqSchema.pre('save', function(next) {
  if (this.isModified('question') || this.isModified('answer')) {
    // Extract tags from question and answer
    const text = `${this.question} ${this.answer}`.toLowerCase();
    const words = text.match(/\b\w{4,}\b/g) || [];
    this.tags = [...new Set(words)].slice(0, 10); // Unique words, max 10
  }
  next();
});

// Static methods
faqSchema.statics.getByCategory = function(category, isActive = true) {
  return this.find({ category, isActive })
    .sort({ order: 1, createdAt: -1 })
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');
};

faqSchema.statics.searchFAQs = function(searchTerm, category = null) {
  const query = {
    $text: { $search: searchTerm },
    isActive: true
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, order: 1 })
    .populate('createdBy', 'name email');
};

// Instance methods
faqSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

faqSchema.methods.markHelpful = function(isHelpful = true) {
  if (isHelpful) {
    this.isHelpful.helpful += 1;
  } else {
    this.isHelpful.notHelpful += 1;
  }
  return this.save();
};

module.exports = mongoose.model('FAQ', faqSchema);