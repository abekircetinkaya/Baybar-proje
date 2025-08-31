/**
 * Baybar Kurumsal Tanıtım Sitesi - Upload Middleware
 * Dosya yükleme middleware'i - Multer konfigürasyonu
 * @author Senior Web Developer
 * @version 1.0.0
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Upload dizinlerini oluştur
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/images',
    'uploads/documents',
    'uploads/projects',
    'uploads/plans',
    'uploads/offers',
    'uploads/temp'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Upload dizinlerini oluştur
createUploadDirs();

// Dosya türü kontrolü
const fileFilter = (req, file, cb) => {
  // İzin verilen dosya türleri
  const allowedTypes = {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    archive: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed']
  };

  const allAllowedTypes = [...allowedTypes.image, ...allowedTypes.document, ...allowedTypes.archive];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Desteklenmeyen dosya türü: ${file.mimetype}`), false);
  }
};

// Dosya adı oluşturma
const generateFileName = (originalname) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(6).toString('hex');
  const ext = path.extname(originalname);
  const nameWithoutExt = path.basename(originalname, ext);
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${timestamp}_${randomString}_${sanitizedName}${ext}`;
};

// Storage konfigürasyonu
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/temp';
    
    // Dosya türüne göre klasör belirleme
    if (file.mimetype.startsWith('image/')) {
      uploadPath = 'uploads/images';
    } else if (file.mimetype === 'application/pdf' || 
               file.mimetype === 'application/msword' || 
               file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.mimetype === 'text/plain') {
      uploadPath = 'uploads/documents';
    }
    
    // Route'a göre alt klasör belirleme
    if (req.route && req.route.path) {
      if (req.route.path.includes('projects')) {
        uploadPath = path.join(uploadPath, 'projects');
      } else if (req.route.path.includes('plans')) {
        uploadPath = path.join(uploadPath, 'plans');
      } else if (req.route.path.includes('offers')) {
        uploadPath = path.join(uploadPath, 'offers');
      }
    }
    
    // Klasörü oluştur
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  }
});

// Dosya boyutu limitleri (bytes)
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
  files: 10 // Maksimum dosya sayısı
};

// Ana upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

// Hata yakalama middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.',
          error: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Çok fazla dosya. Maksimum 10 dosya yükleyebilirsiniz.',
          error: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Beklenmeyen dosya alanı.',
          error: 'UNEXPECTED_FIELD'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Dosya yükleme hatası.',
          error: error.code
        });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Dosya yükleme hatası.',
      error: 'UPLOAD_ERROR'
    });
  }
  next();
};

// Dosya silme yardımcı fonksiyonu
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Dosya silme hatası:', error);
    return false;
  }
};

// Çoklu dosya silme
const deleteFiles = (filePaths) => {
  const results = [];
  filePaths.forEach(filePath => {
    results.push(deleteFile(filePath));
  });
  return results;
};

// Dosya boyutu formatı
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Dosya bilgisi alma
const getFileInfo = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        exists: true,
        size: stats.size,
        formattedSize: formatFileSize(stats.size),
        created: stats.birthtime,
        modified: stats.mtime,
        extension: path.extname(filePath),
        name: path.basename(filePath)
      };
    }
    return { exists: false };
  } catch (error) {
    console.error('Dosya bilgisi alma hatası:', error);
    return { exists: false, error: error.message };
  }
};

// Geçici dosyaları temizleme (24 saatten eski)
const cleanupTempFiles = () => {
  const tempDir = 'uploads/temp';
  const maxAge = 24 * 60 * 60 * 1000; // 24 saat
  
  try {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          deleteFile(filePath);
          console.log(`Geçici dosya silindi: ${file}`);
        }
      });
    }
  } catch (error) {
    console.error('Geçici dosya temizleme hatası:', error);
  }
};

// Her 6 saatte bir geçici dosyaları temizle
setInterval(cleanupTempFiles, 6 * 60 * 60 * 1000);

// Özel upload middleware'leri
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (error) => {
      handleUploadError(error, req, res, next);
    });
  };
};

const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (error) => {
      handleUploadError(error, req, res, next);
    });
  };
};

const uploadFields = (fields) => {
  return (req, res, next) => {
    upload.fields(fields)(req, res, (error) => {
      handleUploadError(error, req, res, next);
    });
  };
};

// Ana export
module.exports = upload;

// Ek export'lar
module.exports.single = uploadSingle;
module.exports.multiple = uploadMultiple;
module.exports.fields = uploadFields;
module.exports.deleteFile = deleteFile;
module.exports.deleteFiles = deleteFiles;
module.exports.getFileInfo = getFileInfo;
module.exports.formatFileSize = formatFileSize;
module.exports.cleanupTempFiles = cleanupTempFiles;
module.exports.handleUploadError = handleUploadError;

// Dosya türü kontrol fonksiyonları
module.exports.isImage = (mimetype) => {
  return mimetype.startsWith('image/');
};

module.exports.isDocument = (mimetype) => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  return documentTypes.includes(mimetype);
};

module.exports.isArchive = (mimetype) => {
  const archiveTypes = [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ];
  return archiveTypes.includes(mimetype);
};