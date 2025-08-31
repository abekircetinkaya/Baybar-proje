/**
 * Admin İçerik Yönetimi Sayfası
 * Ana sayfa, Hakkımızda, Hizmetler ve İletişim sayfalarının içeriklerini yönetir
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { get, post, put, del } from '../../services/api';
import './AdminContentManagement.scss';

const AdminContentManagement = () => {
  // State yönetimi
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPage, setFilterPage] = useState('all');

  // Sayfa türleri
  const pageTypes = [
    { value: 'home', label: 'Ana Sayfa', icon: '🏠' },
    { value: 'about', label: 'Hakkımızda', icon: '👥' },
    { value: 'services', label: 'Hizmetler', icon: '⚙️' },
    { value: 'contact', label: 'İletişim', icon: '☎️' }
  ];

  // Form state
  const [formData, setFormData] = useState({
    pageName: '',
    pageTitle: '',
    metaDescription: '',
    metaKeywords: [],
    sections: []
  });

  // Bileşen yüklendiğinde içerikleri getir
  useEffect(() => {
    fetchContents();
  }, []);

  // İçerikleri API'den getir
  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await get('/admin/content');
      console.log('API Yanıtı:', response);
      
      // API yanıtının yapısını kontrol et
      if (response.data) {
        setContents(response.data);
      } else if (Array.isArray(response)) {
        setContents(response);
      } else {
        console.error('Beklenmeyen API yanıt yapısı:', response);
        setContents([]);
      }
    } catch (err) {
      console.error('İçerik yükleme hatası:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // İçerik kaydet
  const saveContent = async () => {
    try {
      setSaving(true);
      setError('');
      
      if (selectedContent) {
        await put(`/admin/content/${selectedContent._id}`, formData);
      } else {
        await post('/admin/content', formData);
      }

      setSuccess(selectedContent ? 'İçerik güncellendi!' : 'İçerik oluşturuldu!');
      
      // İçerikleri yeniden yükle
      await fetchContents();
      
      // Formu temizle
      resetForm();
      setActiveTab('list');
      
      // Başarı mesajını 3 saniye sonra temizle
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('İçerik kaydetme hatası:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // İçerik sil
  const deleteContent = async (contentId) => {
    if (!window.confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await del(`/admin/content/${contentId}`);
      setSuccess('İçerik silindi!');
      await fetchContents();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('İçerik silme hatası:', err);
      setError(err.message);
    }
  };

  // Form verilerini güncelle
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Bölüm ekle
  const addSection = () => {
    const newSection = {
      title: '',
      text: '',
      order: formData.sections.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // Bölüm güncelle
  const updateSection = (index, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  // Bölüm sil
  const removeSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    // Sıraları yeniden düzenle
    updatedSections.forEach((section, i) => {
      section.order = i + 1;
    });
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  // Bölüm sırasını değiştir
  const moveSectionUp = (index) => {
    if (index === 0) return;
    
    const updatedSections = [...formData.sections];
    [updatedSections[index], updatedSections[index - 1]] = 
    [updatedSections[index - 1], updatedSections[index]];
    
    // Sıraları güncelle
    updatedSections.forEach((section, i) => {
      section.order = i + 1;
    });
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const moveSectionDown = (index) => {
    if (index === formData.sections.length - 1) return;
    
    const updatedSections = [...formData.sections];
    [updatedSections[index], updatedSections[index + 1]] = 
    [updatedSections[index + 1], updatedSections[index]];
    
    // Sıraları güncelle
    updatedSections.forEach((section, i) => {
      section.order = i + 1;
    });
    
    setFormData(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  // Formu temizle
  const resetForm = () => {
    setFormData({
      pageName: '',
      pageTitle: '',
      metaDescription: '',
      metaKeywords: [],
      sections: []
    });
    setSelectedContent(null);
  };

  // İçerik düzenle
  const editContent = (content) => {
    setSelectedContent(content);
    setFormData({
      pageName: content.pageName || '',
      pageTitle: content.pageTitle || '',
      metaDescription: content.metaDescription || '',
      metaKeywords: content.metaKeywords || [],
      sections: content.sections || []
    });
    setActiveTab('form');
  };

  // Yeni içerik oluştur
  const createNewContent = () => {
    resetForm();
    setActiveTab('form');
  };

  // Anahtar kelime ekle
  const addKeyword = (keyword) => {
    if (keyword.trim() && !formData.metaKeywords.includes(keyword.trim())) {
      updateFormData('metaKeywords', [...formData.metaKeywords, keyword.trim()]);
    }
  };

  // Anahtar kelime sil
  const removeKeyword = (index) => {
    const updatedKeywords = formData.metaKeywords.filter((_, i) => i !== index);
    updateFormData('metaKeywords', updatedKeywords);
  };

  // Filtrelenmiş içerikler
  const filteredContents = contents.filter(content => {
    const matchesSearch = content.pageTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.pageName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPage === 'all' || content.pageName === filterPage;
    
    return matchesSearch && matchesFilter;
  });

  // Sayfa türü bilgisi getir
  const getPageTypeInfo = (pageName) => {
    return pageTypes.find(type => type.value === pageName) || 
           { label: pageName, icon: '📄' };
  };

  // Yükleme durumu
  if (loading) {
    return (
      <div className="admin-content-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>İçerikler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-content-management">
      {/* Header */}
      <div className="content-header">
        <div className="header-content">
          <h1>📝 İçerik Yönetimi</h1>
          <p>Web sitesi sayfalarının içeriklerini yönetin</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={createNewContent}
            className="btn btn-primary"
          >
            ➕ Yeni İçerik
          </button>
        </div>
      </div>

      {/* Bildirimler */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">{error}</span>
          <button onClick={() => setError('')} className="alert-close">×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span className="alert-text">{success}</span>
          <button onClick={() => setSuccess('')} className="alert-close">×</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 İçerik Listesi
        </button>
        <button 
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          ✏️ {selectedContent ? 'İçerik Düzenle' : 'Yeni İçerik'}
        </button>
      </div>

      {/* İçerik Listesi */}
      {activeTab === 'list' && (
        <div className="content-list-section">
          {/* Filtreler */}
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="İçerik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <select 
              value={filterPage} 
              onChange={(e) => setFilterPage(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tüm Sayfalar</option>
              {pageTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* İçerik Kartları */}
          <div className="content-grid">
            {filteredContents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>İçerik Bulunamadı</h3>
                <p>Henüz hiç içerik oluşturulmamış veya arama kriterlerinize uygun içerik yok.</p>
                <button onClick={createNewContent} className="btn btn-primary">
                  İlk İçeriği Oluştur
                </button>
              </div>
            ) : (
              filteredContents.map((content) => {
                const pageInfo = getPageTypeInfo(content.pageName);
                return (
                  <div key={content._id} className="content-card">
                    <div className="card-header">
                      <div className="page-info">
                        <span className="page-icon">{pageInfo.icon}</span>
                        <div className="page-details">
                          <h3>{content.pageTitle}</h3>
                          <span className="page-type">{pageInfo.label}</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button 
                          onClick={() => editContent(content)}
                          className="btn btn-secondary btn-sm"
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteContent(content._id)}
                          className="btn btn-danger btn-sm"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <p className="meta-description">{content.metaDescription}</p>
                      
                      <div className="content-stats">
                        <span className="stat">
                          📄 {content.sections?.length || 0} Bölüm
                        </span>
                        <span className="stat">
                          🏷️ {content.metaKeywords?.length || 0} Anahtar Kelime
                        </span>
                      </div>
                      
                      {content.metaKeywords && content.metaKeywords.length > 0 && (
                        <div className="keywords">
                          {content.metaKeywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className="keyword-tag">{keyword}</span>
                          ))}
                          {content.metaKeywords.length > 3 && (
                            <span className="keyword-more">+{content.metaKeywords.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer">
                      <span className="last-updated">
                        Son güncelleme: {new Date(content.updatedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* İçerik Formu */}
      {activeTab === 'form' && (
        <div className="content-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>{selectedContent ? 'İçerik Düzenle' : 'Yeni İçerik Oluştur'}</h2>
              <button 
                onClick={() => setActiveTab('list')}
                className="btn btn-secondary"
              >
                ← Geri Dön
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveContent(); }}>
              {/* Temel Bilgiler */}
              <div className="form-section">
                <h3>📋 Temel Bilgiler</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Sayfa Türü *</label>
                    <select
                      value={formData.pageName}
                      onChange={(e) => updateFormData('pageName', e.target.value)}
                      required
                      className="form-control"
                    >
                      <option value="">Sayfa türü seçin</option>
                      {pageTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Sayfa Başlığı *</label>
                    <input
                      type="text"
                      value={formData.pageTitle}
                      onChange={(e) => updateFormData('pageTitle', e.target.value)}
                      placeholder="Örn: Hakkımızda - Baybar"
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Meta Açıklama</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => updateFormData('metaDescription', e.target.value)}
                    placeholder="SEO için sayfa açıklaması (150-160 karakter önerilir)"
                    rows={3}
                    className="form-control"
                  />
                  <small className="form-help">
                    {formData.metaDescription.length}/160 karakter
                  </small>
                </div>
                
                <div className="form-group">
                  <label>Anahtar Kelimeler</label>
                  <div className="keywords-input">
                    <input
                      type="text"
                      placeholder="Anahtar kelime yazın ve Enter'a basın"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="form-control"
                    />
                  </div>
                  
                  {formData.metaKeywords.length > 0 && (
                    <div className="keywords-list">
                      {formData.metaKeywords.map((keyword, index) => (
                        <span key={index} className="keyword-tag">
                          {keyword}
                          <button 
                            type="button"
                            onClick={() => removeKeyword(index)}
                            className="keyword-remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* İçerik Bölümleri */}
              <div className="form-section">
                <div className="section-header">
                  <h3>📄 İçerik Bölümleri</h3>
                  <button 
                    type="button"
                    onClick={addSection}
                    className="btn btn-secondary btn-sm"
                  >
                    ➕ Bölüm Ekle
                  </button>
                </div>
                
                {formData.sections.length === 0 ? (
                  <div className="empty-sections">
                    <p>Henüz hiç bölüm eklenmemiş. İlk bölümü eklemek için yukarıdaki butonu kullanın.</p>
                  </div>
                ) : (
                  <div className="sections-list">
                    {formData.sections.map((section, index) => (
                      <div key={index} className="section-item">
                        <div className="section-header">
                          <span className="section-number">Bölüm {index + 1}</span>
                          <div className="section-actions">
                            <button 
                              type="button"
                              onClick={() => moveSectionUp(index)}
                              disabled={index === 0}
                              className="btn btn-sm"
                              title="Yukarı Taşı"
                            >
                              ⬆️
                            </button>
                            <button 
                              type="button"
                              onClick={() => moveSectionDown(index)}
                              disabled={index === formData.sections.length - 1}
                              className="btn btn-sm"
                              title="Aşağı Taşı"
                            >
                              ⬇️
                            </button>
                            <button 
                              type="button"
                              onClick={() => removeSection(index)}
                              className="btn btn-danger btn-sm"
                              title="Sil"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        
                        <div className="section-content">
                          <div className="form-group">
                            <label>Bölüm Başlığı</label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSection(index, 'title', e.target.value)}
                              placeholder="Bölüm başlığı"
                              className="form-control"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Bölüm İçeriği</label>
                            <textarea
                              value={section.text}
                              onChange={(e) => updateSection(index, 'text', e.target.value)}
                              placeholder="Bölüm içeriği"
                              rows={6}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  🔄 Temizle
                </button>
                <button 
                  type="submit"
                  disabled={saving || !formData.pageName || !formData.pageTitle}
                  className="btn btn-primary"
                >
                  {saving ? (
                    <>
                      <div className="loading-spinner small"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      💾 {selectedContent ? 'Güncelle' : 'Kaydet'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContentManagement;