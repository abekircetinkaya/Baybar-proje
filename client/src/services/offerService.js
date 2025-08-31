/**
 * Offer API Service
 * Teklif yönetimi için API servisleri
 */

import { get, post, put, patch, del, uploadFile } from './api';

const OFFERS_ENDPOINT = '/offers';

export const offerService = {
  /**
   * Yeni teklif talebi oluştur
   * @param {object} offerData - Teklif verileri
   * @param {File[]} files - Ek dosyalar
   * @returns {Promise} - Oluşturulan teklif
   */
  create: (offerData, files = []) => {
    if (files.length > 0) {
      const formData = new FormData();
      
      // Teklif verilerini ekle
      Object.keys(offerData).forEach(key => {
        if (Array.isArray(offerData[key])) {
          offerData[key].forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else if (typeof offerData[key] === 'object') {
          formData.append(key, JSON.stringify(offerData[key]));
        } else {
          formData.append(key, offerData[key]);
        }
      });
      
      // Dosyaları ekle
      files.forEach((file) => {
        formData.append('attachments', file);
      });
      
      return uploadFile(OFFERS_ENDPOINT, formData);
    } else {
      return post(OFFERS_ENDPOINT, offerData);
    }
  },

  /**
   * Tüm teklifleri getir
   * @param {object} params - Filtreleme ve sayfalama parametreleri
   * @returns {Promise} - Teklifler listesi
   */
  getAll: (params = {}) => {
    return get(OFFERS_ENDPOINT, params);
  },

  /**
   * Teklif istatistiklerini getir
   * @returns {Promise} - Teklif istatistikleri
   */
  getStats: () => {
    return get(`${OFFERS_ENDPOINT}/stats`);
  },

  /**
   * Belirli bir teklifi getir
   * @param {string} id - Teklif ID'si
   * @returns {Promise} - Teklif detayları
   */
  getById: (id) => {
    return get(`${OFFERS_ENDPOINT}/${id}`);
  },

  /**
   * Teklifi güncelle
   * @param {string} id - Teklif ID'si
   * @param {object} offerData - Güncellenecek veriler
   * @returns {Promise} - Güncellenmiş teklif
   */
  update: (id, offerData) => {
    return put(`${OFFERS_ENDPOINT}/${id}`, offerData);
  },

  /**
   * Teklif durumunu güncelle
   * @param {string} id - Teklif ID'si
   * @param {string} status - Yeni durum (pending, reviewing, approved, rejected, completed)
   * @returns {Promise} - Güncellenmiş teklif
   */
  updateStatus: (id, status) => {
    return patch(`${OFFERS_ENDPOINT}/${id}/status`, { status });
  },

  /**
   * Teklifi kullanıcıya ata
   * @param {string} id - Teklif ID'si
   * @param {string} userId - Kullanıcı ID'si
   * @returns {Promise} - Güncellenmiş teklif
   */
  assignToUser: (id, userId) => {
    return patch(`${OFFERS_ENDPOINT}/${id}/assign`, { assignedTo: userId });
  },

  /**
   * Teklife not ekle
   * @param {string} id - Teklif ID'si
   * @param {string} note - Eklenecek not
   * @returns {Promise} - Güncellenmiş teklif
   */
  addNote: (id, note) => {
    return post(`${OFFERS_ENDPOINT}/${id}/notes`, { note });
  },

  /**
   * Teklifi sil
   * @param {string} id - Teklif ID'si
   * @returns {Promise} - Silme sonucu
   */
  delete: (id) => {
    return del(`${OFFERS_ENDPOINT}/${id}`);
  },

  /**
   * Durum bazında teklifleri getir
   * @param {string} status - Teklif durumu
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Filtrelenmiş teklifler
   */
  getByStatus: (status, params = {}) => {
    return get(OFFERS_ENDPOINT, {
      status,
      ...params
    });
  },

  /**
   * Öncelik bazında teklifleri getir
   * @param {string} priority - Öncelik seviyesi (low, medium, high, urgent)
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Filtrelenmiş teklifler
   */
  getByPriority: (priority, params = {}) => {
    return get(OFFERS_ENDPOINT, {
      priority,
      ...params
    });
  },

  /**
   * Tarih aralığına göre teklifleri getir
   * @param {string} startDate - Başlangıç tarihi
   * @param {string} endDate - Bitiş tarihi
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Filtrelenmiş teklifler
   */
  getByDateRange: (startDate, endDate, params = {}) => {
    return get(OFFERS_ENDPOINT, {
      startDate,
      endDate,
      ...params
    });
  },

  /**
   * Teklif arama
   * @param {string} query - Arama sorgusu
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Arama sonuçları
   */
  search: (query, params = {}) => {
    return get(OFFERS_ENDPOINT, {
      search: query,
      ...params
    });
  },

  /**
   * Proje tipine göre teklifleri getir
   * @param {string} projectType - Proje tipi
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Filtrelenmiş teklifler
   */
  getByProjectType: (projectType, params = {}) => {
    return get(OFFERS_ENDPOINT, {
      projectType,
      ...params
    });
  },

  /**
   * Bütçe aralığına göre teklifleri getir
   * @param {number} minBudget - Minimum bütçe
   * @param {number} maxBudget - Maksimum bütçe
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Filtrelenmiş teklifler
   */
  getByBudgetRange: (minBudget, maxBudget, params = {}) => {
    return get(OFFERS_ENDPOINT, {
      minBudget,
      maxBudget,
      ...params
    });
  },

  /**
   * Takip edilecek teklifleri getir
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Takip edilecek teklifler
   */
  getFollowUps: (params = {}) => {
    const today = new Date().toISOString().split('T')[0];
    return get(OFFERS_ENDPOINT, {
      followUpDate: today,
      ...params
    });
  },

  /**
   * Teklif kaynaklarını getir
   * @returns {Promise} - Teklif kaynakları listesi
   */
  getSources: () => {
    return get(`${OFFERS_ENDPOINT}/sources`);
  },

  /**
   * Teklif durumlarını getir
   * @returns {Promise} - Teklif durumları listesi
   */
  getStatuses: () => {
    return get(`${OFFERS_ENDPOINT}/statuses`);
  }
};

export default offerService;