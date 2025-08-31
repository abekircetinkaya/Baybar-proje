/**
 * Authentication API Service
 * Kimlik doğrulama ve yetkilendirme için API servisleri
 */

import { get, post, put, patch, del } from './api';

const AUTH_ENDPOINT = '/auth';
const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

const authService = {
  /**
   * Kullanıcı girişi
   * @param {string} email - E-posta adresi
   * @param {string} password - Şifre
   * @returns {Promise} - Giriş sonucu
   */
  login: async (email, password) => {
    try {
      const response = await post(`${AUTH_ENDPOINT}/login`, {
        email,
        password
      });
      
      if (response.success && response.token) {
        // Token ve kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Kullanıcı kaydı
   * @param {object} userData - Kullanıcı verileri
   * @returns {Promise} - Kayıt sonucu
   */
  register: async (userData) => {
    try {
      const response = await post(`${AUTH_ENDPOINT}/register`, userData);
      
      if (response.success && response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  /**
   * Kullanıcı çıkışı
   * @returns {Promise} - Çıkış sonucu
   */
  logout: async () => {
    try {
      await post(`${AUTH_ENDPOINT}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Her durumda local storage'ı temizle
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Token yenileme
   * @returns {Promise} - Yeni token
   */
  refreshToken: async () => {
    try {
      const response = await post(`${AUTH_ENDPOINT}/refresh`);
      
      if (response.success && response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Token yenilenemezse çıkış yap
      authService.logout();
      throw error;
    }
  },

  /**
   * Şifre sıfırlama isteği
   * @param {string} email - E-posta adresi
   * @returns {Promise} - İstek sonucu
   */
  forgotPassword: (email) => {
    return post(`${AUTH_ENDPOINT}/forgot-password`, { email });
  },

  /**
   * Şifre sıfırlama
   * @param {string} token - Sıfırlama token'ı
   * @param {string} newPassword - Yeni şifre
   * @returns {Promise} - Sıfırlama sonucu
   */
  resetPassword: (token, newPassword) => {
    return post(`${AUTH_ENDPOINT}/reset-password`, {
      token,
      newPassword
    });
  },

  /**
   * Şifre değiştirme
   * @param {string} currentPassword - Mevcut şifre
   * @param {string} newPassword - Yeni şifre
   * @returns {Promise} - Değiştirme sonucu
   */
  changePassword: (currentPassword, newPassword) => {
    return put(`${AUTH_ENDPOINT}/change-password`, {
      currentPassword,
      newPassword
    });
  },

  /**
   * Profil bilgilerini getir
   * @returns {Promise} - Kullanıcı profili
   */
  getProfile: () => {
    return get(`${AUTH_ENDPOINT}/profile`);
  },

  /**
   * Profil bilgilerini güncelle
   * @param {object} profileData - Profil verileri
   * @returns {Promise} - Güncellenmiş profil
   */
  updateProfile: async (profileData) => {
    try {
      const response = await put(`${AUTH_ENDPOINT}/profile`, profileData);
      
      if (response.success && response.user) {
        // Güncellenmiş kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  /**
   * Token doğrulama
   * @returns {Promise} - Doğrulama sonucu
   */
  verifyToken: () => {
    return get(`${AUTH_ENDPOINT}/verify`);
  },

  /**
   * Kullanıcı yetkilerini kontrol et
   * @param {string} permission - Kontrol edilecek yetki
   * @returns {Promise} - Yetki kontrolü sonucu
   */
  checkPermission: (permission) => {
    return get(`${AUTH_ENDPOINT}/permissions/${permission}`);
  },



  // Yardımcı fonksiyonlar
  
  /**
   * Token'ı localStorage'dan getir
   * @returns {string|null} - Token
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Kullanıcı bilgilerini localStorage'dan getir
   * @returns {object|null} - Kullanıcı bilgileri
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Kullanıcının giriş yapıp yapmadığını kontrol et
   * @returns {boolean} - Giriş durumu
   */
  isAuthenticated: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    return !!(token && user);
  },



  /**
   * Kullanıcının belirli bir yetkiye sahip olup olmadığını kontrol et
   * @param {string} permission - Kontrol edilecek yetki
   * @returns {boolean} - Yetki durumu
   */
  hasPermission: (permission) => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    

    
    // Diğer roller için özel kontroller
    return user.permissions && user.permissions.includes(permission);
  }
};

export default authService;