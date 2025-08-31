/**
 * Not Found Middleware - 404 hata yönetimi middleware'i
 * @author Senior Web Developer
 * @version 1.0.0
 */

/**
 * 404 Not Found middleware'i
 * Tanımlanmamış rotalar için 404 hatası döndürür
 * @param {Object} req - Express request objesi
 * @param {Object} res - Express response objesi
 * @param {Function} next - Express next fonksiyonu
 */
const notFound = (req, res, next) => {
  const error = new Error(`Sayfa bulunamadı - ${req.originalUrl}`);
  error.statusCode = 404;
  
  // Hata objesini bir sonraki middleware'e (errorHandler) gönder
  next(error);
};

/**
 * API rotaları için özel 404 handler
 * @param {Object} req - Express request objesi
 * @param {Object} res - Express response objesi
 * @param {Function} next - Express next fonksiyonu
 */
const apiNotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint bulunamadı - ${req.method} ${req.originalUrl}`,
    error: {
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
};

/**
 * Statik dosyalar için 404 handler
 * @param {Object} req - Express request objesi
 * @param {Object} res - Express response objesi
 * @param {Function} next - Express next fonksiyonu
 */
const staticNotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Dosya bulunamadı',
    error: {
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    }
  });
};

module.exports = {
  notFound,
  apiNotFound,
  staticNotFound
};