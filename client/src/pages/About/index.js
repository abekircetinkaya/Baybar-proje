import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FiTarget, 
  FiEye, 
  FiAward, 
  FiUsers, 
  FiLayers, 
  FiTrendingUp, 
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiGlobe,
  FiShield,
  FiZap,
  FiHeart,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiMail
} from 'react-icons/fi';
import './About.scss';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Company values data
  const values = [
    {
      id: 1,
      title: 'Müşteri Odaklılık',
      description: 'Müşteri memnuniyetini her zaman ön planda tutarak, onların ihtiyaçlarına en iyi şekilde yanıt veriyoruz.',
      icon: <FiUsers />,
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Kalite ve Mükemmellik',
      description: 'En yüksek kalite standartlarını benimseyerek, ürün ve hizmetlerimizde sürekli iyileştirme sağlıyoruz.',
      icon: <FiAward />,
      color: '#10b981'
    },
    {
      id: 3,
      title: 'Yenilikçilik',
      description: 'Sektördeki gelişmeleri takip ederek, yenilikçi çözümlerle fark yaratıyoruz.',
      icon: <FiZap />,
      color: '#8b5cf6'
    },
    {
      id: 4,
      title: 'Güvenilirlik',
      description: 'Sözümüzün arkasında durarak, müşterilerimizin güvenini kazanmayı hedefliyoruz.',
      icon: <FiShield />,
      color: '#f59e0b'
    },
    {
      id: 5,
      title: 'Sürdürülebilirlik',
      description: 'Çevreye duyarlı ve sürdürülebilir iş modelleriyle gelecek nesillere değer katıyoruz.',
      icon: <FiGlobe />,
      color: '#06b6d4'
    },
    {
      id: 6,
      title: 'Takım Ruhu',
      description: 'Güçlü ekip çalışması ve işbirliği ile hedeflerimize birlikte ulaşıyoruz.',
      icon: <FiHeart />,
      color: '#ec4899'
    }
  ];

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Eren Bekiroğlu',
      position: 'Kurucu & CEO',
      image: '/images/team/eren-bekiroglu.jpg',
      bio: '15+ yıllık sektör deneyimi ile şirketimizin vizyoner lideridir. E-ticaret ve dijital dönüşüm konusunda uzmandır.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['Strateji', 'E-ticaret', 'Liderlik']
    },
    {
      id: 2,
      name: 'Ayşe Teknoloji',
      position: 'Teknoloji Direktörü',
      image: '/images/team/ayse-teknoloji.jpg',
      bio: 'Full-stack geliştirme ve sistem mimarisi konusunda uzmanlaşmış, yenilikçi çözümler üretmeye odaklanmıştır.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['Full-Stack', 'DevOps', 'Cloud']
    },
    {
      id: 3,
      name: 'Mehmet Pazarlama',
      position: 'Pazarlama Müdürü',
      image: '/images/team/mehmet-pazarlama.jpg',
      bio: 'Dijital pazarlama stratejileri ve müşteri deneyimi konusunda uzman, veri odaklı çözümler geliştirir.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['SEO/SEM', 'Analytics', 'Growth']
    },
    {
      id: 4,
      name: 'Zeynep Tasarım',
      position: 'Tasarım Yöneticisi',
      image: '/images/team/zeynep-tasarim.jpg',
      bio: 'Kullanıcı odaklı tasarımlar ve yaratıcı çözümlerle marka kimliğimizi güçlendiriyor.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['UI/UX', 'Branding', 'Creative']
    },
    {
      id: 5,
      name: 'Ali Geliştirme',
      position: 'Lead Developer',
      image: '/images/team/ali-gelistirme.jpg',
      bio: 'Modern web teknolojileri ve performans optimizasyonu konusunda uzman geliştirici.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['React', 'Node.js', 'Performance']
    },
    {
      id: 6,
      name: 'Fatma İş Geliştirme',
      position: 'İş Geliştirme Uzmanı',
      image: '/images/team/fatma-is-gelistirme.jpg',
      bio: 'Müşteri ilişkileri ve iş ortaklıkları konusunda uzman, stratejik büyümeyi yönetiyor.',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      },
      expertise: ['Sales', 'Partnerships', 'Strategy']
    }
  ];

  // Statistics data
  const stats = [
    { id: 1, number: '10+', label: 'Yıllık Deneyim', icon: <FiStar /> },
    { id: 2, number: '500+', label: 'Mutlu Müşteri', icon: <FiUsers /> },
    { id: 3, number: '150+', label: 'Tamamlanan Proje', icon: <FiCheckCircle /> },
    { id: 4, number: '25+', label: 'Uzman Ekip Üyesi', icon: <FiAward /> }
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      position: 'CEO, TechCorp',
      company: 'TechCorp A.Ş.',
      content: 'Baybar ekibi ile çalışmak harika bir deneyimdi. E-ticaret projemizi zamanında ve beklentilerimizi aşan kalitede teslim ettiler.',
      rating: 5,
      image: '/images/testimonials/ahmet-yilmaz.jpg'
    },
    {
      id: 2,
      name: 'Merve Kaya',
      position: 'Pazarlama Müdürü',
      company: 'Fashion Brand',
      content: 'Dijital dönüşüm sürecimizde bizimle birlikte oldular. Sonuçlar beklentilerimizi fazlasıyla karşıladı.',
      rating: 5,
      image: '/images/testimonials/merve-kaya.jpg'
    },
    {
      id: 3,
      name: 'Can Demir',
      position: 'Kurucu',
      company: 'StartupXYZ',
      content: 'MVP\'mizi geliştirme sürecinde profesyonel yaklaşımları ve teknik uzmanlıkları çok etkileyiciydi.',
      rating: 5,
      image: '/images/testimonials/can-demir.jpg'
    }
  ];

  // Mission/Vision/Values content
  const tabContent = {
    mission: {
      title: 'Misyonumuz',
      description: 'Müşterilerimize en kaliteli dijital çözümleri sunarak, onların işlerini büyütmelerine ve hedeflerine ulaşmalarına yardımcı olmak. Yenilikçi teknolojiler ve uzman ekibimizle sektörde fark yaratarak, müşteri memnuniyetini her zaman ön planda tutuyoruz.',
      icon: <FiTarget />,
      highlights: [
        'Müşteri odaklı çözümler geliştirmek',
        'Yenilikçi teknolojilerle değer yaratmak',
        'Sürdürülebilir büyüme sağlamak',
        'Kaliteli hizmet standartlarını korumak'
      ]
    },
    vision: {
      title: 'Vizyonumuz',
      description: 'Türkiye\'nin önde gelen dijital dönüşüm partneri olarak, küresel ölçekte tanınan ve tercih edilen bir teknoloji şirketi olmak. Gelecekte daha geniş kitlelere ulaşarak, sürdürülebilir büyümeyi hedefliyoruz.',
      icon: <FiEye />,
      highlights: [
        'Sektörde lider marka olmak',
        'Küresel pazarda yer almak',
        'Sürdürülebilir teknolojiler geliştirmek',
        'Dijital ekosistemin parçası olmak'
      ]
    },
    values: {
      title: 'Değerlerimiz',
      description: 'Çalışma prensiplerimizin temelini oluşturan değerlerimiz, iş yapış şeklimizin ve kurum kültürümüzün ayrılmaz bir parçasıdır.',
      icon: <FiAward />,
      highlights: [
        'Etik ve dürüstlük',
        'Sürekli öğrenme ve gelişim',
        'Şeffaflık ve hesap verebilirlik',
        'Sosyal sorumluluk bilinci'
      ]
    }
  };

  const currentContent = tabContent[activeTab];

  return (
    <div className="about-page">
      <Helmet>
        <title>Hakkımızda | Baybar - Dijital Dönüşüm Partneri</title>
        <meta 
          name="description" 
          content="Baybar hakkında daha fazla bilgi edinin. Vizyonumuz, misyonumuz, ekibimiz, değerlerimiz ve başarı hikayelerimizle tanışın." 
        />
        <meta name="keywords" content="hakkımızda, vizyon, misyon, ekip, değerler, teknoloji, dijital dönüşüm" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Dijital Dünyada 
                <span className="gradient-text"> Güvenilir Partneriniz</span>
              </h1>
              <p className="hero-subtitle">
                10 yılı aşkın deneyimimizle, işletmelerin dijital dönüşüm yolculuğunda 
                yanlarında oluyoruz. Yenilikçi çözümlerimiz ve uzman ekibimizle 
                geleceği birlikte inşa ediyoruz.
              </p>
              <div className="hero-buttons">
                <Link to="/hizmetler" className="btn btn-primary">
                  Hizmetlerimizi Keşfedin
                  <FiArrowRight />
                </Link>
                <Link to="/iletisim" className="btn btn-outline">
                  Bizimle İletişime Geçin
                </Link>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-card">
                <div className="card-stats">
                  {stats.map((stat, index) => (
                    <div key={stat.id} className={`stat-item animate-delay-${index}`}>
                      <div className="stat-icon">{stat.icon}</div>
                      <div className="stat-content">
                        <span className="stat-number">{stat.number}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision Values Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Kim Olduğumuz</h2>
            <p className="section-subtitle">
              Değerlerimiz ve vizyonumuzla geleceği şekillendiriyoruz
            </p>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              {Object.keys(tabContent).map((key) => (
                <button
                  key={key}
                  className={`tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <span className="tab-icon">{tabContent[key].icon}</span>
                  <span className="tab-label">{tabContent[key].title}</span>
                </button>
              ))}
            </div>

            <div className="tab-content">
              <div className="tab-pane active">
                <div className="content-wrapper">
                  <div className="content-text">
                    <div className="content-icon">
                      {currentContent.icon}
                    </div>
                    <h3>{currentContent.title}</h3>
                    <p>{currentContent.description}</p>
                    
                    <ul className="highlights-list">
                      {currentContent.highlights.map((highlight, index) => (
                        <li key={index}>
                          <FiCheckCircle className="check-icon" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {activeTab === 'values' && (
                    <div className="values-showcase">
                      <div className="values-grid">
                        {values.map((value, index) => (
                          <div key={value.id} className={`value-card animate-delay-${index}`}>
                            <div className="value-icon" style={{ color: value.color }}>
                              {value.icon}
                            </div>
                            <h4>{value.title}</h4>
                            <p>{value.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Uzman Ekibimiz</h2>
            <p className="section-subtitle">
              Alanında uzman profesyonellerden oluşan güçlü ekibimizle yanınızdayız
            </p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={member.id} className={`team-card animate-delay-${index}`}>
                <div className="team-card-inner">
                  <div className="team-card-front">
                    <div className="member-image">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="member-initials">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-position">{member.position}</p>
                      <div className="expertise-tags">
                        {member.expertise.map((skill, i) => (
                          <span key={i} className="expertise-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="team-card-back">
                    <div className="member-bio">
                      <p>{member.bio}</p>
                    </div>
                    <div className="social-links">
                      <a href={member.social.linkedin} aria-label={`${member.name} LinkedIn`}>
                        <FiLinkedin />
                      </a>
                      <a href={member.social.twitter} aria-label={`${member.name} Twitter`}>
                        <FiTwitter />
                      </a>
                      <a href={member.social.github} aria-label={`${member.name} GitHub`}>
                        <FiGithub />
                      </a>
                      <a href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@baybar.com`} aria-label={`${member.name} Email`}>
                        <FiMail />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Müşterilerimiz Ne Diyor</h2>
            <p className="section-subtitle">
              Birlikte çalıştığımız müşterilerimizin deneyimleri
            </p>
          </div>

          <div className="testimonials-carousel">
            <div className="testimonial-container">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}
                >
                  <div className="testimonial-content">
                    <div className="quote-mark">"</div>
                    <p>{testimonial.content}</p>
                    <div className="rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="star filled" />
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="author-initials">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.position}</p>
                      <span>{testimonial.company}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Projelerinizi Hayata Geçirelim</h2>
            <p>
              Dijital dönüşüm yolculuğunuzda size rehberlik edelim. 
              Uzman ekibimizle birlikte geleceği inşa etmeye başlayın.
            </p>
            <div className="cta-buttons">
              <Link to="/hizmetler" className="btn btn-primary">
                Hizmetlerimizi İnceleyin
                <FiArrowRight />
              </Link>
              <Link to="/iletisim" className="btn btn-outline">
                Ücretsiz Danışmanlık Alın
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;