/**
 * Baybar Kurumsal Tanıtım Sitesi - Partner Model
 * İş ortaklarının logoları ve bilgileri için MongoDB şeması
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');

// Partner şeması
const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Partner adı gereklidir'],
    trim: true,
    maxlength: [100, 'Partner adı 100 karakterden uzun olamaz'],
    index: true
  },
  logo_url: {
    type: String,
    required: [true, 'Logo URL gereklidir'],
    trim: true,
    validate: {
      validator: function(v) {
        // URL validation
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Geçerli bir logo URL formatı giriniz'
    }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // URL validation - opsiyonel alan
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Geçerli bir website URL formatı giriniz'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Açıklama 500 karakterden uzun olamaz']
  },
  category: {
    type: String,
    trim: true,
    enum: {
      values: ['technology', 'logistics', 'finance', 'retail', 'manufacturing', 'other'],
      message: 'Kategori geçerli bir değer olmalıdır'
    },
    default: 'other'
  },
  order: {
    type: Number,
    required: [true, 'Sıra numarası gereklidir'],
    min: [0, 'Sıra numarası 0 veya daha büyük olmalıdır'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  partnershipStartDate: {
    type: Date,
    default: Date.now
  },
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          // Email validation - opsiyonel alan
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Geçerli bir email formatı giriniz'
      }
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Adres 200 karakterden uzun olamaz']
    }
  },
  socialMedia: {
    linkedin: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/.+/.test(v);
        },
        message: 'Geçerli bir LinkedIn URL formatı giriniz'
      }
    },
    twitter: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?twitter\.com\/.+/.test(v);
        },
        message: 'Geçerli bir Twitter URL formatı giriniz'
      }
    },
    facebook: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?facebook\.com\/.+/.test(v);
        },
        message: 'Geçerli bir Facebook URL formatı giriniz'
      }
    }
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // createdAt ve updatedAt otomatik eklenir
  versionKey: '__v'
});

// Middleware - save işleminden önce çalışır
partnerSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Middleware - update işlemlerinde lastModified güncelle
partnerSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ lastModified: new Date() });
  next();
});

// Virtual field - partner yaşı (kaç yıldır partner)
partnerSchema.virtual('partnershipDuration').get(function() {
  const now = new Date();
  const startDate = this.partnershipStartDate;
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `${diffYears} yıl`;
  } else {
    return `${diffDays} gün`;
  }
});

// Instance method - partner bilgilerini özet olarak getir
partnerSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    logo_url: this.logo_url,
    website: this.website,
    category: this.category,
    isFeatured: this.isFeatured,
    partnershipDuration: this.partnershipDuration
  };
};

// Static method - aktif partnerleri getir
partnerSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .select('name logo_url website category isFeatured order');
};

// Static method - öne çıkan partnerleri getir
partnerSchema.statics.findFeatured = function() {
  return this.find({ 
    isActive: true, 
    isFeatured: true 
  })
    .sort({ order: 1, name: 1 })
    .select('name logo_url website category order');
};

// Static method - kategoriye göre partnerleri getir
partnerSchema.statics.findByCategory = function(category) {
  return this.find({ 
    isActive: true, 
    category: category 
  })
    .sort({ order: 1, name: 1 });
};

// Index'ler - performans için
partnerSchema.index({ name: 1 });
partnerSchema.index({ isActive: 1, order: 1 });
partnerSchema.index({ isFeatured: 1, isActive: 1 });
partnerSchema.index({ category: 1, isActive: 1 });
partnerSchema.index({ partnershipStartDate: -1 });

// Unique constraint - aynı isimde partner olamaz
partnerSchema.index({ name: 1 }, { unique: true });

// JSON çıktısında virtual field'ları dahil et
partnerSchema.set('toJSON', { virtuals: true });
partnerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Partner', partnerSchema);