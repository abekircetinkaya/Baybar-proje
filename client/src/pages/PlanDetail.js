/**
 * Plan Detay Sayfası - Proje Özelleştirme Formu
 * Kullanıcıların plan seçip projeyi özelleştirebileceği sayfa
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiSend, FiUser, FiMail, FiPhone, FiMessageCircle, FiCalendar } from 'react-icons/fi';
import { offerService } from '../services';
import Loading from '../components/ui/Loading';
import './PlanDetail.scss';

const PlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    // Müşteri Bilgileri
    fullName: '',
    email: '',
    phone: '',
    company: '',
    
    // Proje Detayları
    projectTitle: '',
    projectDescription: '',
    projectType: '',
    budget: '',
    timeline: '',
    
    // Özel Gereksinimler
    specialRequirements: '',
    targetAudience: '',
    competitorAnalysis: '',
    
    // Teknik Gereksinimler
    technicalRequirements: '',
    integrations: '',
    
    // Tercihler
    designPreference: '',
    features: [],
    additionalServices: []
  });

  const [errors, setErrors] = useState({});

  // Plan bilgilerini getir
  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      try {
        // Plan bilgilerini mock data'dan al (gerçek uygulamada API'den gelecek)
        const mockPlans = {
          'starter': {
            id: 'starter',
            name: 'Başlangıç Planı',
            price: '1.499',
            currency: '₺',
            period: '/ay',
            description: 'Küçük işletmeler için ideal başlangıç paketi',
            features: [
              'Profesyonel web sitesi kurulumu',
              'Mobil uyumlu responsive tasarım',
              'Temel SEO optimizasyonu',
              '5 kurumsal e-posta hesabı',
              'SSL sertifikası ve güvenlik',
              '15 GB depolama alanı'
            ]
          },
          'advanced': {
            id: 'advanced',
            name: 'Gelişmiş Plan',
            price: '2.999',
            currency: '₺',
            period: '/ay',
            popular: true,
            description: 'Büyüyen işletmeler için kapsamlı e-ticaret çözümü',
            features: [
              'Özel tasarımlı e-ticaret platformu',
              'Marka kimliğinize uygun tema geliştirme',
              'Kapsamlı SEO ve dijital pazarlama desteği',
              '20 kurumsal e-posta hesabı',
              'Çoklu dil ve para birimi desteği',
              'Canlı chat ve öncelikli müşteri desteği'
            ]
          },
          'custom': {
            id: 'custom',
            name: 'Özel Plan',
            price: 'Özel Fiyat',
            currency: '',
            period: '',
            description: 'Kurumsal işletmeler için özelleştirilmiş çözümler',
            features: [
              'Tamamen özel geliştirme ve tasarım',
              'Kurumsal kimliğe özel platform',
              'Kişiselleştirilmiş pazarlama stratejileri',
              'Sınırsız e-posta hesabı ve alan adı',
              '7/24 VIP destek ve acil müdahale',
              'Özel yönetim paneli ve raporlama'
            ]
          }
        };

        const planData = mockPlans[planId];
        if (planData) {
          setPlan(planData);
        } else {
          navigate('/hizmetler');
        }
      } catch (error) {
        console.error('Plan bilgileri yüklenirken hata:', error);
        navigate('/hizmetler');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId, navigate]);

  // Form input değişikliklerini handle et
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'features' || name === 'additionalServices') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Hataları temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validasyonu
  const validateForm = () => {
    const newErrors = {};

    // Zorunlu alanlar
    if (!formData.fullName.trim()) newErrors.fullName = 'Ad Soyad gereklidir';
    if (!formData.email.trim()) newErrors.email = 'E-posta adresi gereklidir';
    if (!formData.phone.trim()) newErrors.phone = 'Telefon numarası gereklidir';
    if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Proje başlığı gereklidir';
    if (!formData.projectDescription.trim()) newErrors.projectDescription = 'Proje açıklaması gereklidir';

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const offerData = {
        planId: plan.id,
        planName: plan.name,
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company
        },
        projectDetails: {
          title: formData.projectTitle,
          description: formData.projectDescription,
          type: formData.projectType,
          budget: formData.budget,
          timeline: formData.timeline
        },
        requirements: {
          special: formData.specialRequirements,
          technical: formData.technicalRequirements,
          targetAudience: formData.targetAudience,
          competitors: formData.competitorAnalysis,
          integrations: formData.integrations
        },
        preferences: {
          design: formData.designPreference,
          features: formData.features,
          additionalServices: formData.additionalServices
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // API'ye gönder
      const response = await offerService.create(offerData);
      
      if (response.success) {
        setSubmitted(true);
        // 3 saniye sonra hizmetler sayfasına yönlendir
        setTimeout(() => {
          navigate('/hizmetler');
        }, 3000);
      } else {
        throw new Error(response.message || 'Teklif gönderilemedi');
      }

    } catch (error) {
      console.error('Teklif gönderme hatası:', error);
      alert('Teklif gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullscreen />;
  }

  if (!plan) {
    return null;
  }

  if (submitted) {
    return (
      <div className="plan-detail-success">
        <div className="container">
          <motion.div 
            className="success-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="success-icon">
              <FiCheck />
            </div>
            <h1>Teklifiniz Başarıyla Gönderildi!</h1>
            <p>
              Proje detaylarınızı inceleyip size en kısa sürede dönüş yapacağız. 
              Teklifiniz admin panelimize iletildi ve uzman ekibimiz tarafından değerlendirilecek.
            </p>
            <p className="redirect-info">
              3 saniye içinde Hizmetler sayfasına yönlendirileceksiniz...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-detail">
      <Helmet>
        <title>{plan.name} - Plan Detayı | Baybar</title>
        <meta name="description" content={`${plan.name} için proje özelleştirme ve teklif formu`} />
      </Helmet>

      {/* Header */}
      <section className="plan-detail-header">
        <div className="container">
          <div className="header-content">
            <button 
              className="back-button"
              onClick={() => navigate('/hizmetler')}
            >
              <FiArrowLeft />
              Hizmetlere Dön
            </button>
            
            <div className="plan-info">
              <div className="plan-badge">
                {plan.popular && <span className="popular-badge">En Popüler</span>}
                <h1>{plan.name}</h1>
                <p>{plan.description}</p>
              </div>
              
              <div className="plan-pricing">
                <span className="price">
                  {plan.currency}{plan.price}
                  <span className="period">{plan.period}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="plan-features">
            <h3>Plan Özellikleri</h3>
            <div className="features-grid">
              {plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <FiCheck className="feature-icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="plan-detail-form">
        <div className="container">
          <div className="form-header">
            <h2>Projenizi Özelleştirin</h2>
            <p>Aşağıdaki formu doldurarak projenizin detaylarını belirtebilir ve size özel bir teklif alabilirsiniz.</p>
          </div>

          <form onSubmit={handleSubmit} className="customization-form">
            {/* Müşteri Bilgileri */}
            <div className="form-section">
              <h3>
                <FiUser />
                Müşteri Bilgileri
              </h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Ad Soyad *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Adınız ve soyadınız"
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-posta Adresi *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="ornek@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon Numarası *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+90 (555) 123 45 67"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="company">Şirket Adı</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Şirket adınız (opsiyonel)"
                  />
                </div>
              </div>
            </div>

            {/* Proje Detayları */}
            <div className="form-section">
              <h3>
                <FiMessageCircle />
                Proje Detayları
              </h3>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="projectTitle">Proje Başlığı *</label>
                  <input
                    type="text"
                    id="projectTitle"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    className={errors.projectTitle ? 'error' : ''}
                    placeholder="Projenizin kısa bir başlığı"
                  />
                  {errors.projectTitle && <span className="error-message">{errors.projectTitle}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="projectDescription">Proje Açıklaması *</label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    className={errors.projectDescription ? 'error' : ''}
                    rows="5"
                    placeholder="Projeniz hakkında detaylı bilgi verin. Ne yapmak istiyorsunuz? Hedefleriniz neler?"
                  />
                  {errors.projectDescription && <span className="error-message">{errors.projectDescription}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="projectType">Proje Türü</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="ecommerce">E-ticaret Sitesi</option>
                    <option value="corporate">Kurumsal Web Sitesi</option>
                    <option value="blog">Blog / İçerik Sitesi</option>
                    <option value="portfolio">Portföy Sitesi</option>
                    <option value="app">Mobil Uygulama</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="budget">Bütçe Aralığı</label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="5k-10k">5.000₺ - 10.000₺</option>
                    <option value="10k-25k">10.000₺ - 25.000₺</option>
                    <option value="25k-50k">25.000₺ - 50.000₺</option>
                    <option value="50k-100k">50.000₺ - 100.000₺</option>
                    <option value="100k+">100.000₺+</option>
                    <option value="discuss">Görüşülecek</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="timeline">Teslim Süresi</label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="1-2week">1-2 Hafta</option>
                    <option value="1month">1 Ay</option>
                    <option value="2-3month">2-3 Ay</option>
                    <option value="3-6month">3-6 Ay</option>
                    <option value="6month+">6 Ay+</option>
                    <option value="flexible">Esnek</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="targetAudience">Hedef Kitle</label>
                  <input
                    type="text"
                    id="targetAudience"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="Projenizin hedef kitlesi"
                  />
                </div>
              </div>
            </div>

            {/* Özel Gereksinimler */}
            <div className="form-section">
              <h3>
                <FiCalendar />
                Özel Gereksinimler ve Tercihler
              </h3>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="specialRequirements">Özel Gereksinimler</label>
                  <textarea
                    id="specialRequirements"
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Projeniz için özel istekleriniz, gereksinimleriniz varsa belirtiniz"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="technicalRequirements">Teknik Gereksinimler</label>
                  <textarea
                    id="technicalRequirements"
                    name="technicalRequirements"
                    value={formData.technicalRequirements}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Özel entegrasyonlar, API'ler, teknik özellikler"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="designPreference">Tasarım Tercihi</label>
                  <select
                    id="designPreference"
                    name="designPreference"
                    value={formData.designPreference}
                    onChange={handleInputChange}
                  >
                    <option value="">Seçiniz</option>
                    <option value="modern">Modern ve Minimalist</option>
                    <option value="corporate">Kurumsal ve Profesyonel</option>
                    <option value="creative">Yaratıcı ve Artistik</option>
                    <option value="classic">Klasik ve Elegant</option>
                    <option value="custom">Özel Tasarım</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="competitorAnalysis">Referans Siteler</label>
                  <textarea
                    id="competitorAnalysis"
                    name="competitorAnalysis"
                    value={formData.competitorAnalysis}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Beğendiğiniz site örnekleri, rakip analizi"
                  />
                </div>
              </div>
            </div>

            {/* Form Butonları */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => navigate('/hizmetler')}
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loading size="small" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Teklif Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PlanDetail;