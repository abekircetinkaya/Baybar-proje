/**
 * Baybar Kurumsal Tanıtım Sitesi - Plan Model
 * Hizmet planları için MongoDB şeması
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');

// Özellik şeması
const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Özellik adı gereklidir'],
    trim: true,
    maxlength: [200, 'Özellik adı 200 karakterden uzun olamaz']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
  },
  isIncluded: {
    type: Boolean,
    default: true
  },
  isHighlight: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: false });

// Fiyatlandırma şeması
const pricingSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Fiyat tutarı gereklidir'],
    min: [0, 'Fiyat 0 veya daha büyük olmalıdır']
  },
  currency: {
    type: String,
    enum: ['TRY', 'USD', 'EUR'],
    default: 'TRY'
  },
  period: {
    type: String,
    enum: ['one_time', 'monthly', 'quarterly', 'yearly', 'custom'],
    default: 'one_time'
  },
  discount: {
    percentage: {
      type: Number,
      min: [0, 'İndirim yüzdesi 0-100 arasında olmalıdır'],
      max: [100, 'İndirim yüzdesi 0-100 arasında olmalıdır'],
      default: 0
    },
    validUntil: {
      type: Date
    },
    description: {
      type: String,
      trim: true
    }
  },
  setupFee: {
    type: Number,
    min: [0, 'Kurulum ücreti 0 veya daha büyük olmalıdır'],
    default: 0
  }
}, { _id: false });

// Plan şeması
const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan adı gereklidir'],
    trim: true,
    maxlength: [100, 'Plan adı 100 karakterden uzun olamaz']
  },
  slug: {
    type: String,
    required: [true, 'Plan slug gereklidir'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug sadece küçük harf, rakam ve tire içerebilir'
    }
  },
  title: {
    type: String,
    required: [true, 'Plan başlığı gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Alt başlık 300 karakterden uzun olamaz']
  },
  description: {
    type: String,
    required: [true, 'Plan açıklaması gereklidir'],
    trim: true,
    maxlength: [1000, 'Açıklama 1000 karakterden uzun olamaz']
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Kısa açıklama 300 karakterden uzun olamaz']
  },
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: {
      values: ['web', 'mobile', 'consulting', 'maintenance', 'training', 'custom'],
      message: 'Geçersiz kategori seçimi'
    }
  },
  type: {
    type: String,
    enum: {
      values: ['basic', 'standard', 'premium', 'enterprise', 'custom'],
      message: 'Geçersiz plan tipi'
    },
    default: 'standard'
  },
  pricing: {
    type: pricingSchema,
    required: [true, 'Fiyatlandırma bilgileri gereklidir']
  },
  features: [featureSchema],
  deliverables: [{
    name: {
      type: String,
      required: [true, 'Teslimat adı gereklidir'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    timeline: {
      type: String,
      trim: true
    }
  }],
  timeline: {
    duration: {
      type: Number,
      required: [true, 'Süre gereklidir'],
      min: [1, 'Süre en az 1 gün olmalıdır']
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'days'
    },
    milestones: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true
      },
      duration: {
        type: Number,
        required: true,
        min: [1, 'Milestone süresi en az 1 gün olmalıdır']
      },
      order: {
        type: Number,
        default: 0
      }
    }]
  },
  technologies: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    icon: {
      type: String,
      trim: true
    },
    version: {
      type: String,
      trim: true
    }
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  limitations: [{
    type: String,
    trim: true
  }],
  support: {
    duration: {
      type: Number,
      min: [0, 'Destek süresi 0 veya daha büyük olmalıdır'],
      default: 0
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years'],
      default: 'months'
    },
    type: {
      type: String,
      enum: ['email', 'phone', 'chat', 'onsite', 'remote'],
      default: 'email'
    },
    hours: {
      type: String,
      trim: true,
      default: '9:00-18:00'
    },
    responseTime: {
      type: String,
      trim: true,
      default: '24 saat'
    }
  },
  targetAudience: [{
    type: String,
    trim: true
  }],
  benefits: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    icon: {
      type: String,
      trim: true
    }
  }],
  testimonials: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Testimonial 500 karakterden uzun olamaz']
    },
    rating: {
      type: Number,
      min: [1, 'Rating 1-5 arasında olmalıdır'],
      max: [5, 'Rating 1-5 arasında olmalıdır']
    },
    avatar: {
      type: String,
      trim: true
    }
  }],
  faqs: [{
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    }
  }],
  ctaText: {
    type: String,
    trim: true,
    default: 'Hemen Başla'
  },
  ctaUrl: {
    type: String,
    trim: true
  },
  badge: {
    text: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true,
      default: '#3b82f6'
    },
    backgroundColor: {
      type: String,
      trim: true,
      default: '#eff6ff'
    }
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCustomizable: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO başlığı 60 karakterden uzun olamaz']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO açıklaması 160 karakterden uzun olamaz']
  },
  seoKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
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

// Virtual fields
planSchema.virtual('finalPrice').get(function() {
  const { amount, discount } = this.pricing;
  if (discount.percentage > 0) {
    return amount - (amount * discount.percentage / 100);
  }
  return amount;
});

planSchema.virtual('totalPrice').get(function() {
  return this.finalPrice + this.pricing.setupFee;
});

planSchema.virtual('isDiscounted').get(function() {
  return this.pricing.discount.percentage > 0 && 
         (!this.pricing.discount.validUntil || this.pricing.discount.validUntil > new Date());
});

planSchema.virtual('totalDuration').get(function() {
  if (this.timeline.milestones.length === 0) {
    return this.timeline.duration;
  }
  return this.timeline.milestones.reduce((total, milestone) => total + milestone.duration, 0);
});

planSchema.virtual('averageRating').get(function() {
  if (this.testimonials.length === 0) return 0;
  const totalRating = this.testimonials.reduce((sum, testimonial) => sum + (testimonial.rating || 0), 0);
  return Math.round((totalRating / this.testimonials.length) * 10) / 10;
});

// Indexes
planSchema.index({ slug: 1 }, { unique: true });
planSchema.index({ name: 'text', title: 'text', description: 'text' });
planSchema.index({ category: 1, type: 1 });
planSchema.index({ isActive: 1, isPopular: 1 });
planSchema.index({ 'pricing.amount': 1 });
planSchema.index({ order: 1 });
planSchema.index({ tags: 1 });
planSchema.index({ createdAt: -1 });

// Middleware
planSchema.pre('save', function(next) {
  // Slug otomatik oluştur
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  // SEO alanları otomatik doldur
  if (this.isModified('title') && !this.seoTitle) {
    this.seoTitle = this.title.substring(0, 60);
  }
  
  if (this.isModified('shortDescription') && !this.seoDescription) {
    this.seoDescription = this.shortDescription?.substring(0, 160) || this.description.substring(0, 160);
  }
  
  next();
});

// Static methods
planSchema.statics.getActivePlans = function(options = {}) {
  const { category, type, limit = 20, skip = 0, sortBy = 'order', sortOrder = 1 } = options;
  
  let query = { isActive: true };
  
  if (category) query.category = category;
  if (type) query.type = type;
  
  const sortObj = {};
  sortObj[sortBy] = sortOrder;
  
  return this.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'username email')
    .select('-__v');
};

planSchema.statics.getPopularPlans = function(limit = 6) {
  return this.find({ isPopular: true, isActive: true })
    .sort({ order: 1, purchaseCount: -1 })
    .limit(limit)
    .populate('createdBy', 'username email')
    .select('-__v');
};

planSchema.statics.getPlansByCategory = function(category, limit = 10) {
  return this.find({ category, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'username email')
    .select('-__v');
};

planSchema.statics.searchPlans = function(searchTerm, options = {}) {
  const {
    category,
    type,
    minPrice,
    maxPrice,
    limit = 20,
    skip = 0,
    sortBy = 'order',
    sortOrder = 1
  } = options;

  let query = { isActive: true };

  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  if (category) query.category = category;
  if (type) query.type = type;
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    query['pricing.amount'] = {};
    if (minPrice !== undefined) query['pricing.amount'].$gte = minPrice;
    if (maxPrice !== undefined) query['pricing.amount'].$lte = maxPrice;
  }

  const sortObj = {};
  sortObj[sortBy] = sortOrder;

  return this.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'username email')
    .select('-__v');
};

planSchema.statics.getPlanStatistics = function() {
  return this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$pricing.amount' },
        totalPurchases: { $sum: '$purchaseCount' },
        totalViews: { $sum: '$viewCount' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Instance methods
planSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

planSchema.methods.incrementPurchase = function() {
  this.purchaseCount += 1;
  return this.save();
};

planSchema.methods.togglePopular = function() {
  this.isPopular = !this.isPopular;
  return this.save();
};

planSchema.methods.addTestimonial = function(testimonialData) {
  this.testimonials.push(testimonialData);
  return this.save();
};

planSchema.methods.addFAQ = function(question, answer) {
  this.faqs.push({ question, answer });
  return this.save();
};

planSchema.methods.updatePricing = function(pricingData, userId) {
  this.pricing = { ...this.pricing.toObject(), ...pricingData };
  this.updatedBy = userId;
  return this.save();
};

module.exports = mongoose.model('Plan', planSchema);