/**
 * Admin Panel API Routes
 * Tüm admin panel işlemleri için backend route'ları
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Content = require('../models/Content');
const Contact = require('../models/Contact');
const Offer = require('../models/Offer');
const Plan = require('../models/Plan');
const Project = require('../models/Project');
const Partner = require('../models/Partner');
const FAQ = require('../models/FAQ');

// Tüm admin route'ları için adminAuth middleware'ini uygula
router.use(adminAuth);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Dashboard için genel istatistikleri getir
 * @access  Admin
 */
router.get('/dashboard/stats', async (req, res) => {
  try {
    // Paralel olarak tüm istatistikleri getir
    const [userCount, contentCount, contactCount, offerCount, planCount, projectCount] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      Contact.countDocuments(),
      Offer.countDocuments(),
      Plan.countDocuments(),
      Project.countDocuments()
    ]);

    // Son 30 günün verilerini getir
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentUsers, recentContacts, recentOffers] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Contact.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Offer.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    // Aylık trend verileri (son 6 ay)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      const [monthUsers, monthContacts, monthOffers] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } }),
        Contact.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } }),
        Offer.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } })
      ]);
      
      monthlyData.push({
        month: startDate.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        users: monthUsers,
        contacts: monthContacts,
        offers: monthOffers
      });
    }

    res.json({
      success: true,
      data: {
        totalStats: {
          users: userCount,
          contents: contentCount,
          contacts: contactCount,
          offers: offerCount,
          plans: planCount,
          projects: projectCount
        },
        recentStats: {
          users: recentUsers,
          contacts: recentContacts,
          offers: recentOffers
        },
        monthlyTrends: monthlyData
      }
    });
  } catch (error) {
    console.error('Dashboard stats hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard istatistikleri alınırken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Tüm kullanıcıları listele
 * @access  Admin
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    
    // Arama ve filtreleme koşulları
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Kullanıcı listesi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcılar listelenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Kullanıcı rolünü güncelle
 * @access  Admin
 */
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    // Geçerli roller
    const validRoles = ['user', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz rol',
        validRoles
      });
    }

    // Kullanıcıyı bul ve güncelle
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Kullanıcı rolü başarıyla güncellendi',
      data: user
    });
  } catch (error) {
    console.error('Kullanıcı rol güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı rolü güncellenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Kullanıcı durumunu güncelle (aktif/pasif)
 * @access  Admin
 */
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      message: `Kullanıcı ${isActive ? 'aktif' : 'pasif'} edildi`,
      data: user
    });
  } catch (error) {
    console.error('Kullanıcı durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı durumu güncellenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   GET /api/admin/contents
 * @desc    Tüm içerikleri listele
 * @access  Admin
 */
router.get('/contents', async (req, res) => {
  try {
    const { page = 1, limit = 10, pageName = '' } = req.query;
    
    const query = {};
    if (pageName) {
      query.pageName = { $regex: pageName, $options: 'i' };
    }

    const contents = await Content.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      data: {
        contents,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('İçerik listesi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İçerikler listelenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   GET /api/admin/contacts
 * @desc    Tüm iletişim mesajlarını listele
 * @access  Admin
 */
router.get('/contacts', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('İletişim listesi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İletişim mesajları listelenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   PUT /api/admin/contacts/:id/status
 * @desc    İletişim mesajı durumunu güncelle
 * @access  Admin
 */
router.put('/contacts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz durum',
        validStatuses
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
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
      message: 'İletişim mesajı durumu güncellendi',
      data: contact
    });
  } catch (error) {
    console.error('İletişim durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İletişim mesajı durumu güncellenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   GET /api/admin/offers
 * @desc    Tüm teklifleri listele
 * @access  Admin
 */
router.get('/offers', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const offers = await Offer.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Offer.countDocuments(query);

    res.json({
      success: true,
      data: {
        offers,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Teklif listesi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Teklifler listelenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

/**
 * @route   PUT /api/admin/offers/:id/status
 * @desc    Teklif durumunu güncelle
 * @access  Admin
 */
router.put('/offers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'reviewing', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz durum',
        validStatuses
      });
    }

    const offer = await Offer.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Teklif bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Teklif durumu güncellendi',
      data: offer
    });
  } catch (error) {
    console.error('Teklif durum güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Teklif durumu güncellenirken hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
});

module.exports = router;