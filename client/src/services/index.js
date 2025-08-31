/**
 * Services Index
 * Tüm API servislerini tek noktadan export eder
 */

export { default as api } from './api';
export { default as authService } from './authService';
export { default as contentService } from './contentService';
export { default as projectService } from './projectService';
export { default as planService } from './planService';
export { default as offerService } from './offerService';
export { default as blogService } from './blogService';

// Named exports
export {
  apiRequest,
  get,
  post,
  put,
  patch,
  del,
  uploadFile
} from './api';

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Service utilities
export const serviceUtils = {
  /**
   * API hatalarını işle
   * @param {Error} error - Hata objesi
   * @returns {string} - Kullanıcı dostu hata mesajı
   */
  handleApiError: (error) => {
    if (error.message) {
      return error.message;
    }
    
    if (error.response) {
      // HTTP hata yanıtı
      const status = error.response.status;
      switch (status) {
        case 400:
          return 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.';
        case 401:
          return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
        case 403:
          return 'Bu işlem için yetkiniz bulunmuyor.';
        case 404:
          return 'Aradığınız kaynak bulunamadı.';
        case 409:
          return 'Bu kayıt zaten mevcut.';
        case 422:
          return 'Girdiğiniz bilgiler geçersiz.';
        case 429:
          return 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.';
        case 500:
          return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        case 503:
          return 'Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
        default:
          return 'Beklenmeyen bir hata oluştu.';
      }
    }
    
    if (error.request) {
      // Network hatası
      return 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
    }
    
    return 'Bilinmeyen bir hata oluştu.';
  },

  /**
   * Form verilerini API formatına çevir
   * @param {object} formData - Form verileri
   * @returns {object} - API formatında veriler
   */
  formatFormData: (formData) => {
    const formatted = {};
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      // Boş değerleri filtrele
      if (value !== null && value !== undefined && value !== '') {
        // Tarih formatını düzenle
        if (value instanceof Date) {
          formatted[key] = value.toISOString();
        }
        // Array'leri kontrol et
        else if (Array.isArray(value)) {
          formatted[key] = value.filter(item => item !== null && item !== undefined && item !== '');
        }
        // String değerleri trim et
        else if (typeof value === 'string') {
          formatted[key] = value.trim();
        }
        else {
          formatted[key] = value;
        }
      }
    });
    
    return formatted;
  },

  /**
   * Query parametrelerini oluştur
   * @param {object} params - Parametreler
   * @returns {string} - Query string
   */
  buildQueryString: (params) => {
    const filtered = serviceUtils.formatFormData(params);
    return new URLSearchParams(filtered).toString();
  },

  /**
   * Dosya boyutunu formatla
   * @param {number} bytes - Byte cinsinden boyut
   * @returns {string} - Formatlanmış boyut
   */
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Dosya tipini kontrol et
   * @param {File} file - Dosya objesi
   * @param {string[]} allowedTypes - İzin verilen tipler
   * @returns {boolean} - Geçerlilik durumu
   */
  validateFileType: (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  },

  /**
   * Dosya boyutunu kontrol et
   * @param {File} file - Dosya objesi
   * @param {number} maxSize - Maksimum boyut (bytes)
   * @returns {boolean} - Geçerlilik durumu
   */
  validateFileSize: (file, maxSize) => {
    return file.size <= maxSize;
  },

  /**
   * Tarih formatla
   * @param {string|Date} date - Tarih
   * @param {string} format - Format tipi ('date', 'datetime', 'time')
   * @returns {string} - Formatlanmış tarih
   */
  formatDate: (date, format = 'date') => {
    if (!date) return '';
    
    const d = new Date(date);
    const options = {
      date: { year: 'numeric', month: '2-digit', day: '2-digit' },
      datetime: { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      },
      time: { hour: '2-digit', minute: '2-digit' }
    };
    
    return d.toLocaleDateString('tr-TR', options[format]);
  },

  /**
   * Para formatla
   * @param {number} amount - Miktar
   * @param {string} currency - Para birimi
   * @returns {string} - Formatlanmış para
   */
  formatCurrency: (amount, currency = 'TRY') => {
    if (amount === null || amount === undefined) return '';
    
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  /**
   * Sayı formatla
   * @param {number} number - Sayı
   * @returns {string} - Formatlanmış sayı
   */
  formatNumber: (number) => {
    if (number === null || number === undefined) return '';
    
    return new Intl.NumberFormat('tr-TR').format(number);
  }
};

export default {
  serviceUtils
};