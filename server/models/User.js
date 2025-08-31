/**
 * Baybar Kurumsal Tanıtım Sitesi - User Model
 * Yönetici paneli kullanıcıları için MongoDB şeması
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User şeması
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Kullanıcı adı gereklidir'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Kullanıcı adı en az 3 karakter olmalıdır'],
    maxlength: [30, 'Kullanıcı adı en fazla 30 karakter olabilir'],
    validate: {
      validator: function(v) {
        // Sadece harf, rakam ve alt çizgi
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'
    },
    index: true
  },
  email: {
    type: String,
    required: [true, 'Email gereklidir'],
    unique: true,
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
  password: {
    type: String,
    required: [true, 'Şifre gereklidir'],
    minlength: [8, 'Şifre en az 8 karakter olmalıdır'],
    validate: {
      validator: function(v) {
        // En az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(v);
      },
      message: 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir'
    },
    select: false // Varsayılan olarak şifreyi döndürme
  },
  firstName: {
    type: String,
    required: [true, 'Ad gereklidir'],
    trim: true,
    maxlength: [50, 'Ad en fazla 50 karakter olabilir']
  },
  lastName: {
    type: String,
    required: [true, 'Soyad gereklidir'],
    trim: true,
    maxlength: [50, 'Soyad en fazla 50 karakter olabilir']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'superadmin', 'editor', 'viewer'],
      message: 'Rol admin, superadmin, editor veya viewer olmalıdır'
    },
    default: 'editor',
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  profileImage: {
    type: String,
    default: null,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Geçerli bir profil resmi URL formatı giriniz'
    }
  },
  preferences: {
    language: {
      type: String,
      enum: ['tr', 'en'],
      default: 'tr'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      }
    }
  },
  createdBy: {
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

// Virtual field - tam ad
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual field - hesap kilitli mi?
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Middleware - şifreyi kaydetmeden önce hash'le
userSchema.pre('save', async function(next) {
  // Şifre değişmediyse hash'leme
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Şifreyi hash'le
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.lastModified = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware - update işlemlerinde lastModified güncelle
userSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  this.set({ lastModified: new Date() });
  next();
});

// Instance method - şifre doğrulama
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Şifre doğrulama hatası');
  }
};

// Instance method - JWT token oluştur
userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'baybar-api',
      audience: 'baybar-frontend'
    }
  );
};

// Instance method - başarısız giriş denemesini kaydet
userSchema.methods.incLoginAttempts = function() {
  // Eğer hesap kilitliyse ve kilit süresi dolmuşsa sıfırla
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // 5 başarısız denemeden sonra hesabı 2 saat kilitle
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 saat
    };
  }
  
  return this.updateOne(updates);
};

// Instance method - başarılı giriş sonrası sıfırla
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Instance method - kullanıcı özetini getir (güvenli)
userSchema.methods.toSafeObject = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  return userObject;
};

// Static method - aktif kullanıcıları getir
userSchema.statics.findActive = function() {
  return this.find({ isActive: true })
    .select('-password -passwordResetToken -passwordResetExpires')
    .sort({ lastName: 1, firstName: 1 });
};

// Static method - role göre kullanıcıları getir
userSchema.statics.findByRole = function(role) {
  return this.find({ role: role, isActive: true })
    .select('-password -passwordResetToken -passwordResetExpires')
    .sort({ lastName: 1, firstName: 1 });
};

// Index'ler - performans için
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ lockUntil: 1 }, { sparse: true });

// JSON çıktısında virtual field'ları dahil et
userSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.loginAttempts;
    delete ret.lockUntil;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);