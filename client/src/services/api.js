/**
 * API Base Configuration
 * Tüm API istekleri için temel yapılandırma
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * API isteği yapmak için yardımcı fonksiyon
 * @param {string} endpoint - API endpoint'i
 * @param {object} options - Fetch options
 * @returns {Promise} - API yanıtı
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Token varsa header'a ekle
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * GET isteği
 * @param {string} endpoint - API endpoint'i
 * @param {object} params - Query parametreleri
 * @returns {Promise} - API yanıtı
 */
export const get = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return apiRequest(url, {
    method: 'GET',
  });
};

/**
 * POST isteği
 * @param {string} endpoint - API endpoint'i
 * @param {object} data - Gönderilecek veri
 * @returns {Promise} - API yanıtı
 */
export const post = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT isteği
 * @param {string} endpoint - API endpoint'i
 * @param {object} data - Güncellenecek veri
 * @returns {Promise} - API yanıtı
 */
export const put = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * PATCH isteği
 * @param {string} endpoint - API endpoint'i
 * @param {object} data - Güncellenecek veri
 * @returns {Promise} - API yanıtı
 */
export const patch = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE isteği
 * @param {string} endpoint - API endpoint'i
 * @returns {Promise} - API yanıtı
 */
export const del = async (endpoint) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};

/**
 * Dosya yükleme isteği
 * @param {string} endpoint - API endpoint'i
 * @param {FormData} formData - Dosya verisi
 * @returns {Promise} - API yanıtı
 */
export const uploadFile = async (endpoint, formData) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: formData,
    headers: {}, // Content-Type'ı browser otomatik ayarlasın
  });
};

const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
  apiRequest,
};

export default api;