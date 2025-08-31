/**
 * Baybar Kurumsal Tanıtım Sitesi - Content Model
 * Dinamik sayfa içerikleri için MongoDB şeması
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');

// İçerik bölümü şeması (sections array için)
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bölüm başlığı gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz']
  },
  text: {
    type: String,
    required: [true, 'Bölüm metni gereklidir'],
    trim: true,
    maxlength: [5000, 'Metin 5000 karakterden uzun olamaz']
  },
  image_url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // URL validation - opsiyonel alan
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Geçerli bir URL formatı giriniz'
    }
  },
  order: {
    type: Number,
    required: [true, 'Bölüm sırası gereklidir'],
    min: [0, 'Sıra numarası 0 veya daha büyük olmalıdır']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  _id: true // Her section için otomatik ID
});

// Ana içerik şeması
const contentSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: [true, 'Sayfa adı gereklidir'],
    unique: true,
    trim: true,
    lowercase: true,
    enum: {
      values: ['home', 'about', 'services', 'contact'],
      message: 'Sayfa adı home, about, services veya contact olmalıdır'
    },
    index: true
  },
  pageTitle: {
    type: String,
    required: [true, 'Sayfa başlığı gereklidir'],
    trim: true,
    maxlength: [100, 'Sayfa başlığı 100 karakterden uzun olamaz']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta açıklama 160 karakterden uzun olamaz']
  },
  metaKeywords: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'En fazla 10 anahtar kelime ekleyebilirsiniz'
    }
  },
  sections: {
    type: [sectionSchema],
    required: [true, 'En az bir bölüm gereklidir'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'En az bir bölüm eklemelisiniz'
    }
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true, // createdAt ve updatedAt otomatik eklenir
  versionKey: '__v'
});

// Middleware - save işleminden önce çalışır
contentSchema.pre('save', function(next) {
  // lastModified alanını güncelle
  this.lastModified = new Date();
  
  // Eğer yeni bir kayıt değilse version numarasını artır
  if (!this.isNew) {
    this.version += 1;
  }
  
  // Sections array'ini order'a göre sırala
  if (this.sections && this.sections.length > 0) {
    this.sections.sort((a, b) => a.order - b.order);
  }
  
  next();
});

// Middleware - update işlemlerinde lastModified güncelle
contentSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ lastModified: new Date() });
  next();
});

// Virtual field - sayfa URL'si
contentSchema.virtual('pageUrl').get(function() {
  const urlMap = {
    'home': '/',
    'about': '/hakkimizda',
    'services': '/hizmetler',
    'contact': '/iletisim'
  };
  return urlMap[this.pageName] || `/${this.pageName}`;
});

// Instance method - aktif bölümleri getir
contentSchema.methods.getActiveSections = function() {
  return this.sections
    .filter(section => section.isActive)
    .sort((a, b) => a.order - b.order);
};

// Static method - sayfa adına göre içerik getir
contentSchema.statics.findByPageName = function(pageName) {
  return this.findOne({ 
    pageName: pageName.toLowerCase(),
    isPublished: true 
  }).populate('modifiedBy', 'username email');
};

// Static method - tüm yayınlanmış sayfaları getir
contentSchema.statics.findAllPublished = function() {
  return this.find({ isPublished: true })
    .select('pageName pageTitle metaDescription publishedAt')
    .sort({ pageName: 1 });
};

// Index'ler - performans için
contentSchema.index({ pageName: 1, isPublished: 1 });
contentSchema.index({ lastModified: -1 });
contentSchema.index({ 'sections.order': 1 });

// JSON çıktısında virtual field'ları dahil et
contentSchema.set('toJSON', { virtuals: true });
contentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Content', contentSchema);