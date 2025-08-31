/**
 * Baybar Kurumsal Tanıtım Sitesi - Auth Middleware
 * JWT token doğrulama ve yetkilendirme middleware'i
 * @author Senior Web Developer
 * @version 1.0.0
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT Token doğrulama middleware'i
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const auth = async (req, res, next) => {
  try {
    // Token'ı header'dan al
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim reddedildi. Token bulunamadı.',
        error: 'NO_TOKEN'
      });
    }

    try {
      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Kullanıcıyı veritabanından getir
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Geçersiz token. Kullanıcı bulunamadı.',
          error: 'USER_NOT_FOUND'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Hesabınız deaktif edilmiştir.',
          error: 'ACCOUNT_DEACTIVATED'
        });
      }

      // Kullanıcı bilgilerini request'e ekle
      req.user = user;
      next();
    } catch (tokenError) {
      console.error('Token doğrulama hatası:', tokenError);
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token.',
        error: 'INVALID_TOKEN'
      });
    }
  } catch (error) {
    console.error('Auth middleware hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
};



/**
 * Rol tabanlı yetkilendirme middleware'i
 * @param {Array} allowedRoles - İzin verilen roller
 * @returns {Function} Middleware function
 */
const roleAuth = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Önce normal auth kontrolü yap
      await auth(req, res, () => {
        // Rol kontrolü
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: 'Erişim reddedildi. Yeterli yetkiniz bulunmamaktadır.',
            error: 'INSUFFICIENT_PERMISSIONS',
            requiredRoles: allowedRoles,
            userRole: req.user.role
          });
        }
        next();
      });
    } catch (error) {
      console.error('Role auth middleware hatası:', error);
      res.status(500).json({
        success: false,
        message: 'Sunucu hatası',
        error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
      });
    }
  };
};

/**
 * Admin yetkilendirme middleware'i
 * Sadece admin rolüne sahip kullanıcıların erişimine izin verir
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const adminAuth = async (req, res, next) => {
  try {
    // Önce normal auth kontrolü yap
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim reddedildi. Admin token bulunamadı.',
        error: 'NO_ADMIN_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz admin token.',
        error: 'INVALID_ADMIN_TOKEN'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin hesabı deaktif edilmiştir.',
        error: 'ADMIN_ACCOUNT_DEACTIVATED'
      });
    }

    // Admin rolü kontrolü
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Erişim reddedildi. Admin yetkisi gereklidir.',
        error: 'ADMIN_ACCESS_REQUIRED',
        userRole: user.role
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware hatası:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz admin token.',
        error: 'INVALID_ADMIN_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Admin token süresi dolmuş.',
        error: 'ADMIN_TOKEN_EXPIRED'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Admin yetkilendirme hatası',
      error: process.env.NODE_ENV === 'development' ? error.message : 'İç sunucu hatası'
    });
  }
};

/**
 * Opsiyonel auth middleware'i (token varsa doğrula, yoksa devam et)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Token yoksa devam et
      req.user = null;
      return next();
    }

    try {
      // Token varsa doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      // Token geçersizse null olarak ayarla
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.error('Optional auth middleware hatası:', error);
    req.user = null;
    next();
  }
};

/**
 * Token oluşturma yardımcı fonksiyonu
 * @param {String} userId - Kullanıcı ID'si
 * @param {String} expiresIn - Token geçerlilik süresi
 * @returns {String} JWT token
 */
const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Refresh token oluşturma
 * @param {String} userId - Kullanıcı ID'si
 * @returns {String} Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Refresh token doğrulama
 * @param {String} refreshToken - Refresh token
 * @returns {Object} Decoded token
 */
const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
};

/**
 * Token'dan kullanıcı ID'si alma
 * @param {String} token - JWT token
 * @returns {String|null} Kullanıcı ID'si
 */
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

/**
 * Token geçerlilik kontrolü
 * @param {String} token - JWT token
 * @returns {Boolean} Token geçerli mi?
 */
const isTokenValid = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  auth,
  roleAuth,
  adminAuth,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  getUserIdFromToken,
  isTokenValid
};

// Varsayılan export
module.exports.default = auth;