/**
 * Error Handler Middleware - Hata yönetimi middleware'i
 * @author Senior Web Developer
 * @version 1.0.0
 */

/**
 * Global hata yakalama middleware'i
 * @param {Error} err - Hata objesi
 * @param {Object} req - Express request objesi
 * @param {Object} res - Express response objesi
 * @param {Function} next - Express next fonksiyonu
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Konsola hata logla
  console.error('Error Handler:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Geçersiz ID formatı';
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Bu ${field} zaten kullanılıyor`;
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Geçersiz token';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token süresi dolmuş';
    error = {
      message,
      statusCode: 401
    };
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    const message = 'Veritabanı bağlantı hatası';
    error = {
      message,
      statusCode: 503
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Dosya boyutu çok büyük';
    error = {
      message,
      statusCode: 413
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Çok fazla dosya yüklendi';
    error = {
      message,
      statusCode: 413
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyiniz';
    error = {
      message,
      statusCode: 429
    };
  }

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    const message = 'CORS hatası: Bu kaynağa erişim izni yok';
    error = {
      message,
      statusCode: 403
    };
  }

  // Syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    const message = 'Geçersiz JSON formatı';
    error = {
      message,
      statusCode: 400
    };
  }

  // Default error response
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Sunucu hatası';

  // Error response objesi
  const errorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
      details: {
        name: err.name,
        code: err.code,
        statusCode: err.statusCode
      }
    })
  };

  // Özel hata türleri için ek bilgiler
  if (err.name === 'ValidationError' && process.env.NODE_ENV === 'development') {
    errorResponse.validationErrors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
  }

  // Response gönder
  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 * @param {Object} req - Express request objesi
 * @param {Object} res - Express response objesi
 * @param {Function} next - Express next fonksiyonu
 */
const notFound = (req, res, next) => {
  const error = new Error(`Sayfa bulunamadı - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Async hataları yakalama wrapper'ı
 * @param {Function} fn - Async fonksiyon
 * @returns {Function} - Wrapped fonksiyon
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Özel hata sınıfı
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  AppError
};