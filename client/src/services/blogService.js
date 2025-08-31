/**
 * Blog Service
 * Blog yazıları ve kategoriler için API işlemleri
 */

import { apiRequest } from './api';

class BlogService {
  constructor() {
    this.baseUrl = '/api/blog';
  }

  // Tüm blog yazılarını getir
  async getAll(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
      return await apiRequest('GET', url);
    } catch (error) {
      console.error('Blog yazıları getirilemedi:', error);
      throw error;
    }
  }

  // ID'ye göre blog yazısı getir
  async getById(id) {
    try {
      return await apiRequest('GET', `${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Blog yazısı getirilemedi (ID: ${id}):`, error);
      throw error;
    }
  }

  // Slug'a göre blog yazısı getir
  async getBySlug(slug) {
    try {
      return await apiRequest('GET', `${this.baseUrl}/slug/${slug}`);
    } catch (error) {
      console.error(`Blog yazısı getirilemedi (Slug: ${slug}):`, error);
      throw error;
    }
  }

  // Öne çıkan blog yazılarını getir
  async getFeatured(limit = 3) {
    try {
      return await apiRequest('GET', `${this.baseUrl}/featured?limit=${limit}`);
    } catch (error) {
      console.error('Öne çıkan blog yazıları getirilemedi:', error);
      throw error;
    }
  }

  // Blog kategorilerini getir
  async getCategories() {
    try {
      return await apiRequest('GET', `${this.baseUrl}/categories`);
    } catch (error) {
      console.error('Blog kategorileri getirilemedi:', error);
      throw error;
    }
  }

  // Kategoriye göre blog yazılarını getir
  async getByCategory(categoryId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString 
        ? `${this.baseUrl}/category/${categoryId}?${queryString}` 
        : `${this.baseUrl}/category/${categoryId}`;
      return await apiRequest('GET', url);
    } catch (error) {
      console.error(`Kategori blog yazıları getirilemedi (Category: ${categoryId}):`, error);
      throw error;
    }
  }

  // Blog yazısı ara
  async search(query, params = {}) {
    try {
      const searchParams = new URLSearchParams({ q: query, ...params }).toString();
      return await apiRequest('GET', `${this.baseUrl}/search?${searchParams}`);
    } catch (error) {
      console.error(`Blog arama başarısız (Query: ${query}):`, error);
      throw error;
    }
  }

  // İlgili blog yazılarını getir
  async getRelated(id, limit = 3) {
    try {
      return await apiRequest('GET', `${this.baseUrl}/${id}/related?limit=${limit}`);
    } catch (error) {
      console.error(`İlgili blog yazıları getirilemedi (ID: ${id}):`, error);
      throw error;
    }
  }

  // Blog yazısı beğen
  async like(id) {
    try {
      return await apiRequest('POST', `${this.baseUrl}/${id}/like`);
    } catch (error) {
      console.error(`Blog yazısı beğenilemedi (ID: ${id}):`, error);
      throw error;
    }
  }

  // Blog yazısı görüntüleme sayısını artır
  async incrementView(id) {
    try {
      return await apiRequest('POST', `${this.baseUrl}/${id}/view`);
    } catch (error) {
      console.error(`Blog yazısı görüntüleme sayısı artırılamadı (ID: ${id}):`, error);
      throw error;
    }
  }

  // Blog yazısına yorum yap
  async addComment(id, commentData) {
    try {
      return await apiRequest('POST', `${this.baseUrl}/${id}/comments`, commentData);
    } catch (error) {
      console.error(`Blog yazısına yorum eklenemedi (ID: ${id}):`, error);
      throw error;
    }
  }

  // Blog yazısının yorumlarını getir
  async getComments(id, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString 
        ? `${this.baseUrl}/${id}/comments?${queryString}` 
        : `${this.baseUrl}/${id}/comments`;
      return await apiRequest('GET', url);
    } catch (error) {
      console.error(`Blog yazısı yorumları getirilemedi (ID: ${id}):`, error);
      throw error;
    }
  }

  // Blog istatistiklerini getir
  async getStats() {
    try {
      return await apiRequest('GET', `${this.baseUrl}/stats`);
    } catch (error) {
      console.error('Blog istatistikleri getirilemedi:', error);
      throw error;
    }
  }

  // Popüler blog yazılarını getir
  async getPopular(limit = 5, period = '30d') {
    try {
      return await apiRequest('GET', `${this.baseUrl}/popular?limit=${limit}&period=${period}`);
    } catch (error) {
      console.error('Popüler blog yazıları getirilemedi:', error);
      throw error;
    }
  }

  // Son blog yazılarını getir
  async getLatest(limit = 5) {
    try {
      return await apiRequest('GET', `${this.baseUrl}/latest?limit=${limit}`);
    } catch (error) {
      console.error('Son blog yazıları getirilemedi:', error);
      throw error;
    }
  }

  // Blog yazısı paylaş
  async share(id, platform) {
    try {
      return await apiRequest('POST', `${this.baseUrl}/${id}/share`, { platform });
    } catch (error) {
      console.error(`Blog yazısı paylaşılamadı (ID: ${id}, Platform: ${platform}):`, error);
      throw error;
    }
  }

  // Newsletter aboneliği
  async subscribe(email) {
    try {
      return await apiRequest('POST', `${this.baseUrl}/newsletter/subscribe`, { email });
    } catch (error) {
      console.error(`Newsletter aboneliği başarısız (Email: ${email}):`, error);
      throw error;
    }
  }

  // Newsletter abonelik iptali
  async unsubscribe(email) {
    try {
      return await apiRequest('POST', `${this.baseUrl}/newsletter/unsubscribe`, { email });
    } catch (error) {
      console.error(`Newsletter abonelik iptali başarısız (Email: ${email}):`, error);
      throw error;
    }
  }
}

// Singleton instance
const blogService = new BlogService();

export default blogService;
export { blogService };