/**
 * Baybar Kurumsal Tanıtım Sitesi - Offer Model
 * Müşteri teklif talepleri için MongoDB şeması
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');

// Proje detayları şeması
const projectDetailsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Proje tipi gereklidir'],
    enum: {
      values: ['web', 'mobile', 'desktop', 'ai', 'blockchain', 'iot', 'consulting', 'other'],
      message: 'Geçersiz proje tipi'
    }
  },
  description: {
    type: String,
    required: [true, 'Proje açıklaması gereklidir'],
    trim: true,
    maxlength: [2000, 'Açıklama 2000 karakterden uzun olamaz']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  timeline: {
    type: String,
    trim: true
  },
  budget: {
    min: {
      type: Number,
      min: [0, 'Minimum bütçe 0 veya daha büyük olmalıdır']
    },
    max: {
      type: Number,
      min: [0, 'Maksimum bütçe 0 veya daha büyük olmalıdır']
    },
    currency: {
      type: String,
      enum: ['TRY', 'USD', 'EUR'],
      default: 'TRY'
    },
    isFlexible: {
      type: Boolean,
      default: false
    }
  }
}, { _id: false });

// İletişim bilgileri şeması
const contactInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim gereklidir'],
    trim: true,
    maxlength: [100, 'İsim 100 karakterden uzun olamaz']
  },
  surname: {
    type: String,
    required: [true, 'Soyisim gereklidir'],
    trim: true,
    maxlength: [100, 'Soyisim 100 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'Email gereklidir'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Geçerli bir email formatı giriniz'
    }
  },
  phone: {
    type: String,
    required: [true, 'Telefon numarası gereklidir'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[+]?[0-9\s\-\(\)]{10,20}$/.test(v);
      },
      message: 'Geçerli bir telefon numarası giriniz'
    }
  },
  company: {
    name: {
      type: String,
      trim: true,
      maxlength: [200, 'Şirket adı 200 karakterden uzun olamaz']
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Geçerli bir URL formatı giriniz'
      }
    },
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
      default: 'small'
    },
    industry: {
      type: String,
      trim: true
    }
  },
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'whatsapp', 'teams', 'zoom'],
    default: 'email'
  },
  preferredContactTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    default: 'anytime'
  }
}, { _id: false });

// Teklif şeması
const offerSchema = new mongoose.Schema({
  offerNumber: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Teklif başlığı gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz']
  },
  contactInfo: {
    type: contactInfoSchema,
    required: [true, 'İletişim bilgileri gereklidir']
  },
  projectDetails: {
    type: projectDetailsSchema,
    required: [true, 'Proje detayları gereklidir']
  },
  status: {
    type: String,
    enum: {
      values: ['new', 'reviewing', 'in_progress', 'quoted', 'accepted', 'rejected', 'completed', 'cancelled'],
      message: 'Geçersiz durum seçimi'
    },
    default: 'new'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Geçersiz öncelik seçimi'
    },
    default: 'medium'
  },
  source: {
    type: String,
    enum: {
      values: ['website', 'email', 'phone', 'referral', 'social_media', 'advertisement', 'other'],
      message: 'Geçersiz kaynak seçimi'
    },
    default: 'website'
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: [{
    content: {
      type: String,
      required: [true, 'Not içeriği gereklidir'],
      trim: true,
      maxlength: [1000, 'Not 1000 karakterden uzun olamaz']
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  quote: {
    amount: {
      type: Number,
      min: [0, 'Teklif tutarı 0 veya daha büyük olmalıdır']
    },
    currency: {
      type: String,
      enum: ['TRY', 'USD', 'EUR'],
      default: 'TRY'
    },
    validUntil: {
      type: Date
    },
    terms: {
      type: String,
      trim: true
    },
    deliveryTime: {
      type: String,
      trim: true
    },
    paymentTerms: {
      type: String,
      trim: true
    },
    quotedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    quotedAt: {
      type: Date
    }
  },
  followUpDate: {
    type: Date
  },
  lastContactDate: {
    type: Date
  },
  estimatedValue: {
    type: Number,
    min: [0, 'Tahmini değer 0 veya daha büyük olmalıdır']
  },
  probability: {
    type: Number,
    min: [0, 'Olasılık 0-100 arasında olmalıdır'],
    max: [100, 'Olasılık 0-100 arasında olmalıdır']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
offerSchema.virtual('fullName').get(function() {
  return `${this.contactInfo.name} ${this.contactInfo.surname}`;
});

offerSchema.virtual('isOverdue').get(function() {
  return this.followUpDate && this.followUpDate < new Date();
});

offerSchema.virtual('daysSinceCreated').get(function() {
  const diffTime = Math.abs(new Date() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

offerSchema.virtual('isQuoteValid').get(function() {
  return this.quote.validUntil && this.quote.validUntil > new Date();
});

// Indexes
offerSchema.index({ offerNumber: 1 }, { unique: true });
offerSchema.index({ 'contactInfo.email': 1 });
offerSchema.index({ 'contactInfo.company.name': 1 });
offerSchema.index({ status: 1, priority: 1 });
offerSchema.index({ source: 1 });
offerSchema.index({ createdAt: -1 });
offerSchema.index({ followUpDate: 1 });
offerSchema.index({ assignedTo: 1 });
offerSchema.index({ tags: 1 });
offerSchema.index({ isArchived: 1 });

// Middleware
offerSchema.pre('save', function(next) {
  // Teklif numarası otomatik oluştur
  if (this.isNew && !this.offerNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    this.offerNumber = `OFF-${year}${month}-${random}`;
  }
  
  // Başlık otomatik oluştur
  if (this.isNew && !this.title) {
    this.title = `${this.projectDetails.type.toUpperCase()} - ${this.contactInfo.company.name || this.fullName}`;
  }
  
  next();
});

// Static methods
offerSchema.statics.getOffersByStatus = function(status, options = {}) {
  const { limit = 20, skip = 0, sortBy = 'createdAt', sortOrder = -1 } = options;
  
  const sortObj = {};
  sortObj[sortBy] = sortOrder;
  
  return this.find({ status, isArchived: false })
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'username email')
    .populate('createdBy', 'username email')
    .select('-__v');
};

offerSchema.statics.getOffersByPriority = function(priority, options = {}) {
  const { limit = 20, skip = 0 } = options;
  
  return this.find({ priority, isArchived: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'username email')
    .select('-__v');
};

offerSchema.statics.searchOffers = function(searchTerm, options = {}) {
  const {
    status,
    priority,
    source,
    assignedTo,
    limit = 20,
    skip = 0,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;

  let query = { isArchived: false };

  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { 'contactInfo.name': { $regex: searchTerm, $options: 'i' } },
      { 'contactInfo.surname': { $regex: searchTerm, $options: 'i' } },
      { 'contactInfo.email': { $regex: searchTerm, $options: 'i' } },
      { 'contactInfo.company.name': { $regex: searchTerm, $options: 'i' } },
      { offerNumber: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (source) query.source = source;
  if (assignedTo) query.assignedTo = assignedTo;

  const sortObj = {};
  sortObj[sortBy] = sortOrder;

  return this.find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'username email')
    .populate('createdBy', 'username email')
    .select('-__v');
};

offerSchema.statics.getOverdueOffers = function() {
  return this.find({
    followUpDate: { $lt: new Date() },
    status: { $nin: ['completed', 'cancelled', 'rejected'] },
    isArchived: false
  })
  .sort({ followUpDate: 1 })
  .populate('assignedTo', 'username email')
  .select('-__v');
};

offerSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $match: { isArchived: false }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        reviewing: { $sum: { $cond: [{ $eq: ['$status', 'reviewing'] }, 1, 0] } },
        quoted: { $sum: { $cond: [{ $eq: ['$status', 'quoted'] }, 1, 0] } },
        accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
        totalValue: { $sum: '$estimatedValue' },
        avgValue: { $avg: '$estimatedValue' }
      }
    }
  ]);
};

// Instance methods
offerSchema.methods.addNote = function(content, authorId, isPrivate = false) {
  this.notes.push({
    content,
    author: authorId,
    isPrivate
  });
  this.updatedBy = authorId;
  return this.save();
};

offerSchema.methods.updateStatus = function(newStatus, userId) {
  this.status = newStatus;
  this.updatedBy = userId;
  
  if (newStatus === 'quoted') {
    this.quote.quotedBy = userId;
    this.quote.quotedAt = new Date();
  }
  
  return this.save();
};

offerSchema.methods.assignTo = function(userId, assignedBy) {
  this.assignedTo = userId;
  this.updatedBy = assignedBy;
  return this.save();
};

offerSchema.methods.setFollowUpDate = function(date, userId) {
  this.followUpDate = date;
  this.updatedBy = userId;
  return this.save();
};

offerSchema.methods.archive = function(userId) {
  this.isArchived = true;
  this.updatedBy = userId;
  return this.save();
};

module.exports = mongoose.model('Offer', offerSchema);