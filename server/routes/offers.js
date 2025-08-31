/**
 * Baybar Kurumsal Tanıtım Sitesi - Offer Routes
 * Teklif yönetimi API endpoints
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');
const Offer = require('../models/Offer');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Validation rules
const offerValidation = [
  body('project.type')
    .isIn(['web', 'mobile', 'desktop', 'ai', 'blockchain', 'iot', 'consulting', 'other'])
    .withMessage('Geçersiz proje tipi'),
  body('project.description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Proje açıklaması 10-2000 karakter arasında olmalıdır'),
  body('project.requirements')
    .isArray({ min: 1 })
    .withMessage('En az bir gereksinim belirtilmelidir'),
  body('project.timeline.duration')
    .isInt({ min: 1, max: 365 })
    .withMessage('Süre 1-365 gün arasında olmalıdır'),
  body('project.timeline.unit')
    .isIn(['days', 'weeks', 'months'])
    .withMessage('Geçersiz zaman birimi'),
  body('project.budget.min')
    .isFloat({ min: 0 })
    .withMessage('Minimum bütçe 0\'dan büyük olmalıdır'),
  body('project.budget.max')
    .isFloat({ min: 0 })
    .withMessage('Maksimum bütçe 0\'dan büyük olmalıdır'),
  body('contact.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalıdır'),
  body('contact.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalıdır'),
  body('contact.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('contact.phone')
    .isMobilePhone('tr-TR')
    .withMessage('Geçerli bir telefon numarası giriniz')
];

// @route   POST /api/offers
// @desc    Yeni teklif talebi oluştur
// @access  Public
router.post('/', [
  upload.array('attachments', 5),
  ...offerValidation
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

    const offerData = {
      ...req.body,
      source: req.body.source || 'website'
    };

    // Dosya yollarını ekle
    if (req.files && req.files.length > 0) {
      offerData.attachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size
      }));
    }

    const offer = new Offer(offerData);
    await offer.save();

    // E-posta bildirimi gönder
    try {
      const emailContent = `
        Yeni Teklif Talebi Alındı
        
        Proje Tipi: ${offer.project.type}
        Açıklama: ${offer.project.description}
        
        İletişim Bilgileri:
        Ad Soyad: ${offer.contact.firstName} ${offer.contact.lastName}
        E-posta: ${offer.contact.email}
        Telefon: ${offer.contact.phone}
        ${offer.contact.company ? `Şirket: ${offer.contact.company}` : ''}
        
        Bütçe: ${offer.project.budget.min} - ${offer.project.budget.max} ${offer.project.budget.currency}
        Süre: ${offer.project.timeline.duration} ${offer.project.timeline.unit}
        
        Teklif ID: ${offer._id}
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.EMAIL_FROM,
        subject: 'Yeni Teklif Talebi',
        text: emailContent
      });

      // Müşteriye otomatik yanıt
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: offer.contact.email,
        subject: 'Teklif Talebiniz Alındı',
        text: `Merhaba ${offer.contact.firstName},\n\nTeklif talebiniz başarıyla alınmıştır. En kısa sürede size dönüş yapacağız.\n\nTeşekkürler,\nBaybar Kurumsal`
      });
    } catch (emailError) {
      console.error('E-posta gönderme hatası:', emailError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Teklif talebiniz başarıyla alınmıştır. En kısa sürede size dönüş yapacağız.',
      data: {
        id: offer._id,
        referenceNumber: offer.referenceNumber
      }
    });
  } catch (error) {
    console.error('Teklif oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/offers
// @desc    Tüm teklifleri getir (admin)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      priority,
      source,
      limit = 20,
      page = 1,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dateFrom,
      dateTo
    } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1
    };

    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (source) query.source = source;
    
    // Tarih aralığı filtresi
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    let offers;
    let total;

    if (search) {
      query.$or = [
        { 'contact.firstName': { $regex: search, $options: 'i' } },
        { 'contact.lastName': { $regex: search, $options: 'i' } },
        { 'contact.email': { $regex: search, $options: 'i' } },
        { 'contact.company': { $regex: search, $options: 'i' } },
        { 'project.description': { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } }
      ];
    }

    offers = await Offer.find(query)
      .sort({ [sortBy]: options.sortOrder })
      .skip(options.skip)
      .limit(options.limit)
      .populate('assignedTo', 'username email')
      .select('-__v');

    total = await Offer.countDocuments(query);

    res.json({
      success: true,
      count: offers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: offers
    });
  } catch (error) {
    console.error('Teklif listesi getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/offers/stats
// @desc    Teklif istatistiklerini getir
// @access  Private (Admin)
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Offer.getOfferStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Teklif istatistikleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/offers/:id
// @desc    Belirli bir teklifi getir
// @access  Private (Admin)
router.get('/:id', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz teklif ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz teklif ID',
        errors: errors.array()
      });
    }

    const offer = await Offer.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .select('-__v');
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }
    
    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Teklif getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PUT /api/offers/:id
// @desc    Teklifi güncelle
// @access  Private (Admin)
router.put('/:id', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz teklif ID')
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

    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    Object.assign(offer, updateData);
    await offer.save();

    await offer.populate('assignedTo', 'username email');
    
    res.json({
      success: true,
      message: 'Teklif başarıyla güncellendi',
      data: offer
    });
  } catch (error) {
    console.error('Teklif güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PATCH /api/offers/:id/status
// @desc    Teklif durumunu güncelle
// @access  Private (Admin)
router.patch('/:id/status', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz teklif ID'),
  body('status').isIn(['new', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'])
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

    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }

    await offer.updateStatus(req.body.status, req.user.id);
    
    res.json({
      success: true,
      message: 'Teklif durumu başarıyla güncellendi',
      data: { status: offer.status }
    });
  } catch (error) {
    console.error('Teklif durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PATCH /api/offers/:id/assign
// @desc    Teklifi kullanıcıya ata
// @access  Private (Admin)
router.patch('/:id/assign', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz teklif ID'),
  body('assignedTo').isMongoId().withMessage('Geçersiz kullanıcı ID')
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

    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }

    offer.assignedTo = req.body.assignedTo;
    offer.updatedAt = new Date();
    await offer.save();

    await offer.populate('assignedTo', 'username email');
    
    res.json({
      success: true,
      message: 'Teklif başarıyla atandı',
      data: { assignedTo: offer.assignedTo }
    });
  } catch (error) {
    console.error('Teklif atama hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/offers/:id/notes
// @desc    Teklife not ekle
// @access  Private (Admin)
router.post('/:id/notes', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz teklif ID'),
  body('note').trim().isLength({ min: 1, max: 1000 }).withMessage('Not 1-1000 karakter arasında olmalıdır')
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

    const offer = await Offer.findById(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }

    await offer.addNote(req.body.note, req.user.id);
    
    res.json({
      success: true,
      message: 'Not başarıyla eklendi',
      data: { notes: offer.notes }
    });
  } catch (error) {
    console.error('Not ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   DELETE /api/offers/:id
// @desc    Teklifi sil
// @access  Private (Admin)
router.delete('/:id', [
  auth,
  param('id').isMongoId().withMessage('Geçersiz teklif ID')
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

    const offer = await Offer.findByIdAndDelete(req.params.id);
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }
    
    res.json({
      success: true,
      message: 'Teklif başarıyla silindi'
    });
  } catch (error) {
    console.error('Teklif silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

module.exports = router;