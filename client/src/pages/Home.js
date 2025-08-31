/**
 * Baybar Kurumsal Tanıtım Sitesi - Ana Sayfa
 * Hero section, hizmetler, güven alanı ve CTA içeren ana sayfa bileşeni
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services';
import './Home.scss';

// UI bileşenleri
import Loading from '../components/ui/Loading';
import FAQ from '../components/ui/FAQ';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [heroData, setHeroData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [partnersData, setPartnersData] = useState([]);
  const [featuredWorks, setFeaturedWorks] = useState([]);

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        
        // Simulated API calls - gerçek API'ler hazır olduğunda değiştirilecek
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Hero section verisi
        setHeroData({
          title: "Dijital Dönüşümde Öncü Çözümler",
          subtitle: "İşletmenizi geleceğe taşıyan teknoloji çözümleri ile rekabet avantajı kazanın.",
          ctaText: "Çözümlerimizi Keşfedin",
          stats: [
            { number: "500+", label: "Başarılı Proje" },
            { number: "50+", label: "Mutlu Müşteri" },
            { number: "10+", label: "Yıllık Deneyim" }
          ]
        });
        
        // Hizmetler verisi
        setServicesData([
          {
            id: 1,
            title: "E-Ticaret Platformu Geliştirme",
            description: "Modern, güvenli ve ölçeklenebilir e-ticaret platformları ile işletmenizi dijital dünyaya taşıyoruz.",
            icon: "🛒",
            features: ["Responsive Tasarım", "Güvenli Ödeme", "Stok Yönetimi"]
          },
          {
            id: 2,
            title: "Uluslararası Pazarlama",
            description: "Yurtdışı pazarlarda etkili pazarlama stratejileri ile markanızı global ölçekte büyütüyoruz.",
            icon: "🌍",
            features: ["SEO Optimizasyonu", "Sosyal Medya", "İçerik Pazarlama"]
          },
          {
            id: 3,
            title: "Lojistik ve Kargo Çözümleri",
            description: "Hızlı ve güvenilir kargo ağımız ile ürünlerinizi dünya genelinde müşterilerinize ulaştırıyoruz.",
            icon: "📦",
            features: ["Hızlı Teslimat", "Takip Sistemi", "Güvenli Paketleme"]
          },
          {
            id: 4,
            title: "Müşteri Destek Hizmetleri",
            description: "7/24 profesyonel müşteri destek ekibimiz ile müşteri memnuniyetinizi en üst seviyede tutuyoruz.",
            icon: "🎧",
            features: ["7/24 Destek", "Çoklu Dil", "Canlı Chat"]
          }
        ]);
        
        // İş ortakları verisi
        setPartnersData([
          { id: 1, name: "TechCorp", logo: "/images/partners/techcorp.png" },
          { id: 2, name: "GlobalTrade", logo: "/images/partners/globaltrade.png" },
          { id: 3, name: "EuroCommerce", logo: "/images/partners/eurocommerce.png" },
          { id: 4, name: "AsiaMarket", logo: "/images/partners/asiamarket.png" },
          { id: 5, name: "AmericaShop", logo: "/images/partners/americashop.png" },
          { id: 6, name: "AfricaTrade", logo: "/images/partners/africatrade.png" }
        ]);
        
        // Öne çıkan projeler - API'den getir
        try {
          const featuredProjectsResponse = await projectService.getFeatured();
          if (featuredProjectsResponse.success) {
            setFeaturedWorks(featuredProjectsResponse.data || []);
          } else {
            // Fallback data - Minimalist ve estetik kartlar
            setFeaturedWorks([
              {
                id: 1,
                title: "Global E-Ticaret Platformu",
                description: "Türk markasının uluslararası pazarlarda dijital dönüşümü ile 6 ayda %300 büyüme sağlandı.",
                image: "/images/case-studies/ecommerce-platform.jpg",
                category: "E-Ticaret",
                stats: { metric: "Büyüme", value: "300%", period: "6 ay" },
                technologies: ["React", "Node.js", "MongoDB"],
                color: "#667eea"
              },
              {
                id: 2,
                title: "Akıllı Lojistik Çözümü",
                description: "AI destekli lojistik sistemi ile teslimat süreleri %50 azaltıldı ve müşteri memnuniyeti artırıldı.",
                image: "/images/case-studies/logistics-solution.jpg",
                category: "Lojistik",
                stats: { metric: "Verimlilik", value: "+50%", period: "3 ay" },
                technologies: ["AI/ML", "IoT", "Cloud"],
                color: "#764ba2"
              },
              {
                id: 3,
                title: "Çok Kanallı Pazarlama Platformu",
                description: "Entegre pazarlama sistemi ile 15+ ülkede eş zamanlı kampanya yönetimi ve %200 ROI artışı.",
                image: "/images/case-studies/marketing-platform.jpg",
                category: "Pazarlama",
                stats: { metric: "ROI Artışı", value: "200%", period: "4 ay" },
                technologies: ["Vue.js", "Python", "Analytics"],
                color: "#f093fb"
              },
              {
                id: 4,
                title: "Blockchain Ödeme Sistemi",
                description: "Güvenli ve hızlı blockchain tabanlı ödeme altyapısı ile günlük 10K+ işlem kapasitesi.",
                image: "/images/case-studies/blockchain-payment.jpg",
                category: "Fintech",
                stats: { metric: "İşlem/Gün", value: "10K+", period: "Anlık" },
                technologies: ["Blockchain", "Smart Contracts", "Web3"],
                color: "#4facfe"
              }
            ]);
          }
        } catch (error) {
          console.error('Öne çıkan projeler yüklenirken hata:', error);
          // Fallback data - Minimalist ve estetik kartlar
          setFeaturedWorks([
            {
              id: 1,
              title: "Global E-Ticaret Platformu",
              description: "Türk markasının uluslararası pazarlarda dijital dönüşümü ile 6 ayda %300 büyüme sağlandı.",
              image: "/images/case-studies/ecommerce-platform.jpg",
              category: "E-Ticaret",
              stats: { metric: "Büyüme", value: "300%", period: "6 ay" },
              technologies: ["React", "Node.js", "MongoDB"],
              color: "#667eea"
            },
            {
              id: 2,
              title: "Akıllı Lojistik Çözümü",
              description: "AI destekli lojistik sistemi ile teslimat süreleri %50 azaltıldı ve müşteri memnuniyeti artırıldı.",
              image: "/images/case-studies/logistics-solution.jpg",
              category: "Lojistik",
              stats: { metric: "Verimlilik", value: "+50%", period: "3 ay" },
              technologies: ["AI/ML", "IoT", "Cloud"],
              color: "#764ba2"
            },
            {
              id: 3,
              title: "Çok Kanallı Pazarlama Platformu",
              description: "Entegre pazarlama sistemi ile 15+ ülkede eş zamanlı kampanya yönetimi ve %200 ROI artışı.",
              image: "/images/case-studies/marketing-platform.jpg",
              category: "Pazarlama",
              stats: { metric: "ROI Artışı", value: "200%", period: "4 ay" },
              technologies: ["Vue.js", "Python", "Analytics"],
              color: "#f093fb"
            },
            {
              id: 4,
              title: "Blockchain Ödeme Sistemi",
              description: "Güvenli ve hızlı blockchain tabanlı ödeme altyapısı ile günlük 10K+ işlem kapasitesi.",
              image: "/images/case-studies/blockchain-payment.jpg",
              category: "Fintech",
              stats: { metric: "İşlem/Gün", value: "10K+", period: "Anlık" },
              technologies: ["AI/ML", "IoT", "Cloud"],
              color: "#4facfe"
            }
          ]);
        }
        
      } catch (error) {
        console.error('Ana sayfa verileri yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Sayfa başlığını güncelle
  useEffect(() => {
    document.title = 'Baybar - E-Ticaret Dünyasında Güvenilir Çözüm Ortağınız';
  }, []);

  if (isLoading) {
    return <Loading variant="logo" size="large" fullscreen text="Sayfa yükleniyor..." />;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <div className="hero__shapes">
            <div className="hero__shape hero__shape--1"></div>
            <div className="hero__shape hero__shape--2"></div>
            <div className="hero__shape hero__shape--3"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="hero__content">
            <div className="hero__text">
              <h1 className="hero__title">
                <span className="hero__title-line">{heroData?.title?.split(' ').slice(0, 2).join(' ')}</span>
                <span className="hero__title-line hero__title-line--accent">{heroData?.title?.split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="hero__subtitle">{heroData?.subtitle}</p>
              
              <div className="hero__actions">
                <Link to="/hizmetler" className="btn btn--primary">
                  <span>{heroData?.ctaText}</span>
                  <svg className="btn__icon" viewBox="0 0 24 24">
                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                  </svg>
                </Link>
                <Link to="/iletisim" className="btn btn--ghost">
                  İletişime Geçin
                </Link>
              </div>
            </div>
            
            <div className="hero__stats">
              {heroData?.stats?.map((stat, index) => (
                <div key={index} className="hero__stat">
                  <div className="hero__stat-number">{stat.number}</div>
                  <div className="hero__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="hero__scroll">
          <div className="hero__scroll-indicator">
            <span>Keşfet</span>
            <div className="hero__scroll-line"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Hizmetlerimiz</h2>
            <p className="section__subtitle">
              E-ticaret dünyasında başarıya ulaşmanız için ihtiyacınız olan tüm hizmetleri sunuyoruz
            </p>
          </div>
          
          <div className="services__grid">
            {servicesData.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-card__icon"><span>{service.icon}</span></div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                <ul className="service-card__features">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Link to="/services" className="service-card__link">
                  Daha Fazla Bilgi →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Partners */}
      <section className="trust section section--gray">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Çalıştığımız Firmalar</h2>
            <p className="section__subtitle">
              Dünya genelinde güvenilir iş ortaklarımızla birlikte çalışıyoruz
            </p>
          </div>
          
          <div className="partners">
            <div className="partners__grid">
              {partnersData.map((partner) => (
                <div key={partner.id} className="partner-logo">
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logosu`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="partner-logo__placeholder" style={{ display: 'none' }}>
                    {partner.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Section */}
      <section className="featured-works section">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Öne Çıkan Çalışmalarımız</h2>
            <p className="section__subtitle">
              Müşterilerimizle birlikte elde ettiğimiz başarı hikayeleri
            </p>
          </div>
          
          <div className="works__grid">
            {featuredWorks.map((work) => (
              <div key={work.id || work._id} className="work-card work-card--minimal">
                <div className="work-card__image">
                  <img 
                    src={work.image || '/images/projects/default.jpg'} 
                    alt={work.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="work-card__image-placeholder" style={{ display: 'none' }}>
                    <div className="placeholder-icon">📊</div>
                  </div>
                </div>
                <div className="work-card__content">
                  <div className="work-card__category">{work.category || 'Proje'}</div>
                  <h3 className="work-card__title">{work.title}</h3>
                  <p className="work-card__description">{work.description}</p>
                  
                  {work.technologies && (
                    <div className="work-card__technologies">
                      {work.technologies.slice(0, 3).map((tech, index) => {
                        const techText = typeof tech === 'object' ? tech.name : tech;
                        return (
                          <span key={index} className="tech-tag">{techText}</span>
                        );
                      })}
                      {work.technologies.length > 3 && (
                        <span className="tech-tag tech-tag--more">+{work.technologies.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="work-card__footer">
                    {work.projectUrl ? (
                      <Link to={work.projectUrl} className="work-card__link" target="_blank" rel="noopener noreferrer">
                        <span>Detaylar</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    ) : (
                      <div className="work-card__link">
                        <span>Detaylar</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default Home;