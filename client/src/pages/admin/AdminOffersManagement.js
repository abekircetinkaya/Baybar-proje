/**
 * Admin Teklifler Yönetimi Sayfası
 * Gelen teklifleri görüntüleme, yanıtlama ve yönetme
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { get, post, put, del } from '../../services/api';
import './AdminOffersManagement.scss';

const AdminOffersManagement = () => {
  // State yönetimi
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Teklif durumları
  const offerStatuses = [
    { value: 'pending', label: 'Beklemede', color: '#f59e0b', icon: '⏳' },
    { value: 'reviewing', label: 'İnceleniyor', color: '#3b82f6', icon: '👀' },
    { value: 'responded', label: 'Yanıtlandı', color: '#10b981', icon: '✅' },
    { value: 'rejected', label: 'Reddedildi', color: '#ef4444', icon: '❌' },
    { value: 'archived', label: 'Arşivlendi', color: '#6b7280', icon: '📁' }
  ];

  // Hizmet türleri
  const serviceTypes = [
    { value: 'ecommerce', label: 'E-ticaret Çözümleri', icon: '🛒' },
    { value: 'web-development', label: 'Web Geliştirme', icon: '💻' },
    { value: 'mobile-app', label: 'Mobil Uygulama', icon: '📱' },
    { value: 'digital-marketing', label: 'Dijital Pazarlama', icon: '📈' },
    { value: 'consulting', label: 'Danışmanlık', icon: '💡' },
    { value: 'other', label: 'Diğer', icon: '📋' }
  ];

  // Yanıt formu state
  const [responseForm, setResponseForm] = useState({
    subject: '',
    message: '',
    status: 'responded'
  });

  // Bileşen yüklendiğinde teklifleri getir
  useEffect(() => {
    fetchOffers();
  }, []);

  // Teklifleri API'den getir
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await get('/admin/offers');
      setOffers(data.offers || []);
    } catch (err) {
      console.error('Teklif yükleme hatası:', err);
      setError(err.message);
      
      // Demo veri (API yoksa)
      setOffers([
        {
          _id: '1',
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '+90 532 123 4567',
          company: 'ABC Teknoloji',
          serviceType: 'ecommerce',
          budget: '50000-100000',
          timeline: '3-6 ay',
          description: 'E-ticaret sitesi geliştirmek istiyoruz. Ürün katalogu, ödeme sistemi ve stok yönetimi gerekli.',
          status: 'pending',
          priority: 'high',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          name: 'Fatma Demir',
          email: 'fatma@example.com',
          phone: '+90 533 987 6543',
          company: 'XYZ Moda',
          serviceType: 'web-development',
          budget: '25000-50000',
          timeline: '1-3 ay',
          description: 'Kurumsal web sitesi yenileme projesi. Modern tasarım ve mobil uyumlu olması gerekiyor.',
          status: 'reviewing',
          priority: 'medium',
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-16')
        },
        {
          _id: '3',
          name: 'Mehmet Kaya',
          email: 'mehmet@example.com',
          phone: '+90 534 555 1234',
          company: 'DEF Lojistik',
          serviceType: 'mobile-app',
          budget: '100000+',
          timeline: '6+ ay',
          description: 'Lojistik takip uygulaması geliştirmek istiyoruz. GPS entegrasyonu ve real-time takip özelliği olacak.',
          status: 'responded',
          priority: 'high',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-17')
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Teklif durumunu güncelle
  const updateOfferStatus = async (offerId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/offers/${offerId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Durum güncellenemedi');
      }

      // Local state'i güncelle
      setOffers(prev => prev.map(offer => 
        offer._id === offerId 
          ? { ...offer, status: newStatus, updatedAt: new Date() }
          : offer
      ));
      
      setSuccess('Teklif durumu güncellendi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Durum güncelleme hatası:', err);
      setError(err.message);
    }
  };

  // Yanıt gönder
  const sendResponse = async () => {
    if (!selectedOffer || !responseForm.subject || !responseForm.message) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/offers/${selectedOffer._id}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: responseForm.subject,
          message: responseForm.message,
          status: responseForm.status
        })
      });

      if (!response.ok) {
        throw new Error('Yanıt gönderilemedi');
      }

      // Teklif durumunu güncelle
      await updateOfferStatus(selectedOffer._id, responseForm.status);
      
      setSuccess('Yanıt başarıyla gönderildi!');
      setActiveTab('list');
      setSelectedOffer(null);
      setResponseForm({ subject: '', message: '', status: 'responded' });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Yanıt gönderme hatası:', err);
      setError(err.message);
    }
  };

  // Teklif sil
  const deleteOffer = async (offerId) => {
    if (!window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Teklif silinemedi');
      }

      setOffers(prev => prev.filter(offer => offer._id !== offerId));
      setSuccess('Teklif silindi!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Teklif silme hatası:', err);
      setError(err.message);
    }
  };

  // Filtrelenmiş ve sıralanmış teklifler
  const getFilteredOffers = () => {
    let filtered = offers.filter(offer => {
      const matchesSearch = 
        offer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
      const matchesService = filterService === 'all' || offer.serviceType === filterService;
      
      return matchesSearch && matchesStatus && matchesService;
    });

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Durum bilgisi getir
  const getStatusInfo = (status) => {
    return offerStatuses.find(s => s.value === status) || 
           { label: status, color: '#6b7280', icon: '❓' };
  };

  // Hizmet bilgisi getir
  const getServiceInfo = (serviceType) => {
    return serviceTypes.find(s => s.value === serviceType) || 
           { label: serviceType, icon: '📋' };
  };

  // Teklif detayını görüntüle
  const viewOfferDetails = (offer) => {
    setSelectedOffer(offer);
    setResponseForm({
      subject: `Re: ${offer.serviceType} Teklifi - ${offer.company}`,
      message: '',
      status: offer.status === 'pending' ? 'reviewing' : offer.status
    });
    setActiveTab('details');
  };

  // Yanıt formunu aç
  const openResponseForm = (offer) => {
    setSelectedOffer(offer);
    setResponseForm({
      subject: `Re: ${offer.serviceType} Teklifi - ${offer.company}`,
      message: '',
      status: 'responded'
    });
    setActiveTab('response');
  };

  // Yükleme durumu
  if (loading) {
    return (
      <div className="admin-offers-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Teklifler yükleniyor...</p>
        </div>
      </div>
    );
  }

  const filteredOffers = getFilteredOffers();

  return (
    <div className="admin-offers-management">
      {/* Header */}
      <div className="offers-header">
        <div className="header-content">
          <h1>💼 Teklifler Yönetimi</h1>
          <p>Gelen teklifleri görüntüleyin, yanıtlayın ve yönetin</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{offers.length}</span>
            <span className="stat-label">Toplam Teklif</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {offers.filter(o => o.status === 'pending').length}
            </span>
            <span className="stat-label">Beklemede</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {offers.filter(o => o.status === 'reviewing').length}
            </span>
            <span className="stat-label">İnceleniyor</span>
          </div>
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
          📋 Teklif Listesi
        </button>
        {selectedOffer && (
          <>
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              👁️ Teklif Detayı
            </button>
            <button 
              className={`tab-btn ${activeTab === 'response' ? 'active' : ''}`}
              onClick={() => setActiveTab('response')}
            >
              📧 Yanıt Gönder
            </button>
          </>
        )}
      </div>

      {/* Teklif Listesi */}
      {activeTab === 'list' && (
        <div className="offers-list-section">
          {/* Filtreler */}
          <div className="filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Teklif ara (isim, email, şirket, açıklama)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tüm Durumlar</option>
              {offerStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label}
                </option>
              ))}
            </select>
            
            <select 
              value={filterService} 
              onChange={(e) => setFilterService(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tüm Hizmetler</option>
              {serviceTypes.map(service => (
                <option key={service.value} value={service.value}>
                  {service.icon} {service.label}
                </option>
              ))}
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="name">İsme Göre</option>
              <option value="company">Şirkete Göre</option>
              <option value="priority">Önceliğe Göre</option>
            </select>
          </div>

          {/* Teklif Kartları */}
          <div className="offers-grid">
            {filteredOffers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💼</div>
                <h3>Teklif Bulunamadı</h3>
                <p>Arama kriterlerinize uygun teklif bulunamadı.</p>
              </div>
            ) : (
              filteredOffers.map((offer) => {
                const statusInfo = getStatusInfo(offer.status);
                const serviceInfo = getServiceInfo(offer.serviceType);
                
                return (
                  <div key={offer._id} className={`offer-card priority-${offer.priority}`}>
                    <div className="card-header">
                      <div className="offer-info">
                        <h3>{offer.name}</h3>
                        <p className="company">{offer.company}</p>
                        <div className="contact-info">
                          <span className="email">📧 {offer.email}</span>
                          <span className="phone">📞 {offer.phone}</span>
                        </div>
                      </div>
                      <div className="offer-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                        {offer.priority && (
                          <span className={`priority-badge priority-${offer.priority}`}>
                            {offer.priority === 'high' && '🔴'}
                            {offer.priority === 'medium' && '🟡'}
                            {offer.priority === 'low' && '🟢'}
                            {offer.priority.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="card-content">
                      <div className="service-info">
                        <span className="service-type">
                          {serviceInfo.icon} {serviceInfo.label}
                        </span>
                        <span className="budget">💰 {offer.budget}</span>
                        <span className="timeline">⏰ {offer.timeline}</span>
                      </div>
                      
                      <p className="description">{offer.description}</p>
                    </div>
                    
                    <div className="card-footer">
                      <div className="offer-date">
                        <span>📅 {new Date(offer.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="card-actions">
                        <button 
                          onClick={() => viewOfferDetails(offer)}
                          className="btn btn-secondary btn-sm"
                          title="Detayları Görüntüle"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => openResponseForm(offer)}
                          className="btn btn-primary btn-sm"
                          title="Yanıtla"
                        >
                          📧
                        </button>
                        <select
                          value={offer.status}
                          onChange={(e) => updateOfferStatus(offer._id, e.target.value)}
                          className="status-select"
                          title="Durum Değiştir"
                        >
                          {offerStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.icon} {status.label}
                            </option>
                          ))}
                        </select>
                        <button 
                          onClick={() => deleteOffer(offer._id)}
                          className="btn btn-danger btn-sm"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Teklif Detayı */}
      {activeTab === 'details' && selectedOffer && (
        <div className="offer-details-section">
          <div className="details-container">
            <div className="details-header">
              <h2>Teklif Detayları</h2>
              <button 
                onClick={() => setActiveTab('list')}
                className="btn btn-secondary"
              >
                ← Geri Dön
              </button>
            </div>
            
            <div className="details-content">
              <div className="details-grid">
                <div className="detail-section">
                  <h3>👤 İletişim Bilgileri</h3>
                  <div className="detail-item">
                    <label>Ad Soyad:</label>
                    <span>{selectedOffer.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>E-posta:</label>
                    <span>{selectedOffer.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Telefon:</label>
                    <span>{selectedOffer.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Şirket:</label>
                    <span>{selectedOffer.company}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>💼 Proje Bilgileri</h3>
                  <div className="detail-item">
                    <label>Hizmet Türü:</label>
                    <span>
                      {getServiceInfo(selectedOffer.serviceType).icon} {' '}
                      {getServiceInfo(selectedOffer.serviceType).label}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Bütçe:</label>
                    <span>💰 {selectedOffer.budget}</span>
                  </div>
                  <div className="detail-item">
                    <label>Zaman Çizelgesi:</label>
                    <span>⏰ {selectedOffer.timeline}</span>
                  </div>
                  <div className="detail-item">
                    <label>Durum:</label>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusInfo(selectedOffer.status).color }}
                    >
                      {getStatusInfo(selectedOffer.status).icon} {' '}
                      {getStatusInfo(selectedOffer.status).label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="detail-section full-width">
                <h3>📝 Proje Açıklaması</h3>
                <div className="description-content">
                  {selectedOffer.description}
                </div>
              </div>
              
              <div className="detail-section full-width">
                <h3>📅 Tarih Bilgileri</h3>
                <div className="date-info">
                  <div className="detail-item">
                    <label>Oluşturulma:</label>
                    <span>{new Date(selectedOffer.createdAt).toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="detail-item">
                    <label>Son Güncelleme:</label>
                    <span>{new Date(selectedOffer.updatedAt).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="details-actions">
              <button 
                onClick={() => openResponseForm(selectedOffer)}
                className="btn btn-primary"
              >
                📧 Yanıtla
              </button>
              <button 
                onClick={() => updateOfferStatus(selectedOffer._id, 'archived')}
                className="btn btn-secondary"
              >
                📁 Arşivle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yanıt Formu */}
      {activeTab === 'response' && selectedOffer && (
        <div className="response-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>📧 Yanıt Gönder</h2>
              <button 
                onClick={() => setActiveTab('list')}
                className="btn btn-secondary"
              >
                ← Geri Dön
              </button>
            </div>
            
            <div className="recipient-info">
              <h3>Alıcı Bilgileri</h3>
              <p><strong>Ad:</strong> {selectedOffer.name}</p>
              <p><strong>E-posta:</strong> {selectedOffer.email}</p>
              <p><strong>Şirket:</strong> {selectedOffer.company}</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); sendResponse(); }}>
              <div className="form-group">
                <label>Konu *</label>
                <input
                  type="text"
                  value={responseForm.subject}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="E-posta konusu"
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Mesaj *</label>
                <textarea
                  value={responseForm.message}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Yanıt mesajınızı yazın..."
                  rows={10}
                  required
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label>Teklif Durumu</label>
                <select
                  value={responseForm.status}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, status: e.target.value }))}
                  className="form-control"
                >
                  {offerStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.icon} {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="btn btn-secondary"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  📧 Yanıt Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffersManagement;