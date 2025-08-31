/**
 * Baybar Kurumsal Tanıtım Sitesi - Plan Routes
 * Hizmet planları yönetimi API endpoints
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');
const Plan = require('../models/Plan');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation rules
const planValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Plan adı 3-100 karakter arasında olmalıdır'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Başlık 5-200 karakter arasında olmalıdır'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Açıklama 10-1000 karakter arasında olmalıdır'),
  body('category')
    .isIn(['web', 'mobile', 'desktop', 'ai', 'blockchain', 'iot', 'consulting', 'maintenance', 'other'])
    .withMessage('Geçersiz kategori'),
  body('pricing.amount')
    .isFloat({ min: 0 })
    .withMessage('Fiyat 0\'dan büyük olmalıdır'),
  body('pricing.currency')
    .isIn(['TRY', 'USD', 'EUR'])
    .withMessage('Geçersiz para birimi'),
  body('pricing.period')
    .isIn(['one-time', 'monthly', 'yearly', 'hourly', 'daily'])
    .withMessage('Geçersiz fiyatlandırma dönemi'),
  body('features')
    .isArray({ min: 1 })
    .withMessage('En az bir özellik belirtilmelidir'),
  body('deliverables')
    .isArray({ min: 1 })
    .withMessage('En az bir teslimat belirtilmelidir')
];

// @route   GET /api/plans
// @desc    Tüm planları getir (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      popular,
      limit = 12,
      page = 1,
      search,
      sortBy = 'order',
      sortOrder = 'asc',
      minPrice,
      maxPrice
    } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1
    };

    let query = { isActive: true };
    if (category) query.category = category;
    if (popular !== undefined) query.isPopular = popular === 'true';
    
    // Fiyat aralığı filtresi
    if (minPrice || maxPrice) {
      query['pricing.amount'] = {};
      if (minPrice) query['pricing.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.amount'].$lte = parseFloat(maxPrice);
    }

    let plans;
    let total;

    if (search) {
      plans = await Plan.searchPlans(search, options);
      total = await Plan.countDocuments({
        $text: { $search: search },
        ...query
      });
    } else {
      plans = await Plan.find(query)
        .sort({ [sortBy]: options.sortOrder })
        .skip(options.skip)
        .limit(options.limit)
        .populate('createdBy', 'username email')
        .select('-__v');

      total = await Plan.countDocuments(query);
    }

    res.json({
      success: true,
      count: plans.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: plans
    });
  } catch (error) {
    console.error('Plan listesi getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/plans/popular
// @desc    Popüler planları getir
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const plans = await Plan.getPopularPlans(parseInt(limit));
    
    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error('Popüler planlar getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/plans/category/:category
// @desc    Kategoriye göre planları getir
// @access  Public
router.get('/category/:category', [
  param('category').isIn(['web', 'mobile', 'desktop', 'ai', 'blockchain', 'iot', 'consulting', 'maintenance', 'other'])
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
    
    const plans = await Plan.getPlansByCategory(category, parseInt(limit));
    
    res.json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    console.error('Kategori planları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/plans/stats
// @desc    Plan istatistiklerini getir
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Plan.getPlanStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Plan istatistikleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/plans/:id
// @desc    Belirli bir planı getir
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Geçersiz plan ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz plan ID',
        errors: errors.array()
      });
    }

    const plan = await Plan.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .select('-__v');
    
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    // Görüntülenme sayısını artır
    await plan.incrementView();
    
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Plan getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/plans/slug/:slug
// @desc    Slug ile plan getir
// @access  Public
router.get('/slug/:slug', [
  param('slug').isSlug().withMessage('Geçersiz slug')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz slug',
        errors: errors.array()
      });
    }

    const plan = await Plan.findOne({ slug: req.params.slug, isActive: true })
      .populate('createdBy', 'username email')
      .select('-__v');
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    // Görüntülenme sayısını artır
    await plan.incrementView();
    
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Plan getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/plans
// @desc    Yeni plan oluştur
// @access  Private (Admin)
router.post('/', [
  auth,
  upload.single('icon'),
  ...planValidation
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

    const planData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Icon dosya yolunu ekle
    if (req.file) {
      planData.icon = req.file.path;
    }

    const plan = new Plan(planData);
    await plan.save();

    await plan.populate('createdBy', 'username email');
    
    res.status(201).json({
      success: true,
      message: 'Plan başarıyla oluşturuldu',
      data: plan
    });
  } catch (error) {
    console.error('Plan oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PUT /api/plans/:id
// @desc    Planı güncelle
// @access  Private (Admin)
router.put('/:id', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz plan ID'),
  upload.single('icon'),
  ...planValidation
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

    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Icon dosya yolunu güncelle
    if (req.file) {
      updateData.icon = req.file.path;
    }

    Object.assign(plan, updateData);
    await plan.save();

    await plan.populate('createdBy', 'username email');
    await plan.populate('updatedBy', 'username email');
    
    res.json({
      success: true,
      message: 'Plan başarıyla güncellendi',
      data: plan
    });
  } catch (error) {
    console.error('Plan güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PATCH /api/plans/:id/pricing
// @desc    Plan fiyatlandırmasını güncelle
// @access  Private (Admin)
router.patch('/:id/pricing', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz plan ID'),
  body('pricing.amount').isFloat({ min: 0 }).withMessage('Fiyat 0\'dan büyük olmalıdır'),
  body('pricing.currency').isIn(['TRY', 'USD', 'EUR']).withMessage('Geçersiz para birimi')
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

    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    await plan.updatePricing(req.body.pricing, req.user.id);
    
    res.json({
      success: true,
      message: 'Plan fiyatlandırması başarıyla güncellendi',
      data: { pricing: plan.pricing }
    });
  } catch (error) {
    console.error('Plan fiyatlandırma güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PATCH /api/plans/:id/popular
// @desc    Plan popülerlik durumunu değiştir
// @access  Private (Admin)
router.patch('/:id/popular', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz plan ID')
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

    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    await plan.togglePopularity();
    plan.updatedBy = req.user.id;
    await plan.save();
    
    res.json({
      success: true,
      message: `Plan ${plan.isPopular ? 'popüler yapıldı' : 'popülerlikten kaldırıldı'}`,
      data: { isPopular: plan.isPopular }
    });
  } catch (error) {
    console.error('Plan popülerlik güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/plans/:id/purchase
// @desc    Plan satın alma sayısını artır
// @access  Public
router.post('/:id/purchase', [
  param('id').isMongoId().withMessage('Geçersiz plan ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz plan ID',
        errors: errors.array()
      });
    }

    const plan = await Plan.findById(req.params.id);
    
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    await plan.incrementPurchase();
    
    res.json({
      success: true,
      message: 'Satın alma kaydedildi',
      data: { purchaseCount: plan.purchaseCount }
    });
  } catch (error) {
    console.error('Plan satın alma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/plans/:id/testimonials
// @desc    Plana referans ekle
// @access  Private (Admin)
router.post('/:id/testimonials', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz plan ID'),
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('İsim 2-100 karakter arasında olmalıdır'),
  body('comment').trim().isLength({ min: 10, max: 500 }).withMessage('Yorum 10-500 karakter arasında olmalıdır'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Puan 1-5 arasında olmalıdır')
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

    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    await plan.addTestimonial(req.body);
    
    res.json({
      success: true,
      message: 'Referans başarıyla eklendi',
      data: { testimonials: plan.testimonials }
    });
  } catch (error) {
    console.error('Referans ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/plans/:id/faq
// @desc    Plana SSS ekle
// @access  Private (Admin)
router.post('/:id/faq', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz plan ID'),
  body('question').trim().isLength({ min: 5, max: 200 }).withMessage('Soru 5-200 karakter arasında olmalıdır'),
  body('answer').trim().isLength({ min: 10, max: 1000 }).withMessage('Cevap 10-1000 karakter arasında olmalıdır')
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

    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    await plan.addFAQ(req.body);
    
    res.json({
      success: true,
      message: 'SSS başarıyla eklendi',
      data: { faq: plan.faq }
    });
  } catch (error) {
    console.error('SSS ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   DELETE /api/plans/:id
// @desc    Planı sil (soft delete)
// @access  Private (Admin)
router.delete('/:id', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz plan ID')
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

    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan bulunamadı'
      });
    }

    plan.isActive = false;
    plan.updatedBy = req.user.id;
    await plan.save();
    
    res.json({
      success: true,
      message: 'Plan başarıyla silindi'
    });
  } catch (error) {
    console.error('Plan silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});



module.exports = router;