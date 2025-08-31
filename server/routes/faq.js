/**
 * Baybar Kurumsal Tanıtım Sitesi - SSS Routes
 * Sıkça Sorulan Sorular API endpoints
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');

// Mock FAQ data for development
let mockFAQs = [
  {
    _id: '1',
    question: 'Baybar hangi hizmetleri sunuyor?',
    answer: 'Baybar olarak kurumsal danışmanlık, dijital dönüşüm, proje yönetimi ve eğitim hizmetleri sunuyoruz.',
    category: 'hizmetler',
    isActive: true,
    order: 1,
    tags: ['hizmetler', 'danışmanlık'],
    viewCount: 45,
    helpfulVotes: { yes: 12, no: 2 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '2',
    question: 'Fiyatlandırma nasıl yapılıyor?',
    answer: 'Fiyatlandırmamız proje kapsamına göre belirlenir. Detaylı bilgi için iletişime geçebilirsiniz.',
    category: 'fiyatlandirma',
    isActive: true,
    order: 2,
    tags: ['fiyat', 'ödeme'],
    viewCount: 32,
    helpfulVotes: { yes: 8, no: 1 },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    _id: '3',
    question: 'Destek hizmetleriniz nelerdir?',
    answer: '7/24 teknik destek, online eğitimler ve dokümantasyon desteği sağlıyoruz.',
    category: 'destek',
    isActive: true,
    order: 3,
    tags: ['destek', 'teknik'],
    viewCount: 28,
    helpfulVotes: { yes: 15, no: 0 },
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  }
];

let nextId = 4;

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation hatası',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/faq
// @desc    Tüm aktif SSS'leri getir
// @access  Public
router.get('/', [
  query('category').optional().isIn(['genel', 'hizmetler', 'fiyatlandirma', 'teknik', 'destek']),
  query('search').optional().isLength({ min: 2, max: 100 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('page').optional().isInt({ min: 1 })
], handleValidationErrors, async (req, res) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * parseInt(limit);

    let filteredFAQs = mockFAQs.filter(faq => faq.isActive);

    // Apply category filter
    if (category) {
      filteredFAQs = filteredFAQs.filter(faq => faq.category === category);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredFAQs = filteredFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by order
    filteredFAQs.sort((a, b) => a.order - b.order);

    // Apply pagination
    const total = filteredFAQs.length;
    const faqs = filteredFAQs.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: faqs,
      pagination: {
        current: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('SSS getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/faq/categories
// @desc    Kategorilere göre SSS sayılarını getir
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categoryMap = {
      'genel': 'Genel',
      'hizmetler': 'Hizmetler',
      'fiyatlandirma': 'Fiyatlandırma',
      'teknik': 'Teknik',
      'destek': 'Destek'
    };

    const categories = {};
    mockFAQs.filter(faq => faq.isActive).forEach(faq => {
      categories[faq.category] = (categories[faq.category] || 0) + 1;
    });

    const result = Object.keys(categories).map(key => ({
      key,
      name: categoryMap[key] || key,
      count: categories[key]
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Kategori getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// @route   GET /api/faq/stats
// @desc    Admin için SSS istatistikleri
// @access  Private (Admin)
router.get('/stats', async (req, res) => {
  try {
    const totalFAQs = mockFAQs.length;
    const activeFAQs = mockFAQs.filter(faq => faq.isActive).length;
    const totalViews = mockFAQs.reduce((sum, faq) => sum + faq.viewCount, 0);
    const totalHelpfulVotes = mockFAQs.reduce((sum, faq) => sum + faq.helpfulVotes.yes, 0);

    res.json({
      success: true,
      data: {
        totalFAQs,
        activeFAQs,
        inactiveFAQs: totalFAQs - activeFAQs,
        totalViews,
        totalHelpfulVotes,
        averageHelpfulness: totalFAQs > 0 ? (totalHelpfulVotes / totalFAQs).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// @route   POST /api/faq
// @desc    Yeni SSS oluştur
// @access  Private (Admin)
router.post('/', [
  body('question').notEmpty().withMessage('Soru gereklidir').isLength({ min: 10, max: 500 }),
  body('answer').notEmpty().withMessage('Cevap gereklidir').isLength({ min: 10, max: 2000 }),
  body('category').isIn(['genel', 'hizmetler', 'fiyatlandirma', 'teknik', 'destek']),
  body('tags').optional().isArray(),
  body('order').optional().isInt({ min: 1 })
], handleValidationErrors, async (req, res) => {
  try {
    const { question, answer, category, tags = [], order } = req.body;

    const newFAQ = {
      _id: nextId.toString(),
      question,
      answer,
      category,
      isActive: true,
      order: order || nextId,
      tags,
      viewCount: 0,
      helpfulVotes: { yes: 0, no: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockFAQs.push(newFAQ);
    nextId++;

    res.status(201).json({
      success: true,
      message: 'SSS başarıyla oluşturuldu',
      data: newFAQ
    });
  } catch (error) {
    console.error('SSS oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// @route   PUT /api/faq/:id
// @desc    SSS güncelle
// @access  Private (Admin)
router.put('/:id', [
  param('id').notEmpty(),
  body('question').optional().isLength({ min: 10, max: 500 }),
  body('answer').optional().isLength({ min: 10, max: 2000 }),
  body('category').optional().isIn(['genel', 'hizmetler', 'fiyatlandirma', 'teknik', 'destek']),
  body('isActive').optional().isBoolean(),
  body('tags').optional().isArray(),
  body('order').optional().isInt({ min: 1 })
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const faqIndex = mockFAQs.findIndex(faq => faq._id === id);
    if (faqIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'SSS bulunamadı'
      });
    }

    mockFAQs[faqIndex] = {
      ...mockFAQs[faqIndex],
      ...updates,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'SSS başarıyla güncellendi',
      data: mockFAQs[faqIndex]
    });
  } catch (error) {
    console.error('SSS güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// @route   DELETE /api/faq/:id
// @desc    SSS sil
// @access  Private (Admin)
router.delete('/:id', [
  param('id').notEmpty()
], handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;

    const faqIndex = mockFAQs.findIndex(faq => faq._id === id);
    if (faqIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'SSS bulunamadı'
      });
    }

    mockFAQs.splice(faqIndex, 1);

    res.json({
      success: true,
      message: 'SSS başarıyla silindi'
    });
  } catch (error) {
    console.error('SSS silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

module.exports = router;