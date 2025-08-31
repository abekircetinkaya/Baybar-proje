/**
 * Plan API Service
 * Hizmet planları yönetimi için API servisleri
 */

import { get, post, put, patch, del, uploadFile } from './api';

const PLANS_ENDPOINT = '/plans';

export const planService = {
  /**
   * Tüm planları getir
   * @param {object} params - Filtreleme parametreleri
   * @returns {Promise} - Planlar listesi
   */
  getAll: (params = {}) => {
    return get(PLANS_ENDPOINT, params);
  },

  /**
   * Popüler planları getir
   * @param {number} limit - Maksimum plan sayısı
   * @returns {Promise} - Popüler planlar
   */
  getPopular: (limit = 3) => {
    return get(`${PLANS_ENDPOINT}/popular`, { limit });
  },

  /**
   * Kategoriye göre planları getir
   * @param {string} category - Kategori adı
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Kategori planları
   */
  getByCategory: (category, params = {}) => {
    return get(`${PLANS_ENDPOINT}/category/${category}`, params);
  },

  /**
   * Belirli bir planı getir (ID ile)
   * @param {string} id - Plan ID'si
   * @returns {Promise} - Plan detayları
   */
  getById: (id) => {
    return get(`${PLANS_ENDPOINT}/${id}`);
  },

  /**
   * Belirli bir planı getir (slug ile)
   * @param {string} slug - Plan slug'ı
   * @returns {Promise} - Plan detayları
   */
  getBySlug: (slug) => {
    return get(`${PLANS_ENDPOINT}/slug/${slug}`);
  },

  /**
   * Plan istatistiklerini getir
   * @returns {Promise} - Plan istatistikleri
   */
  getStats: () => {
    return get(`${PLANS_ENDPOINT}/stats`);
  },

  /**
   * Yeni plan oluştur
   * @param {object} planData - Plan verileri
   * @param {File} iconFile - Plan ikonu
   * @returns {Promise} - Oluşturulan plan
   */
  create: (planData, iconFile = null) => {
    if (iconFile) {
      const formData = new FormData();
      
      // Plan verilerini ekle
      Object.keys(planData).forEach(key => {
        if (Array.isArray(planData[key])) {
          planData[key].forEach(item => {
            formData.append(`${key}[]`, typeof item === 'object' ? JSON.stringify(item) : item);
          });
        } else if (typeof planData[key] === 'object') {
          formData.append(key, JSON.stringify(planData[key]));
        } else {
          formData.append(key, planData[key]);
        }
      });
      
      // İkon dosyasını ekle
      formData.append('icon', iconFile);
      
      return uploadFile(PLANS_ENDPOINT, formData);
    } else {
      return post(PLANS_ENDPOINT, planData);
    }
  },

  /**
   * Planı güncelle
   * @param {string} id - Plan ID'si
   * @param {object} planData - Güncellenecek veriler
   * @param {File} iconFile - Yeni ikon dosyası
   * @returns {Promise} - Güncellenmiş plan
   */
  update: (id, planData, iconFile = null) => {
    if (iconFile) {
      const formData = new FormData();
      
      Object.keys(planData).forEach(key => {
        if (Array.isArray(planData[key])) {
          planData[key].forEach(item => {
            formData.append(`${key}[]`, typeof item === 'object' ? JSON.stringify(item) : item);
          });
        } else if (typeof planData[key] === 'object') {
          formData.append(key, JSON.stringify(planData[key]));
        } else {
          formData.append(key, planData[key]);
        }
      });
      
      formData.append('icon', iconFile);
      
      return uploadFile(`${PLANS_ENDPOINT}/${id}`, formData);
    } else {
      return put(`${PLANS_ENDPOINT}/${id}`, planData);
    }
  },

  /**
   * Plan fiyatlandırmasını güncelle
   * @param {string} id - Plan ID'si
   * @param {object} pricing - Yeni fiyatlandırma
   * @returns {Promise} - Güncellenmiş plan
   */
  updatePricing: (id, pricing) => {
    return patch(`${PLANS_ENDPOINT}/${id}/pricing`, { pricing });
  },

  /**
   * Plan popülerlik durumunu değiştir
   * @param {string} id - Plan ID'si
   * @param {boolean} popular - Popülerlik durumu
   * @returns {Promise} - Güncellenmiş plan
   */
  togglePopular: (id, popular) => {
    return patch(`${PLANS_ENDPOINT}/${id}/popular`, { popular });
  },

  /**
   * Plan satın alma sayısını artır
   * @param {string} id - Plan ID'si
   * @returns {Promise} - Güncellenmiş plan
   */
  incrementPurchases: (id) => {
    return patch(`${PLANS_ENDPOINT}/${id}/purchase`);
  },

  /**
   * Plana referans ekle
   * @param {string} id - Plan ID'si
   * @param {object} reference - Referans verisi
   * @returns {Promise} - Güncellenmiş plan
   */
  addReference: (id, reference) => {
    return post(`${PLANS_ENDPOINT}/${id}/references`, reference);
  },

  /**
   * Plana SSS ekle
   * @param {string} id - Plan ID'si
   * @param {object} faq - SSS verisi
   * @returns {Promise} - Güncellenmiş plan
   */
  addFAQ: (id, faq) => {
    return post(`${PLANS_ENDPOINT}/${id}/faq`, faq);
  },

  /**
   * Planı sil (soft delete)
   * @param {string} id - Plan ID'si
   * @returns {Promise} - Silme sonucu
   */
  delete: (id) => {
    return del(`${PLANS_ENDPOINT}/${id}`);
  },



  /**
   * Plan kategorilerini getir
   * @returns {Promise} - Kategori listesi
   */
  getCategories: () => {
    return get(`${PLANS_ENDPOINT}/categories`);
  },

  /**
   * Fiyat aralığına göre planları filtrele
   * @param {number} minPrice - Minimum fiyat
   * @param {number} maxPrice - Maksimum fiyat
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Filtrelenmiş planlar
   */
  getByPriceRange: (minPrice, maxPrice, params = {}) => {
    return get(PLANS_ENDPOINT, {
      minPrice,
      maxPrice,
      ...params
    });
  },

  /**
   * Plan arama
   * @param {string} query - Arama sorgusu
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Arama sonuçları
   */
  search: (query, params = {}) => {
    return get(PLANS_ENDPOINT, {
      search: query,
      ...params
    });
  }
};

export default planService;