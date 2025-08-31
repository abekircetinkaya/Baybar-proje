import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PurchaseDetail.scss';

const PurchaseDetail = () => {
  const { planName } = useParams();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [projectDescription, setProjectDescription] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [teamInfo, setTeamInfo] = useState({
    teamSize: '',
    hasDesigner: false,
    hasDeveloper: false,
    hasMarketing: false
  });
  const [projectOptions, setProjectOptions] = useState({
    hasEcommerce: false,
    hasBlog: false,
    hasMultiLanguage: false,
    hasAdvancedSEO: false,
    hasAnalytics: false,
    hasSocialMedia: false,
    hasLiveChat: false,
    hasBookingSystem: false
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Plan verilerini tanımla
  const pricingPlans = [
    {
      id: 'baslangic',
      name: 'Başlangıç',
      price: '2.999',
      description: 'Küçük işletmeler için ideal başlangıç paketi',
      features: [
        'Responsive Web Tasarım',
        '5 Sayfa İçerik',
        'Temel SEO Optimizasyonu',
        'İletişim Formu',
        '1 Yıl Hosting',
        'SSL Sertifikası',
        'Google Analytics',
        'Sosyal Medya Entegrasyonu'
      ]
    },
    {
      id: 'profesyonel',
      name: 'Profesyonel',
      price: '4.999',
      description: 'Büyüyen işletmeler için kapsamlı çözüm',
      features: [
        'Özel Tasarım',
        '10 Sayfa İçerik',
        'Gelişmiş SEO',
        'Blog Sistemi',
        'E-ticaret Hazırlığı',
        '2 Yıl Hosting',
        'Premium SSL',
        'Hız Optimizasyonu',
        'Yedekleme Sistemi'
      ]
    },
    {
      id: 'kurumsal',
      name: 'Kurumsal',
      price: '7.999',
      description: 'Büyük şirketler için tam özellikli platform',
      features: [
        'Kurumsal Tasarım',
        'Sınırsız Sayfa',
        'Profesyonel SEO',
        'CMS Sistemi',
        'E-ticaret Modülü',
        '3 Yıl Hosting',
        'Kurumsal SSL',
        'CDN Hizmet',
        'Öncelikli Destek',
        'Performans İzleme'
      ]
    }
  ];

  // Dinamik fiyat hesaplama fonksiyonu
  const calculatePrice = () => {
    if (!planData) return 0;
    
    let basePrice = parseInt(planData.price.replace('.', ''));
    let additionalCost = 0;
    
    // Takım büyüklüğüne göre ek maliyet
    if (teamInfo.teamSize === 'small') additionalCost += 0;
    else if (teamInfo.teamSize === 'medium') additionalCost += 1000;
    else if (teamInfo.teamSize === 'large') additionalCost += 2500;
    
    // Takım ihtiyaçlarına göre ek maliyet
    if (teamInfo.hasDesigner) additionalCost += 800;
    if (teamInfo.hasDeveloper) additionalCost += 1200;
    if (teamInfo.hasMarketing) additionalCost += 600;
    
    // Proje seçeneklerine göre ek maliyet
    if (projectOptions.hasEcommerce) additionalCost += 1500;
    if (projectOptions.hasBlog) additionalCost += 500;
    if (projectOptions.hasMultiLanguage) additionalCost += 800;
    if (projectOptions.hasAdvancedSEO) additionalCost += 700;
    if (projectOptions.hasAnalytics) additionalCost += 300;
    if (projectOptions.hasSocialMedia) additionalCost += 400;
    if (projectOptions.hasLiveChat) additionalCost += 350;
    if (projectOptions.hasBookingSystem) additionalCost += 900;
    
    return basePrice + additionalCost;
  };
  
  useEffect(() => {
    // URL'den plan adını al ve plan verisini bul
    const foundPlan = pricingPlans.find(plan => 
      plan.id === planName || 
      plan.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === planName
    );
    
    if (foundPlan) {
      setPlanData(foundPlan);
    } else {
      // Plan bulunamazsa hizmetler sayfasına yönlendir
      navigate('/hizmetler');
    }
  }, [planName, navigate]);
  
  // Fiyat hesaplamayı güncelle
  useEffect(() => {
    setCalculatedPrice(calculatePrice());
  }, [planData, teamInfo, projectOptions]);

  const handleSubmitPurchase = (e) => {
    e.preventDefault();
    
    // Form validasyonu
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !projectDescription) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    // Satın alma bilgilerini konsola yazdır (gerçek uygulamada API'ye gönderilir)
    console.log('Satın Alma Bilgileri:', {
      plan: planData,
      customer: customerInfo,
      project: projectDescription,
      teamInfo: teamInfo,
      projectOptions: projectOptions,
      basePrice: parseInt(planData.price.replace('.', '')),
      calculatedPrice: calculatedPrice,
      timestamp: new Date().toISOString()
    });
    
    alert(`Teklif talebiniz başarıyla gönderildi! Hesaplanan fiyat: ₺${calculatedPrice.toLocaleString()}. En kısa sürede sizinle iletişime geçeceğiz.`);
    
    // Formu temizle
    setProjectDescription('');
    setCustomerInfo({ name: '', email: '', phone: '', company: '' });
    setTeamInfo({ teamSize: '', hasDesigner: false, hasDeveloper: false, hasMarketing: false });
    setProjectOptions({
      hasEcommerce: false,
      hasBlog: false,
      hasMultiLanguage: false,
      hasAdvancedSEO: false,
      hasAnalytics: false,
      hasSocialMedia: false,
      hasLiveChat: false,
      hasBookingSystem: false
    });
  };

  const goBack = () => {
    navigate('/hizmetler');
  };

  if (!planData) {
    return (
      <div className="purchase-detail-loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="purchase-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={goBack} className="breadcrumb__back">
            ← Hizmetlere Dön
          </button>
          <span className="breadcrumb__current">{planData.name} - Satın Alma</span>
        </div>

        <div className="purchase-detail-content">
          {/* Sol Taraf - Plan Bilgileri */}
          <div className="plan-info-section">
            <div className="plan-card">
              <div className="plan-card__header">
                <h1 className="plan-card__title">{planData.name} Paketi</h1>
                <div className="plan-card__price">
                  <div className="price-display">
                    <div className="base-price">
                      <span className="price-label">Temel Fiyat:</span>
                      <span className="price__currency">₺</span>
                      <span className="price__amount">{planData.price}</span>
                    </div>
                    {calculatedPrice > parseInt(planData.price.replace('.', '')) && (
                      <div className="calculated-price">
                        <span className="price-label">Seçimlerinize Göre:</span>
                        <span className="price__currency">₺</span>
                        <span className="price__amount">{calculatedPrice.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <span className="price__period">/proje</span>
                </div>
              </div>
              
              <p className="plan-card__description">{planData.description}</p>
              
              <div className="plan-card__features">
                <h3>Paket İçeriği:</h3>
                <ul className="features-list">
                  {planData.features.map((feature, index) => (
                    <li key={index} className="features-list__item">
                      <span className="feature-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="plan-card__guarantee">
                <div className="guarantee-badge">
                  <span className="guarantee-icon">🛡️</span>
                  <div className="guarantee-text">
                    <strong>%100 Memnuniyet Garantisi</strong>
                    <p>30 gün içinde memnun kalmazsanız paranızı iade ediyoruz</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - İletişim Formu */}
          <div className="form-section">
            <div className="form-card">
              <h2 className="form-card__title">Teklif Talep Formu</h2>
              <p className="form-card__subtitle">
                Projeniz hakkında bilgi verin, size özel bir teklif hazırlayalım.
              </p>
              
              <form className="purchase-form" onSubmit={handleSubmitPurchase}>
                <div className="form-group-section">
                  <h3>İletişim Bilgileri</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">Ad Soyad *</label>
                      <input
                        type="text"
                        id="name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">E-posta *</label>
                      <input
                        type="email"
                        id="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Telefon *</label>
                      <input
                        type="tel"
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="0555 123 45 67"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="company">Şirket Adı</label>
                      <input
                        type="text"
                        id="company"
                        value={customerInfo.company}
                        onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                        placeholder="Şirket adınız (opsiyonel)"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group-section">
                  <h3>Takım Bilgileri</h3>
                  <div className="form-group">
                    <label htmlFor="team-size">Takım Büyüklüğü</label>
                    <select
                      id="team-size"
                      value={teamInfo.teamSize}
                      onChange={(e) => setTeamInfo({...teamInfo, teamSize: e.target.value})}
                    >
                      <option value="">Seçiniz</option>
                      <option value="small">Küçük (1-5 kişi)</option>
                      <option value="medium">Orta (6-15 kişi) +₺1.000</option>
                      <option value="large">Büyük (15+ kişi) +₺2.500</option>
                    </select>
                  </div>
                  
                  <div className="checkbox-group">
                    <h4>Takım İhtiyaçları</h4>
                    <div className="checkbox-grid">
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={teamInfo.hasDesigner}
                          onChange={(e) => setTeamInfo({...teamInfo, hasDesigner: e.target.checked})}
                        />
                        <span>Tasarımcı Desteği (+₺800)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={teamInfo.hasDeveloper}
                          onChange={(e) => setTeamInfo({...teamInfo, hasDeveloper: e.target.checked})}
                        />
                        <span>Geliştirici Desteği (+₺1.200)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={teamInfo.hasMarketing}
                          onChange={(e) => setTeamInfo({...teamInfo, hasMarketing: e.target.checked})}
                        />
                        <span>Pazarlama Desteği (+₺600)</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="form-group-section">
                  <h3>Proje Seçenekleri</h3>
                  <div className="checkbox-group">
                    <div className="checkbox-grid">
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasEcommerce}
                          onChange={(e) => setProjectOptions({...projectOptions, hasEcommerce: e.target.checked})}
                        />
                        <span>E-ticaret Modülü (+₺1.500)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasBlog}
                          onChange={(e) => setProjectOptions({...projectOptions, hasBlog: e.target.checked})}
                        />
                        <span>Blog Sistemi (+₺500)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasMultiLanguage}
                          onChange={(e) => setProjectOptions({...projectOptions, hasMultiLanguage: e.target.checked})}
                        />
                        <span>Çoklu Dil Desteği (+₺800)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasAdvancedSEO}
                          onChange={(e) => setProjectOptions({...projectOptions, hasAdvancedSEO: e.target.checked})}
                        />
                        <span>Gelişmiş SEO (+₺700)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasAnalytics}
                          onChange={(e) => setProjectOptions({...projectOptions, hasAnalytics: e.target.checked})}
                        />
                        <span>Analitik Entegrasyonu (+₺300)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasSocialMedia}
                          onChange={(e) => setProjectOptions({...projectOptions, hasSocialMedia: e.target.checked})}
                        />
                        <span>Sosyal Medya Entegrasyonu (+₺400)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasLiveChat}
                          onChange={(e) => setProjectOptions({...projectOptions, hasLiveChat: e.target.checked})}
                        />
                        <span>Canlı Destek (+₺350)</span>
                      </label>
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={projectOptions.hasBookingSystem}
                          onChange={(e) => setProjectOptions({...projectOptions, hasBookingSystem: e.target.checked})}
                        />
                        <span>Rezervasyon Sistemi (+₺900)</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="form-group-section">
                  <h3>Proje Detayları</h3>
                  <div className="form-group">
                    <label htmlFor="project-description">Projenizi Anlatın *</label>
                    <textarea
                      id="project-description"
                      rows="6"
                      placeholder="Projenizin detaylarını, hedeflerinizi, özel gereksinimlerinizi ve beklentilerinizi açıklayın..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn--outline" onClick={goBack}>
                    İptal
                  </button>
                  <button type="submit" className="btn btn--primary btn--large">
                    Teklif Talep Et
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDetail;