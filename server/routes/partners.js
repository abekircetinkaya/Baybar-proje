/**
 * Partners Routes - İş ortakları API rotaları
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const { body, validationResult } = require('express-validator');

// @route   GET /api/partners
// @desc    Tüm iş ortaklarını getir
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status = 'active', limit = 50 } = req.query;
    
    const query = status === 'all' ? {} : { status };
    
    const partners = await Partner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');
    
    res.json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    console.error('İş ortakları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/partners/:id
// @desc    Belirli bir iş ortağını getir
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id).select('-__v');
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'İş ortağı bulunamadı'
      });
    }
    
    res.json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('İş ortağı getirme hatası:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz ID formatı'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/partners
// @desc    Yeni iş ortağı ekle
// @access  Private (Admin)
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('İş ortağı adı 2-100 karakter arasında olmalıdır'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Açıklama en fazla 500 karakter olabilir'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Geçerli bir website URL\'si giriniz'),
  body('logo')
    .optional()
    .isURL()
    .withMessage('Geçerli bir logo URL\'si giriniz'),
  body('category')
    .optional()
    .isIn(['technology', 'finance', 'healthcare', 'education', 'retail', 'manufacturing', 'other'])
    .withMessage('Geçerli bir kategori seçiniz'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Geçerli bir durum seçiniz'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sıra numarası pozitif bir sayı olmalıdır')
], async (req, res) => {
  try {
    // Validasyon hatalarını kontrol et
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }
    
    const { name, description, website, logo, category, status, order, contactInfo } = req.body;
    
    // Aynı isimde iş ortağı var mı kontrol et
    const existingPartner = await Partner.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'Bu isimde bir iş ortağı zaten mevcut'
      });
    }
    
    // Yeni iş ortağı oluştur
    const newPartner = new Partner({
      name,
      description,
      website,
      logo,
      category: category || 'other',
      status: status || 'active',
      order: order || 0,
      contactInfo
    });
    
    const savedPartner = await newPartner.save();
    
    res.status(201).json({
      success: true,
      message: 'İş ortağı başarıyla eklendi',
      data: savedPartner
    });
  } catch (error) {
    console.error('İş ortağı ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PUT /api/partners/:id
// @desc    İş ortağı bilgilerini güncelle
// @access  Private (Admin)
router.put('/:id', [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('İş ortağı adı 2-100 karakter arasında olmalıdır'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Açıklama en fazla 500 karakter olabilir'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Geçerli bir website URL\'si giriniz'),
  body('logo')
    .optional()
    .isURL()
    .withMessage('Geçerli bir logo URL\'si giriniz'),
  body('category')
    .optional()
    .isIn(['technology', 'finance', 'healthcare', 'education', 'retail', 'manufacturing', 'other'])
    .withMessage('Geçerli bir kategori seçiniz'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Geçerli bir durum seçiniz'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Sıra numarası pozitif bir sayı olmalıdır')
], async (req, res) => {
  try {
    // Validasyon hatalarını kontrol et
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası',
        errors: errors.array()
      });
    }
    
    const updateData = { ...req.body, updatedAt: Date.now() };
    
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'İş ortağı bulunamadı'
      });
    }
    
    res.json({
      success: true,
      message: 'İş ortağı başarıyla güncellendi',
      data: partner
    });
  } catch (error) {
    console.error('İş ortağı güncelleme hatası:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz ID formatı'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   DELETE /api/partners/:id
// @desc    İş ortağını sil
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'İş ortağı bulunamadı'
      });
    }
    
    res.json({
      success: true,
      message: 'İş ortağı başarıyla silindi',
      data: { id: partner._id }
    });
  } catch (error) {
    console.error('İş ortağı silme hatası:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz ID formatı'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

module.exports = router;