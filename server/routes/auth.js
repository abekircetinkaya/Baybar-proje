/**
 * Auth Routes - Kimlik doğrulama API rotaları
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Kullanıcı kaydı
// @access  Public (Geliştirme aşamasında)
router.post('/register', [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Ad 2-50 karakter arasında olmalıdır'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Soyad 2-50 karakter arasında olmalıdır'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Kullanıcı adı 3-30 karakter arasında olmalıdır')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir')
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
    
    const { firstName, lastName, username, email, password } = req.body;
    
    // Kullanıcının zaten var olup olmadığını kontrol et
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      const field = existingUser.email === email ? 'e-posta adresi' : 'kullanıcı adı';
      return res.status(400).json({
        success: false,
        message: `Bu ${field} zaten kullanılıyor`
      });
    }
    
    // Yeni kullanıcı oluştur (şifre User modelindeki pre-save middleware ile hash'lenecek)
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password, // Ham şifre - middleware tarafından hash'lenecek
      role: 'editor' // İlk kullanıcı editor olsun
    });
    
    const savedUser = await newUser.save();
    
    // JWT token oluştur
    const payload = {
      id: savedUser._id
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'baybar-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        fullName: savedUser.fullName
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Kullanıcı girişi
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Geçerli bir e-posta adresi giriniz'),
  body('password')
    .exists()
    .withMessage('Şifre gereklidir')
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
    
    const { email, password } = req.body;
    
    // Kullanıcıyı bul
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }
    
    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz e-posta veya şifre'
      });
    }
    
    // Son giriş tarihini güncelle
    user.lastLogin = new Date();
    await user.save();
    
    // JWT token oluştur
    const payload = {
      id: user._id
    };
    
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'baybar-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Mevcut kullanıcı bilgilerini getir
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Kullanıcı bilgisi getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

module.exports = router;