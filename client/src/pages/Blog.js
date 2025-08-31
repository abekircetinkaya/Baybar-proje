/**
 * Baybar Kurumsal Tanıtım Sitesi - Blog Sayfası
 * Blog yazıları, kategoriler ve arama fonksiyonları
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Blog.scss';

// UI bileşenleri
import Loading from '../components/ui/Loading';

// API servisleri
import { blogService } from '../services';

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [postsPerPage] = useState(6);

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true);
        
        // API'den blog yazılarını getir
        const postsResponse = await blogService.getAll();
        const postsData = postsResponse?.data || [];
        
        // API'den kategorileri getir
        const categoriesResponse = await blogService.getCategories();
        const categoriesData = categoriesResponse?.data || [];
        
        setPosts(postsData);
        setCategories([
          { id: 'all', name: 'Tümü', count: postsData.length },
          ...categoriesData
        ]);
        
      } catch (error) {
        console.error('Blog verileri yüklenirken hata:', error);
        // Hata durumunda yedek verileri kullan
        const fallbackPosts = [
          {
            id: 1,
            title: "E-ticaret Trendleri 2024: Geleceğin Alışveriş Deneyimi",
            excerpt: "2024 yılında e-ticaret sektörünü şekillendirecek en önemli trendleri ve bu trendlerin işletmeler üzerindeki etkilerini inceliyoruz.",
            content: "E-ticaret dünyası sürekli evrim geçiriyor...",
            image: "/images/blog/ecommerce-trends-2024.jpg",
            category: "E-ticaret",
            categoryId: "ecommerce",
            author: {
              name: "Ahmet Bayrak",
              avatar: "/images/team/ahmet-bayrak.jpg",
              bio: "E-ticaret uzmanı ve Baybar kurucusu"
            },
            publishedAt: "2024-01-15T10:00:00Z",
            readTime: 8,
            tags: ["E-ticaret", "Teknoloji", "Trendler", "2024"],
            featured: true,
            views: 1250,
            likes: 89
          },
          {
            id: 2,
            title: "Yapay Zeka ile E-ticaret: Kişiselleştirme Devrimi",
            excerpt: "Yapay zeka teknolojilerinin e-ticaret platformlarında nasıl kullanıldığını ve müşteri deneyimini nasıl geliştirdiğini keşfedin.",
            content: "Yapay zeka, e-ticaret sektöründe devrim yaratıyor...",
            image: "/images/blog/ai-ecommerce.jpg",
            category: "Teknoloji",
            categoryId: "technology",
            author: {
              name: "Elif Kaya",
              avatar: "/images/team/elif-kaya.jpg",
              bio: "CTO ve AI uzmanı"
            },
            publishedAt: "2024-01-10T14:30:00Z",
            readTime: 12,
            tags: ["Yapay Zeka", "AI", "Kişiselleştirme", "E-ticaret"],
            featured: false,
            views: 980,
            likes: 67
          },
          {
            id: 3,
            title: "Uluslararası E-ticaret: Sınır Ötesi Satış Rehberi",
            excerpt: "Türk işletmelerinin uluslararası pazarlara açılırken dikkat etmesi gereken önemli noktalar ve başarı stratejileri.",
            content: "Uluslararası e-ticaret, işletmeler için büyük fırsatlar sunuyor...",
            image: "/images/blog/international-ecommerce.jpg",
            category: "İş Geliştirme",
            categoryId: "business",
            author: {
              name: "Mehmet Özkan",
              avatar: "/images/team/mehmet-ozkan.jpg",
              bio: "Pazarlama Direktörü"
            },
            publishedAt: "2024-01-05T09:15:00Z",
            readTime: 15,
            tags: ["Uluslararası", "İhracat", "Pazarlama", "Strateji"],
            featured: true,
            views: 1450,
            likes: 112
          }
        ];
        
        const fallbackCategories = [
          { id: 'ecommerce', name: 'E-ticaret', count: 1 },
          { id: 'technology', name: 'Teknoloji', count: 1 },
          { id: 'business', name: 'İş Geliştirme', count: 1 }
        ];
        
        setPosts(fallbackPosts);
        setCategories([
          { id: 'all', name: 'Tümü', count: fallbackPosts.length },
          ...fallbackCategories
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Filtreleme ve sıralama
  useEffect(() => {
    let filtered = [...posts];

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.categoryId === selectedCategory);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sıralama
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'liked':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [posts, selectedCategory, searchTerm, sortBy]);

  // URL parametrelerini güncelle
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, currentPage, setSearchParams]);

  // Sayfa başlığını güncelle
  useEffect(() => {
    document.title = 'Blog - Baybar | E-Ticaret İçgörüleri ve Trendler';
  }, []);

  // Pagination hesaplamaları
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Tarih formatlama
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Okuma süresi hesaplama
  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (isLoading) {
    return <Loading variant="logo" size="large" fullscreen text="Blog yazıları yükleniyor..." />;
  }

  return (
    <div className="blog">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-hero__content">
            <h1 className="blog-hero__title">Blog</h1>
            <p className="blog-hero__subtitle">
              E-ticaret dünyasından en güncel haberler, trendler ve uzman görüşleri
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="blog-filters section">
        <div className="container">
          <div className="blog-filters__content">
            {/* Search */}
            <div className="blog-filters__search">
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Categories */}
            <div className="blog-filters__categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-btn ${
                    selectedCategory === category.id ? 'category-btn--active' : ''
                  }`}
                >
                  {category.name}
                  <span className="category-count">({category.count})</span>
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="blog-filters__sort">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="popular">En Popüler</option>
                <option value="liked">En Beğenilen</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="blog-filters__results">
            <p>
              {filteredPosts.length} yazı bulundu
              {searchTerm && ` "${searchTerm}" için`}
              {selectedCategory !== 'all' && ` ${categories.find(c => c.id === selectedCategory)?.name} kategorisinde`}
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="blog-posts section">
        <div className="container">
          {currentPosts.length > 0 ? (
            <>
              <div className="blog-posts__grid">
                {currentPosts.map((post) => (
                  <article key={post.id} className={`post-card ${
                    post.featured ? 'post-card--featured' : ''
                  }`}>
                    {post.featured && (
                      <div className="post-card__badge">
                        <span>Öne Çıkan</span>
                      </div>
                    )}
                    
                    <div className="post-card__image">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="post-card__image-placeholder" style={{ display: 'none' }}>
                        📝
                      </div>
                      <div className="post-card__category">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="post-card__content">
                      <h3 className="post-card__title">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="post-card__excerpt">{post.excerpt}</p>
                      
                      <div className="post-card__meta">
                        <div className="post-card__author">
                          <img 
                            src={post.author?.avatar} 
                            alt={post.author?.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="author-placeholder" style={{ display: 'none' }}>👤</div>
                          <span>{post.author?.name}</span>
                        </div>
                        <div className="post-card__date">
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className="post-card__read-time">
                          {post.readTime || getReadTime(post.content)} dk okuma
                        </div>
                      </div>
                      
                      <div className="post-card__stats">
                        <span className="stat">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {post.views}
                        </span>
                        <span className="stat">
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {post.likes}
                        </span>
                      </div>
                      
                      <div className="post-card__tags">
                        {post.tags?.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="blog-pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn pagination-btn--prev"
                  >
                    ← Önceki
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-number ${
                          currentPage === page ? 'pagination-number--active' : ''
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn pagination-btn--next"
                  >
                    Sonraki →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="blog-posts__empty">
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Aradığınız kriterlere uygun blog yazısı bulunamadı</h3>
                <p>Farklı arama terimleri veya kategoriler deneyebilirsiniz.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn--primary"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;