/**
 * Baybar Kurumsal Tanıtım Sitesi - Contact Model
 * İletişim formu mesajları için MongoDB şeması
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');

// Contact şeması
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ad Soyad gereklidir'],
    trim: true,
    minlength: [2, 'Ad Soyad en az 2 karakter olmalıdır'],
    maxlength: [100, 'Ad Soyad en fazla 100 karakter olabilir'],
    validate: {
      validator: function(v) {
        // En az iki kelime (ad ve soyad)
        return v.trim().split(' ').length >= 2;
      },
      message: 'Lütfen ad ve soyadınızı giriniz'
    }
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
    },
    index: true
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Türkiye telefon numarası formatı (opsiyonel)
        return !v || /^(\+90|0)?[5][0-9]{9}$/.test(v.replace(/[\s\-\(\)]/g, ''));
      },
      message: 'Geçerli bir telefon numarası giriniz (örn: 05XX XXX XX XX)'
    }
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Şirket adı en fazla 100 karakter olabilir']
  },
  subject: {
    type: String,
    required: [true, 'Konu gereklidir'],
    trim: true,
    minlength: [5, 'Konu en az 5 karakter olmalıdır'],
    maxlength: [200, 'Konu en fazla 200 karakter olabilir'],
    enum: {
      values: [
        'Genel Bilgi',
        'Hizmetler Hakkında',
        'Fiyat Teklifi',
        'Teknik Destek',
        'İş Birliği',
        'Şikayet',
        'Öneri',
        'Diğer'
      ],
      message: 'Geçerli bir konu seçiniz'
    },
    index: true
  },
  message: {
    type: String,
    required: [true, 'Mesaj gereklidir'],
    trim: true,
    minlength: [10, 'Mesaj en az 10 karakter olmalıdır'],
    maxlength: [2000, 'Mesaj en fazla 2000 karakter olabilir']
  },
  status: {
    type: String,
    enum: {
      values: ['new', 'read', 'replied', 'closed', 'spam'],
      message: 'Geçerli bir durum seçiniz'
    },
    default: 'new',
    index: true
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'normal', 'high', 'urgent'],
      message: 'Geçerli bir öncelik seviyesi seçiniz'
    },
    default: 'normal',
    index: true
  },
  source: {
    type: String,
    enum: {
      values: ['website', 'email', 'phone', 'social_media', 'referral'],
      message: 'Geçerli bir kaynak seçiniz'
    },
    default: 'website'
  },
  ipAddress: {
    type: String,
    validate: {
      validator: function(v) {
        // IPv4 ve IPv6 formatları
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return !v || ipv4Regex.test(v) || ipv6Regex.test(v);
      },
      message: 'Geçerli bir IP adresi formatı giriniz'
    }
  },
  userAgent: {
    type: String,
    maxlength: [500, 'User Agent en fazla 500 karakter olabilir']
  },
  referrer: {
    type: String,
    maxlength: [500, 'Referrer en fazla 500 karakter olabilir']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Etiket en fazla 30 karakter olabilir']
  }],
  notes: [{
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Not en fazla 1000 karakter olabilir']
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  replies: [{
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Yanıt konusu en fazla 200 karakter olabilir']
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Yanıt mesajı en fazla 2000 karakter olabilir']
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String,
      enum: ['email', 'phone', 'meeting'],
      default: 'email'
    }
  }],
  isSpam: {
    type: Boolean,
    default: false,
    index: true
  },
  spamScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  readAt: {
    type: Date,
    default: null
  },
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Virtual field - mesaj yaşı (gün olarak)
contactSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual field - yanıt süresi (saat olarak)
contactSchema.virtual('responseTimeHours').get(function() {
  if (this.replies && this.replies.length > 0) {
    const firstReply = this.replies[0];
    return Math.floor((firstReply.sentAt - this.createdAt) / (1000 * 60 * 60));
  }
  return null;
});

// Virtual field - son aktivite
contactSchema.virtual('lastActivity').get(function() {
  const dates = [this.createdAt, this.readAt, this.lastModified];
  if (this.replies && this.replies.length > 0) {
    dates.push(...this.replies.map(r => r.sentAt));
  }
  return new Date(Math.max(...dates.filter(d => d).map(d => d.getTime())));
});

// Middleware - update işlemlerinde lastModified güncelle
contactSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ lastModified: new Date() });
  next();
});

// Middleware - spam kontrolü
contactSchema.pre('save', function(next) {
  if (this.isNew) {
    // Basit spam kontrolü
    let spamScore = 0;
    
    // Aynı email'den son 24 saatte 5'ten fazla mesaj
    this.constructor.countDocuments({
      email: this.email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).then(count => {
      if (count >= 5) spamScore += 30;
      
      // Mesajda spam kelimeleri
      const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'urgent', 'act now'];
      const messageText = (this.message + ' ' + this.subject).toLowerCase();
      spamWords.forEach(word => {
        if (messageText.includes(word)) spamScore += 15;
      });
      
      // Çok fazla büyük harf
      const upperCaseRatio = (this.message.match(/[A-Z]/g) || []).length / this.message.length;
      if (upperCaseRatio > 0.5) spamScore += 20;
      
      // Çok fazla link
      const linkCount = (this.message.match(/https?:\/\//g) || []).length;
      if (linkCount > 3) spamScore += 25;
      
      this.spamScore = Math.min(spamScore, 100);
      this.isSpam = spamScore >= 70;
      
      next();
    }).catch(next);
  } else {
    next();
  }
});

// Instance method - mesajı okundu olarak işaretle
contactSchema.methods.markAsRead = function(userId) {
  this.status = 'read';
  this.readAt = new Date();
  this.readBy = userId;
  this.lastModified = new Date();
  return this.save();
};

// Instance method - yanıt ekle
contactSchema.methods.addReply = function(replyData, userId) {
  this.replies.push({
    ...replyData,
    sentBy: userId,
    sentAt: new Date()
  });
  this.status = 'replied';
  this.lastModified = new Date();
  return this.save();
};

// Instance method - not ekle
contactSchema.methods.addNote = function(content, userId, isPrivate = false) {
  this.notes.push({
    content,
    addedBy: userId,
    addedAt: new Date(),
    isPrivate
  });
  this.lastModified = new Date();
  return this.save();
};

// Instance method - mesajı kapat
contactSchema.methods.close = function(userId) {
  this.status = 'closed';
  this.closedAt = new Date();
  this.closedBy = userId;
  this.lastModified = new Date();
  return this.save();
};

// Static method - bekleyen mesajları getir
contactSchema.statics.findPending = function() {
  return this.find({ 
    status: { $in: ['new', 'read'] },
    isSpam: false 
  })
  .populate('assignedTo', 'firstName lastName')
  .sort({ priority: -1, createdAt: 1 });
};

// Static method - konuya göre mesajları getir
contactSchema.statics.findBySubject = function(subject) {
  return this.find({ subject, isSpam: false })
    .populate('assignedTo', 'firstName lastName')
    .sort({ createdAt: -1 });
};

// Static method - spam mesajları getir
contactSchema.statics.findSpam = function() {
  return this.find({ isSpam: true })
    .sort({ createdAt: -1 });
};

// Static method - istatistikler
contactSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$count' },
        statuses: {
          $push: {
            status: '$_id',
            count: '$count'
          }
        }
      }
    }
  ]);
};

// Index'ler - performans için
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, priority: -1, createdAt: 1 });
contactSchema.index({ subject: 1, isSpam: 1 });
contactSchema.index({ assignedTo: 1, status: 1 });
contactSchema.index({ isSpam: 1, spamScore: -1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ tags: 1 });

// JSON çıktısında virtual field'ları dahil et
contactSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Contact', contactSchema);