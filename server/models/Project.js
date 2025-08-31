/**
 * Baybar Kurumsal Tanıtım Sitesi - Project Model
 * Proje portföyü için MongoDB şeması
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');

// Teknoloji şeması
const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Teknoloji adı gereklidir'],
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3b82f6'
  }
}, { _id: false });

// Proje şeması
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Proje başlığı gereklidir'],
    trim: true,
    maxlength: [200, 'Başlık 200 karakterden uzun olamaz']
  },
  description: {
    type: String,
    required: [true, 'Proje açıklaması gereklidir'],
    trim: true,
    maxlength: [1000, 'Açıklama 1000 karakterden uzun olamaz']
  },
  shortDescription: {
    type: String,
    required: [true, 'Kısa açıklama gereklidir'],
    trim: true,
    maxlength: [300, 'Kısa açıklama 300 karakterden uzun olamaz']
  },
  image: {
    type: String,
    required: [true, 'Proje görseli gereklidir'],
    trim: true
  },
  gallery: [{
    type: String,
    trim: true
  }],
  technologies: [technologySchema],
  category: {
    type: String,
    required: [true, 'Kategori gereklidir'],
    enum: {
      values: ['web', 'mobile', 'desktop', 'ai', 'blockchain', 'iot', 'other'],
      message: 'Geçersiz kategori seçimi'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['planning', 'development', 'testing', 'completed', 'maintenance'],
      message: 'Geçersiz durum seçimi'
    },
    default: 'planning'
  },
  client: {
    name: {
      type: String,
      required: [true, 'Müşteri adı gereklidir'],
      trim: true
    },
    logo: {
      type: String,
      trim: true
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
    }
  },
  projectUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Geçerli bir URL formatı giriniz'
    }
  },
  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Geçerli bir URL formatı giriniz'
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Başlangıç tarihi gereklidir']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= this.startDate;
      },
      message: 'Bitiş tarihi başlangıç tarihinden önce olamaz'
    }
  },
  duration: {
    type: String,
    trim: true
  },
  teamSize: {
    type: Number,
    min: [1, 'Takım büyüklüğü en az 1 olmalıdır'],
    max: [100, 'Takım büyüklüğü en fazla 100 olabilir']
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
    }
  },
  features: [{
    title: {
      type: String,
      required: [true, 'Özellik başlığı gereklidir'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Özellik açıklaması gereklidir'],
      trim: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  challenges: [{
    title: {
      type: String,
      required: [true, 'Zorluk başlığı gereklidir'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Zorluk açıklaması gereklidir'],
      trim: true
    },
    solution: {
      type: String,
      trim: true
    }
  }],
  metrics: {
    performance: {
      type: String,
      trim: true
    },
    userSatisfaction: {
      type: Number,
      min: [0, 'Kullanıcı memnuniyeti 0-100 arasında olmalıdır'],
      max: [100, 'Kullanıcı memnuniyeti 0-100 arasında olmalıdır']
    },
    roi: {
      type: Number,
      min: [0, 'ROI 0 veya daha büyük olmalıdır']
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
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

// Virtual fields
projectSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

projectSchema.virtual('progress').get(function() {
  if (this.features.length === 0) return 0;
  const completedFeatures = this.features.filter(f => f.isCompleted).length;
  return Math.round((completedFeatures / this.features.length) * 100);
});

projectSchema.virtual('durationInDays').get(function() {
  if (!this.startDate || !this.endDate) return null;
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Indexes
projectSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ isFeatured: 1, isActive: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ order: 1 });
projectSchema.index({ tags: 1 });

// Middleware
projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.title = this.title.trim();
  }
  if (this.isModified('description')) {
    this.description = this.description.trim();
  }
  next();
});

// Static methods
projectSchema.statics.getFeaturedProjects = function(limit = 6) {
  // MongoDB bağlantısı yoksa mock veri kullan
  if (mongoose.connection.readyState !== 1) {
    try {
      const fs = require('fs');
      const path = require('path');
      const mockDataPath = path.join(__dirname, '..', 'data', 'mockProjects.json');
      
      if (fs.existsSync(mockDataPath)) {
        const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
        const featuredProjects = mockData
          .filter(project => project.isFeatured && project.isActive)
          .sort((a, b) => a.order - b.order)
          .slice(0, limit);
        
        return Promise.resolve(featuredProjects);
      }
    } catch (error) {
      console.log('Mock veri okunamadı:', error.message);
    }
    
    // Mock veri yoksa boş array döndür
    return Promise.resolve([]);
  }
  
  // Normal MongoDB sorgusu
  return this.find({ isFeatured: true, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'username email')
    .select('-__v');
};

projectSchema.statics.getProjectsByCategory = function(category, limit = 10) {
  return this.find({ category, isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'username email')
    .select('-__v');
};

projectSchema.statics.searchProjects = function(searchTerm, options = {}) {
  const {
    category,
    status,
    isFeatured,
    limit = 20,
    skip = 0,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;

  let query = { isActive: true };

  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  if (typeof isFeatured === 'boolean') {
    query.isFeatured = isFeatured;
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

// Instance methods
projectSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

projectSchema.methods.toggleFeatured = function() {
  this.isFeatured = !this.isFeatured;
  return this.save();
};

projectSchema.methods.updateStatus = function(newStatus, userId) {
  this.status = newStatus;
  this.updatedBy = userId;
  return this.save();
};

module.exports = mongoose.model('Project', projectSchema);