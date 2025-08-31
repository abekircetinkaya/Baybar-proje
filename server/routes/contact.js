/**
 * Contact Routes - İletişim formu API rotaları
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// @route   POST /api/contact
// @desc    İletişim formu gönder
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('İsim 2-50 karakter arasında olmalıdır'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Konu 5-100 karakter arasında olmalıdır'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mesaj 10-1000 karakter arasında olmalıdır'),
  body('phone')
    .optional()
    .isMobilePhone('tr-TR')
    .withMessage('Geçerli bir telefon numarası giriniz')
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
    
    const { name, email, subject, message, phone, company } = req.body;
    
    // Yeni iletişim kaydı oluştur
    const newContact = new Contact({
      name,
      email,
      subject,
      message,
      phone,
      company,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
    
    const savedContact = await newContact.save();
    
    // TODO: E-posta gönderme işlemi burada yapılabilir
    // await sendNotificationEmail(savedContact);
    
    res.status(201).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      data: {
        id: savedContact._id,
        submittedAt: savedContact.createdAt
      }
    });
  } catch (error) {
    console.error('İletişim formu hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/contact
// @desc    Tüm iletişim mesajlarını getir (Admin)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: contacts
    });
  } catch (error) {
    console.error('İletişim mesajları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    İletişim mesajı durumunu güncelle
// @access  Private
router.put('/:id/status', [
  body('status')
    .isIn(['pending', 'read', 'replied', 'archived'])
    .withMessage('Geçerli bir durum seçiniz')
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
    
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'İletişim mesajı bulunamadı'
      });
    }
    
    res.json({
      success: true,
      message: 'Durum başarıyla güncellendi',
      data: contact
    });
  } catch (error) {
    console.error('Durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

module.exports = router;