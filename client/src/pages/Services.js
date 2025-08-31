/**
 * Baybar Kurumsal Tanıtım Sitesi - Hizmetler ve Ücretler Sayfası
 * Detaylı hizmet açıklamaları, özellikler ve fiyatlandırma paketleri
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planService } from '../services';
import './Services.scss';

// UI bileşenleri
import Loading from '../components/ui/Loading';
import FAQ from '../components/ui/FAQ';

const Services = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [servicesData, setServicesData] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [activeService, setActiveService] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('professional');


  // Plan URL'si oluşturma fonksiyonu
  const createPlanUrl = (plan) => {
    const planSlug = plan.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `/hizmetler/${planSlug}-satin-alma`;
  };

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setIsLoading(true);
        
        // Fiyatlandırma paketlerini API'den çek
        const plansResponse = await planService.getAll();
        if (plansResponse.success && plansResponse.data) {
          setPricingPlans(plansResponse.data);
        } else {
          // Fallback data
          setPricingPlans(getDefaultPlans());
        }
        
        // Hizmetler verisi (şimdilik statik, ileride API'den gelecek)
        setServicesData([
          {
            id: 1,
            title: "E-Ticaret Platformu Geliştirme",
            subtitle: "Modern ve ölçeklenebilir e-ticaret çözümleri",
            description: "İşletmenizin ihtiyaçlarına özel tasarlanmış, güvenli ve kullanıcı dostu e-ticaret platformları geliştiriyoruz. Responsive tasarım, hızlı performans ve SEO optimizasyonu ile müşterilerinize en iyi alışveriş deneyimini sunuyoruz.",
            icon: "🛒",
            category: "ecommerce",
            features: [
              "Responsive ve mobil uyumlu tasarım",
              "Güvenli ödeme sistemi entegrasyonu",
              "Gelişmiş stok ve envanter yönetimi",
              "Çoklu dil ve para birimi desteği",
              "SEO optimizasyonu ve hız optimizasyonu",
              "Raporlama ve analitik sistemi",
              "Sosyal medya entegrasyonu",
              "Canlı chat ve müşteri destek sistemi"
            ],
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
            deliveryTime: "4-8 hafta",
            support: "1 yıl ücretsiz teknik destek"
          },
          {
            id: 2,
            title: "Uluslararası Pazarlama",
            subtitle: "Global pazarlarda etkili dijital pazarlama stratejileri",
            description: "Markanızı uluslararası pazarlarda güçlü bir şekilde konumlandırmak için kapsamlı dijital pazarlama hizmetleri sunuyoruz. SEO, SEM, sosyal medya pazarlama ve içerik stratejileri ile hedef kitlenize ulaşmanızı sağlıyoruz.",
            icon: "🌍",
            category: "marketing",
            features: [
              "Uluslararası SEO ve yerel arama optimizasyonu",
              "Google Ads ve sosyal medya reklamları",
              "İçerik pazarlama ve blog yönetimi",
              "Sosyal medya hesap yönetimi",
              "E-posta pazarlama kampanyaları",
              "Influencer pazarlama stratejileri",
              "Pazar analizi ve rakip araştırması",
              "Performans raporlama ve analitik"
            ],
            technologies: ["Google Analytics", "Google Ads", "Facebook Ads", "Mailchimp", "Hootsuite"],
            deliveryTime: "2-4 hafta",
            support: "Sürekli optimizasyon ve raporlama"
          },
          {
            id: 3,
            title: "Lojistik ve Kargo Çözümleri",
            subtitle: "Hızlı ve güvenilir uluslararası kargo hizmetleri",
            description: "Dünya genelinde güvenilir kargo ağımız ile ürünlerinizi müşterilerinize hızlı ve güvenli bir şekilde ulaştırıyoruz. Gerçek zamanlı takip sistemi ve sigortalı gönderim seçenekleri ile tam güvence sağlıyoruz.",
            icon: "📦",
            category: "logistics",
            features: [
              "150+ ülkeye hızlı teslimat",
              "Gerçek zamanlı kargo takip sistemi",
              "Sigortalı ve güvenli paketleme",
              "Gümrük işlemleri yönetimi",
              "Toplu gönderim indirimleri",
              "Otomatik kargo etiketleme",
              "İade ve değişim yönetimi",
              "7/24 kargo destek hattı"
            ],
            technologies: ["DHL API", "FedEx API", "UPS API", "Tracking System", "Customs API"],
            deliveryTime: "1-3 iş günü",
            support: "7/24 lojistik destek"
          },
          {
            id: 4,
            title: "Müşteri Destek Hizmetleri",
            subtitle: "Profesyonel çoklu dil müşteri destek çözümleri",
            description: "Müşteri memnuniyetinizi en üst seviyede tutmak için 7/24 profesyonel müşteri destek hizmetleri sunuyoruz. Çoklu dil desteği, canlı chat, telefon ve e-posta desteği ile müşterilerinizin tüm sorularını yanıtlıyoruz.",
            icon: "🎧",
            category: "support",
            features: [
              "7/24 canlı müşteri destek",
              "15+ dilde destek hizmeti",
              "Canlı chat, telefon ve e-posta desteği",
              "Ticket sistemi ve takip",
              "Müşteri memnuniyet anketleri",
              "Sosyal medya destek yönetimi",
              "FAQ ve bilgi bankası oluşturma",
              "Müşteri geri bildirim raporları"
            ],
            technologies: ["Zendesk", "Intercom", "Freshdesk", "Slack", "Zoom"],
            deliveryTime: "1-2 hafta",
            support: "Sürekli eğitim ve kalite kontrolü"
          }
        ]);
        
      } catch (error) {
        console.error('Hizmetler sayfası verileri yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesData();
  }, []);

  // Kategori bazlı fiyatlandırma fonksiyonu
  const getPlansByCategory = (category) => {
    const basePlans = getDefaultPlans();
    
    const categoryPricing = {
      ecommerce: {
        starter: { price: '1.499', setupFee: '249₺ kurulum ücreti (tek seferlik)' },
        advanced: { price: '2.999', setupFee: 'Kurulum ücretsiz + 1 ay ücretsiz deneme' },
        custom: { price: 'Özel Fiyat', setupFee: 'Özel fiyatlandırma ve ödeme koşulları' }
      },
      marketing: {
        starter: { price: '999', setupFee: '199₺ kurulum ücreti (tek seferlik)' },
        advanced: { price: '2.499', setupFee: 'Kurulum ücretsiz + 1 ay ücretsiz deneme' },
        custom: { price: 'Özel Fiyat', setupFee: 'Özel fiyatlandırma ve ödeme koşulları' }
      },
      logistics: {
        starter: { price: '799', setupFee: '149₺ kurulum ücreti (tek seferlik)' },
        advanced: { price: '1.999', setupFee: 'Kurulum ücretsiz + 1 ay ücretsiz deneme' },
        custom: { price: 'Özel Fiyat', setupFee: 'Özel fiyatlandırma ve ödeme koşulları' }
      },
      support: {
        starter: { price: '699', setupFee: '99₺ kurulum ücreti (tek seferlik)' },
        advanced: { price: '1.799', setupFee: 'Kurulum ücretsiz + 1 ay ücretsiz deneme' },
        custom: { price: 'Özel Fiyat', setupFee: 'Özel fiyatlandırma ve ödeme koşulları' }
      }
    };

    const categoryInfo = categoryPricing[category] || categoryPricing.ecommerce;
    
    return basePlans.map(plan => ({
      ...plan,
      price: categoryInfo[plan.id]?.price || plan.price,
      setupFee: categoryInfo[plan.id]?.setupFee || plan.setupFee
    }));
  };

  // Seçili hizmete göre planları güncelle
  useEffect(() => {
    if (servicesData.length > 0 && servicesData[activeService]) {
      const category = servicesData[activeService].category || 'ecommerce';
      setPricingPlans(getPlansByCategory(category));
    }
  }, [activeService, servicesData]);

  // Fallback plan verileri
  const getDefaultPlans = () => {
    return [
      {
        id: 'starter',
        name: 'Başlangıç',
        subtitle: 'Küçük işletmeler için ideal başlangıç paketi',
        price: '1.499',
        currency: '₺',
        period: '/ay',
        popular: false,
        description: 'E-ticaret yolculuğunuza başlamak için ihtiyacınız olan tüm temel özellikler',
        features: [
          'Profesyonel web sitesi kurulumu',
          'Mobil uyumlu responsive tasarım',
          'Temel SEO optimizasyonu',
          '5 kurumsal e-posta hesabı',
          'SSL sertifikası ve güvenlik',
          '15 GB depolama alanı',
          'Google Analytics entegrasyonu',
          'Sosyal medya entegrasyonu',
          'Yıllık bakım ve güncelleme',
          'E-posta ve telefon desteği',
          'Ödeme sistemi entegrasyonu (2 banka)',
          'Temel ürün yönetimi (100 ürüne kadar)'
        ],
        limitations: [
          'Sınırlı özelleştirme seçenekleri',
          'Standart tema şablonları',
          'Mesai saatleri teknik destek (09:00-18:00)'
        ],
        cta: 'Planı Gör',
        setupFee: '249₺ kurulum ücreti (tek seferlik)'
      },
      {
        id: 'advanced',
        name: 'Gelişmiş',
        subtitle: 'Büyüyen işletmeler için kapsamlı e-ticaret çözümü',
        price: '2.999',
        currency: '₺',
        period: '/ay',
        popular: true,
        description: 'Rekabette öne çıkmanızı sağlayacak gelişmiş özellikler ve pazarlama araçları',
        features: [
          'Özel tasarımlı e-ticaret platformu',
          'Marka kimliğinize uygun tema geliştirme',
          'Kapsamlı SEO ve dijital pazarlama desteği',
          '20 kurumsal e-posta hesabı',
          'Çoklu dil ve para birimi desteği (5 dil)',
          'Canlı chat ve öncelikli müşteri desteği',
          'Gelişmiş analitik ve satış raporlama',
          'Sosyal medya pazarlama kampanyaları',
          '100 GB depolama alanı',
          'E-posta pazarlama ve otomasyon',
          'Gelişmiş güvenlik ve yedekleme',
          'Aylık bakım ve performans optimizasyonu',
          'Çoklu ödeme sistemi entegrasyonu',
          'Gelişmiş ürün yönetimi (1000+ ürün)'
        ],
        limitations: [],
        cta: 'Planı Gör',
        setupFee: 'Kurulum ücretsiz + 1 ay ücretsiz deneme'
      },
      {
        id: 'custom',
        name: 'Özel Plan',
        subtitle: 'Kurumsal işletmeler için özelleştirilmiş çözümler',
        price: 'Özel Fiyat',
        currency: '',
        period: '',
        popular: false,
        description: 'İşletmenizin benzersiz ihtiyaçlarına göre tamamen özelleştirilmiş kurumsal çözümler',
        features: [
          'Tamamen özel geliştirme ve tasarım',
          'Kurumsal kimliğe özel platform',
          'Kişiselleştirilmiş pazarlama stratejileri',
          'Sınırsız e-posta hesabı ve alan adı',
          'Sınırsız dil ve para birimi desteği',
          '7/24 VIP destek ve acil müdahale',
          'Özel yönetim paneli ve raporlama',
          'ERP, CRM ve diğer sistemlerle API entegrasyonu',
          'Sınırsız depolama ve bant genişliği',
          'Özel sunucu altyapısı ve CDN',
          'Dedicated hesap ve proje yöneticisi',
          'Özel eğitim ve danışmanlık hizmeti',
          'Uluslararası pazarlara özel çözümler',
          'Yapay zeka destekli müşteri deneyimi'
        ],
        limitations: [],
        cta: 'Teklif Al',
        setupFee: 'Özel fiyatlandırma ve ödeme koşulları'
      }
    ];
  };

  // Sayfa başlığını güncelle
  useEffect(() => {
    document.title = 'Hizmetler ve Ücretler - Baybar | E-Ticaret Çözümleri';
  }, []);

  if (isLoading) {
    return <Loading variant="logo" size="large" fullscreen text="Sayfa yükleniyor..." />;
  }

  return (
    <div className="services">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <div className="services-hero__content">
            <h1 className="services-hero__title">Hizmetlerimiz ve Ücretler</h1>
            <p className="services-hero__subtitle">
              E-ticaret dünyasında başarıya ulaşmanız için ihtiyacınız olan tüm hizmetleri 
              şeffaf fiyatlandırma ile sunuyoruz
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="services-detail section">
        <div className="container">
          <div className="services-detail__nav">
            {servicesData.map((service, index) => (
              <button
                key={service.id}
                className={`services-nav__item ${activeService === index ? 'active' : ''}`}
                onClick={() => setActiveService(index)}
              >
                <span className="services-nav__icon">{service.icon}</span>
                <span className="services-nav__title">{service.title}</span>
              </button>
            ))}
          </div>
          
          <div className="services-detail__content">
            {servicesData[activeService] && (
              <div className="service-detail">
                <div className="service-detail__header">
                  <div className="service-detail__icon">
                    {servicesData[activeService].icon}
                  </div>
                  <div className="service-detail__info">
                    <h2 className="service-detail__title">
                      {servicesData[activeService].title}
                    </h2>
                    <p className="service-detail__subtitle">
                      {servicesData[activeService].subtitle}
                    </p>
                  </div>
                </div>
                
                <div className="service-detail__body">
                  <div className="service-detail__description">
                    <p>{servicesData[activeService].description}</p>
                  </div>
                  
                  <div className="service-detail__grid">
                    <div className="service-detail__features">
                      <h3>Özellikler</h3>
                      <ul>
                        {servicesData[activeService].features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="service-detail__meta">
                      <div className="service-meta">
                        <h4>Teknolojiler</h4>
                        <div className="tech-tags">
                          {servicesData[activeService].technologies.map((tech, index) => (
                            <span key={index} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="service-meta">
                        <h4>Teslimat Süresi</h4>
                        <p>{servicesData[activeService].deliveryTime}</p>
                      </div>
                      
                      <div className="service-meta">
                        <h4>Destek</h4>
                        <p>{servicesData[activeService].support}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing section section--gray">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Fiyatlandırma Paketleri</h2>
            <p className="section__subtitle">
              İşletmenizin büyüklüğüne ve ihtiyaçlarına uygun paket seçenekleri
            </p>
          </div>
          
          <div className="pricing__grid">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.popular ? 'pricing-card--popular' : ''}`}
              >
                {plan.popular && (
                  <div className="pricing-card__badge">En Popüler</div>
                )}
                
                <div className="pricing-card__header">
                  <h3 className="pricing-card__name">{plan.name}</h3>
                  <p className="pricing-card__subtitle">{plan.subtitle}</p>
                  <div className="pricing-card__price">
                    <span className="price__currency">{plan.currency || '€'}</span>
                    <span className="price__amount">{plan.price || plan.monthlyPrice || 'Özel'}</span>
                    <span className="price__period">{plan.period || (plan.monthlyPrice ? '/ay' : '')}</span>
                  </div>
                  <p className="pricing-card__description">{plan.description}</p>
                </div>
                
                <div className="pricing-card__body">
                  <ul className="pricing-card__features">
                    {(plan.features || []).map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✓</span>
                        {typeof feature === 'string' ? feature : feature.name || feature.title}
                      </li>
                    ))}
                  </ul>
                  
                  {(plan.limitations && plan.limitations.length > 0) && (
                    <ul className="pricing-card__limitations">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="limitation-item">
                          <span className="limitation-icon">−</span>
                          {typeof limitation === 'string' ? limitation : limitation.name || limitation.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="pricing-card__footer">
                  {plan.id === 'custom' ? (
                    <Link 
                      to="/iletisim"
                      className="btn btn--primary btn--large btn--full"
                    >
                      Teklif Al
                    </Link>
                  ) : (
                    <Link 
                      to={`/plan-detail/${plan.id}`}
                      className={`btn ${plan.popular ? 'btn--primary' : 'btn--outline'} btn--large btn--full`}
                    >
                      Planı Özelleştir
                    </Link>
                  )}
                  <p className="pricing-card__setup-fee">{plan.setupFee || plan.setupPrice || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>






    </div>
  );
};

export default Services;