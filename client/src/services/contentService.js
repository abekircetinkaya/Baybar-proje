/**
 * Content API Service
 * İçerik yönetimi için API servisleri
 */

import { get, post, put, patch, del } from './api';

const CONTENT_ENDPOINT = '/content';

export const contentService = {
  /**
   * Tüm içerikleri getir
   * @param {object} params - Filtreleme parametreleri
   * @returns {Promise} - İçerikler listesi
   */
  getAll: (params = {}) => {
    return get(CONTENT_ENDPOINT, params);
  },

  /**
   * Belirli bir içeriği getir
   * @param {string} id - İçerik ID'si
   * @returns {Promise} - İçerik detayları
   */
  getById: (id) => {
    return get(`${CONTENT_ENDPOINT}/${id}`);
  },

  /**
   * Sayfa bazında içerik getir
   * @param {string} page - Sayfa adı (home, about, services, contact)
   * @returns {Promise} - Sayfa içerikleri
   */
  getByPage: (page) => {
    return get(`${CONTENT_ENDPOINT}/page/${page}`);
  },

  /**
   * Bölüm bazında içerik getir
   * @param {string} section - Bölüm adı
   * @returns {Promise} - Bölüm içerikleri
   */
  getBySection: (section) => {
    return get(`${CONTENT_ENDPOINT}/section/${section}`);
  },

  /**
   * Yeni içerik oluştur
   * @param {object} contentData - İçerik verileri
   * @returns {Promise} - Oluşturulan içerik
   */
  create: (contentData) => {
    return post(CONTENT_ENDPOINT, contentData);
  },

  /**
   * İçeriği güncelle
   * @param {string} id - İçerik ID'si
   * @param {object} contentData - Güncellenecek veriler
   * @returns {Promise} - Güncellenmiş içerik
   */
  update: (id, contentData) => {
    return put(`${CONTENT_ENDPOINT}/${id}`, contentData);
  },

  /**
   * İçerik durumunu güncelle
   * @param {string} id - İçerik ID'si
   * @param {boolean} active - Aktiflik durumu
   * @returns {Promise} - Güncellenmiş içerik
   */
  updateStatus: (id, active) => {
    return patch(`${CONTENT_ENDPOINT}/${id}/status`, { active });
  },

  /**
   * İçeriği sil
   * @param {string} id - İçerik ID'si
   * @returns {Promise} - Silme sonucu
   */
  delete: (id) => {
    return del(`${CONTENT_ENDPOINT}/${id}`);
  },

  /**
   * Ana sayfa içeriklerini getir
   * @returns {Promise} - Ana sayfa içerikleri
   */
  getHomeContent: () => {
    return get(`${CONTENT_ENDPOINT}/page/home`);
  },

  /**
   * Hakkımızda sayfası içeriklerini getir
   * @returns {Promise} - Hakkımızda içerikleri
   */
  getAboutContent: () => {
    return get(`${CONTENT_ENDPOINT}/page/about`);
  },

  /**
   * Hizmetler sayfası içeriklerini getir
   * @returns {Promise} - Hizmetler içerikleri
   */
  getServicesContent: () => {
    return get(`${CONTENT_ENDPOINT}/page/services`);
  },

  /**
   * İletişim sayfası içeriklerini getir
   * @returns {Promise} - İletişim içerikleri
   */
  getContactContent: () => {
    return get(`${CONTENT_ENDPOINT}/page/contact`);
  },

  /**
   * Hero bölümü içeriklerini getir
   * @returns {Promise} - Hero içerikleri
   */
  getHeroContent: () => {
    return get(`${CONTENT_ENDPOINT}/section/hero`);
  },

  /**
   * Özellikler bölümü içeriklerini getir
   * @returns {Promise} - Özellikler içerikleri
   */
  getFeaturesContent: () => {
    return get(`${CONTENT_ENDPOINT}/section/features`);
  },

  /**
   * Takım bölümü içeriklerini getir
   * @returns {Promise} - Takım içerikleri
   */
  getTeamContent: () => {
    return get(`${CONTENT_ENDPOINT}/section/team`);
  },

  /**
   * Referanslar bölümü içeriklerini getir
   * @returns {Promise} - Referanslar içerikleri
   */
  getReferencesContent: () => {
    return get(`${CONTENT_ENDPOINT}/section/references`);
  },

  /**
   * İstatistikler bölümü içeriklerini getir
   * @returns {Promise} - İstatistikler içerikleri
   */
  getStatsContent: () => {
    return get(`${CONTENT_ENDPOINT}/section/stats`);
  },

  /**
   * Aktif içerikleri getir
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Aktif içerikler
   */
  getActiveContent: (params = {}) => {
    return get(CONTENT_ENDPOINT, {
      active: true,
      ...params
    });
  },

  /**
   * İçerik tipine göre getir
   * @param {string} type - İçerik tipi
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Tip bazında içerikler
   */
  getByType: (type, params = {}) => {
    return get(CONTENT_ENDPOINT, {
      type,
      ...params
    });
  },

  /**
   * İçerik arama
   * @param {string} query - Arama sorgusu
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Arama sonuçları
   */
  search: (query, params = {}) => {
    return get(CONTENT_ENDPOINT, {
      search: query,
      ...params
    });
  },

  /**
   * İçerik sıralamasını güncelle
   * @param {string} id - İçerik ID'si
   * @param {number} order - Yeni sıralama
   * @returns {Promise} - Güncellenmiş içerik
   */
  updateOrder: (id, order) => {
    return patch(`${CONTENT_ENDPOINT}/${id}/order`, { order });
  },

  /**
   * Toplu içerik güncelleme
   * @param {Array} contents - Güncellenecek içerikler listesi
   * @returns {Promise} - Güncelleme sonucu
   */
  bulkUpdate: (contents) => {
    return put(`${CONTENT_ENDPOINT}/bulk`, { contents });
  },

  /**
   * İçerik tiplerini getir
   * @returns {Promise} - İçerik tipleri listesi
   */
  getTypes: () => {
    return get(`${CONTENT_ENDPOINT}/types`);
  },

  /**
   * Sayfa listesini getir
   * @returns {Promise} - Sayfa listesi
   */
  getPages: () => {
    return get(`${CONTENT_ENDPOINT}/pages`);
  },

  /**
   * Bölüm listesini getir
   * @returns {Promise} - Bölüm listesi
   */
  getSections: () => {
    return get(`${CONTENT_ENDPOINT}/sections`);
  }
};

export default contentService;