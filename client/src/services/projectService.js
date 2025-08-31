/**
 * Project API Service
 * Proje yönetimi için API servisleri
 */

import { get, post, put, patch, del, uploadFile } from './api';

const PROJECTS_ENDPOINT = '/projects';

export const projectService = {
  /**
   * Tüm projeleri getir
   * @param {object} params - Filtreleme parametreleri
   * @returns {Promise} - Projeler listesi
   */
  getAll: (params = {}) => {
    return get(PROJECTS_ENDPOINT, params);
  },

  /**
   * Öne çıkan projeleri getir
   * @param {number} limit - Maksimum proje sayısı
   * @returns {Promise} - Öne çıkan projeler
   */
  getFeatured: (limit = 6) => {
    return get(`${PROJECTS_ENDPOINT}/featured`, { limit });
  },

  /**
   * Kategoriye göre projeleri getir
   * @param {string} category - Kategori adı
   * @param {object} params - Ek parametreler
   * @returns {Promise} - Kategori projeleri
   */
  getByCategory: (category, params = {}) => {
    return get(`${PROJECTS_ENDPOINT}/category/${category}`, params);
  },

  /**
   * Belirli bir projeyi getir
   * @param {string} id - Proje ID'si
   * @returns {Promise} - Proje detayları
   */
  getById: (id) => {
    return get(`${PROJECTS_ENDPOINT}/${id}`);
  },

  /**
   * Yeni proje oluştur
   * @param {object} projectData - Proje verileri
   * @param {File[]} files - Yüklenecek dosyalar
   * @returns {Promise} - Oluşturulan proje
   */
  create: (projectData, files = []) => {
    const formData = new FormData();
    
    // Proje verilerini ekle
    Object.keys(projectData).forEach(key => {
      if (Array.isArray(projectData[key])) {
        projectData[key].forEach(item => {
          formData.append(`${key}[]`, item);
        });
      } else {
        formData.append(key, projectData[key]);
      }
    });
    
    // Dosyaları ekle
    files.forEach((file, index) => {
      if (file.type === 'image') {
        formData.append('images', file.file);
      } else if (file.type === 'document') {
        formData.append('documents', file.file);
      }
    });
    
    return uploadFile(PROJECTS_ENDPOINT, formData);
  },

  /**
   * Projeyi güncelle
   * @param {string} id - Proje ID'si
   * @param {object} projectData - Güncellenecek veriler
   * @param {File[]} files - Yeni dosyalar
   * @returns {Promise} - Güncellenmiş proje
   */
  update: (id, projectData, files = []) => {
    if (files.length > 0) {
      const formData = new FormData();
      
      Object.keys(projectData).forEach(key => {
        if (Array.isArray(projectData[key])) {
          projectData[key].forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, projectData[key]);
        }
      });
      
      files.forEach((file) => {
        if (file.type === 'image') {
          formData.append('images', file.file);
        } else if (file.type === 'document') {
          formData.append('documents', file.file);
        }
      });
      
      return uploadFile(`${PROJECTS_ENDPOINT}/${id}`, formData);
    } else {
      return put(`${PROJECTS_ENDPOINT}/${id}`, projectData);
    }
  },

  /**
   * Proje durumunu güncelle
   * @param {string} id - Proje ID'si
   * @param {string} status - Yeni durum
   * @returns {Promise} - Güncellenmiş proje
   */
  updateStatus: (id, status) => {
    return patch(`${PROJECTS_ENDPOINT}/${id}/status`, { status });
  },

  /**
   * Proje öne çıkarma durumunu değiştir
   * @param {string} id - Proje ID'si
   * @param {boolean} featured - Öne çıkarma durumu
   * @returns {Promise} - Güncellenmiş proje
   */
  toggleFeatured: (id, featured) => {
    return patch(`${PROJECTS_ENDPOINT}/${id}/featured`, { featured });
  },

  /**
   * Projeyi sil
   * @param {string} id - Proje ID'si
   * @returns {Promise} - Silme sonucu
   */
  delete: (id) => {
    return del(`${PROJECTS_ENDPOINT}/${id}`);
  },



  /**
   * Proje kategorilerini getir
   * @returns {Promise} - Kategori listesi
   */
  getCategories: () => {
    return get(`${PROJECTS_ENDPOINT}/categories`);
  },

  /**
   * Proje istatistiklerini getir
   * @returns {Promise} - Proje istatistikleri
   */
  getStats: () => {
    return get(`${PROJECTS_ENDPOINT}/stats`);
  }
};

export default projectService;