/**
 * Content Routes - İçerik yönetimi API rotaları
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// @route   GET /api/content
// @desc    Tüm içerikleri getir
// @access  Public
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('İçerik getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   GET /api/content/:id
// @desc    Belirli bir içeriği getir
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).select('-__v');
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'İçerik bulunamadı'
      });
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('İçerik getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

// @route   POST /api/content
// @desc    Yeni içerik oluştur
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const { title, content, type, category, tags, metaDescription } = req.body;
    
    // Basit validasyon
    if (!title || !content || !type) {
      return res.status(400).json({
        success: false,
        message: 'Başlık, içerik ve tip alanları zorunludur'
      });
    }
    
    const newContent = new Content({
      title,
      content,
      type,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      metaDescription,
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    });
    
    const savedContent = await newContent.save();
    
    res.status(201).json({
      success: true,
      message: 'İçerik başarıyla oluşturuldu',
      data: savedContent
    });
  } catch (error) {
    console.error('İçerik oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

module.exports = router;