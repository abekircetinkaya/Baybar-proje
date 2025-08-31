/**
 * Baybar Kurumsal Tanıtım Sitesi - Project Routes
 * Proje yönetimi API endpoints
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Başlık 3-200 karakter arasında olmalıdır'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Açıklama 10-1000 karakter arasında olmalıdır'),
  body('shortDescription')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Kısa açıklama 10-300 karakter arasında olmalıdır'),
  body('category')
    .isIn(['web', 'mobile', 'desktop', 'ai', 'blockchain', 'iot', 'other'])
    .withMessage('Geçersiz kategori'),
  body('status')
    .optional()
    .isIn(['planning', 'development', 'testing', 'completed', 'maintenance'])
    .withMessage('Geçersiz durum'),
  body('client.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Müşteri adı 2-100 karakter arasında olmalıdır'),
  body('startDate')
    .isISO8601()
    .withMessage('Geçerli bir başlangıç tarihi giriniz'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Geçerli bir bitiş tarihi giriniz')
];

// @route   GET /api/projects
// @desc    Tüm projeleri getir (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status,
      featured,
      limit = 12,
      page = 1,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1
    };

    if (category) options.category = category;
    if (status) options.status = status;
    if (featured !== undefined) options.isFeatured = featured === 'true';

    let projects;
    let total;

    if (search) {
      projects = await Project.searchProjects(search, options);
      total = await Project.countDocuments({
        $text: { $search: search },
        isActive: true,
        ...(category && { category }),
        ...(status && { status }),
        ...(featured !== undefined && { isFeatured: featured === 'true' })
      });
    } else {
      const query = {
        isActive: true,
        ...(category && { category }),
        ...(status && { status }),
        ...(featured !== undefined && { isFeatured: featured === 'true' })
      };

      projects = await Project.find(query)
        .sort({ [sortBy]: options.sortOrder })
        .skip(options.skip)
        .limit(options.limit)
        .populate('createdBy', 'username email')
        .select('-__v');

      total = await Project.countDocuments(query);
    }

    res.json({
      success: true,
      count: projects.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: projects
    });
  } catch (error) {
    console.error('Proje listesi getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/projects/featured
// @desc    Öne çıkan projeleri getir
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const projects = await Project.getFeaturedProjects(parseInt(limit));
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Öne çıkan projeler getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/projects/category/:category
// @desc    Kategoriye göre projeleri getir
// @access  Public
router.get('/category/:category', [
  param('category').isIn(['web', 'mobile', 'desktop', 'ai', 'blockchain', 'iot', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz kategori',
        errors: errors.array()
      });
    }

    const { category } = req.params;
    const { limit = 10 } = req.query;
    
    const projects = await Project.getProjectsByCategory(category, parseInt(limit));
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Kategori projeleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Belirli bir projeyi getir
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Geçersiz proje ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz proje ID',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .select('-__v');
    
    if (!project || !project.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Proje bulunamadı'
      });
    }

    // Görüntülenme sayısını artır
    await project.incrementView();
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Proje getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/projects
// @desc    Yeni proje oluştur
// @access  Private (Admin)
router.post('/', [
  auth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'clientLogo', maxCount: 1 }
  ]),
  ...projectValidation
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const projectData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Dosya yollarını ekle
    if (req.files) {
      if (req.files.image) {
        projectData.image = req.files.image[0].path;
      }
      if (req.files.gallery) {
        projectData.gallery = req.files.gallery.map(file => file.path);
      }
      if (req.files.clientLogo) {
        projectData.client = {
          ...projectData.client,
          logo: req.files.clientLogo[0].path
        };
      }
    }

    const project = new Project(projectData);
    await project.save();

    await project.populate('createdBy', 'username email');
    
    res.status(201).json({
      success: true,
      message: 'Proje başarıyla oluşturuldu',
      data: project
    });
  } catch (error) {
    console.error('Proje oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Projeyi güncelle
// @access  Private (Admin)
router.put('/:id', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz proje ID'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
    { name: 'clientLogo', maxCount: 1 }
  ]),
  ...projectValidation
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proje bulunamadı'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Dosya yollarını güncelle
    if (req.files) {
      if (req.files.image) {
        updateData.image = req.files.image[0].path;
      }
      if (req.files.gallery) {
        updateData.gallery = req.files.gallery.map(file => file.path);
      }
      if (req.files.clientLogo) {
        updateData.client = {
          ...updateData.client,
          logo: req.files.clientLogo[0].path
        };
      }
    }

    Object.assign(project, updateData);
    await project.save();

    await project.populate('createdBy', 'username email');
    await project.populate('updatedBy', 'username email');
    
    res.json({
      success: true,
      message: 'Proje başarıyla güncellendi',
      data: project
    });
  } catch (error) {
    console.error('Proje güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PATCH /api/projects/:id/status
// @desc    Proje durumunu güncelle
// @access  Private (Admin)
router.patch('/:id/status', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz proje ID'),
  body('status').isIn(['planning', 'development', 'testing', 'completed', 'maintenance'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proje bulunamadı'
      });
    }

    await project.updateStatus(req.body.status, req.user.id);
    
    res.json({
      success: true,
      message: 'Proje durumu başarıyla güncellendi',
      data: { status: project.status }
    });
  } catch (error) {
    console.error('Proje durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PATCH /api/projects/:id/featured
// @desc    Proje öne çıkarma durumunu değiştir
// @access  Private (Admin)
router.patch('/:id/featured', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz proje ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proje bulunamadı'
      });
    }

    await project.toggleFeatured();
    project.updatedBy = req.user.id;
    await project.save();
    
    res.json({
      success: true,
      message: `Proje ${project.isFeatured ? 'öne çıkarıldı' : 'öne çıkarmadan kaldırıldı'}`,
      data: { isFeatured: project.isFeatured }
    });
  } catch (error) {
    console.error('Proje öne çıkarma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Projeyi sil (soft delete)
// @access  Private (Admin)
router.delete('/:id', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz proje ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proje bulunamadı'
      });
    }

    project.isActive = false;
    project.updatedBy = req.user.id;
    await project.save();
    
    res.json({
      success: true,
      message: 'Proje başarıyla silindi'
    });
  } catch (error) {
    console.error('Proje silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});



module.exports = router;