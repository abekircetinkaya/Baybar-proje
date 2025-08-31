/**
 * Baybar Kurumsal Tanıtım Sitesi - İletişim Sayfası
 * İletişim formu, harita, iletişim bilgileri ve sosyal medya bağlantıları
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { offerService, contentService, post } from '../services';
import './Contact.scss';

// UI bileşenleri
import Loading from '../components/ui/Loading';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    source: 'website',
    consent: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [contactInfo, setContactInfo] = useState({});

  // Sayfa yüklendiğinde iletişim bilgilerini getir
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true);
        
        // İletişim bilgilerini API'den çek
        const contactResponse = await contentService.getByPage('contact');
        if (contactResponse.success && contactResponse.data) {
          setContactInfo(contactResponse.data);
        } else {
          // Fallback data
          setContactInfo({
          address: {
            street: "Atatürk Caddesi No: 123",
            district: "Çankaya",
            city: "Ankara",
            postalCode: "06100",
            country: "Türkiye"
          },
          phone: {
            main: "+90 312 123 45 67",
            mobile: "+90 555 123 45 67",
            whatsapp: "+90 555 123 45 67"
          },
          email: {
            general: "info@baybar.com",
            support: "destek@baybar.com",
            sales: "satis@baybar.com"
          },
          workingHours: {
            weekdays: "Pazartesi - Cuma: 09:00 - 18:00",
            saturday: "Cumartesi: 09:00 - 14:00",
            sunday: "Pazar: Kapalı"
          },
          socialMedia: {
            linkedin: "https://linkedin.com/company/baybar",
            twitter: "https://twitter.com/baybar",
            instagram: "https://instagram.com/baybar",
            facebook: "https://facebook.com/baybar"
          },
          mapCoordinates: {
            lat: 39.9334,
            lng: 32.8597
          }
          });
        }
        
      } catch (error) {
        console.error('İletişim bilgileri yüklenirken hata:', error);
        // Fallback data on error
        setContactInfo({
          address: {
            street: "Atatürk Caddesi No: 123",
            district: "Çankaya",
            city: "Ankara",
            postalCode: "06100",
            country: "Türkiye"
          },
          phone: {
            main: "+90 312 123 45 67",
            mobile: "+90 555 123 45 67",
            whatsapp: "+90 555 123 45 67"
          },
          email: {
            general: "info@baybar.com",
            support: "destek@baybar.com",
            sales: "satis@baybar.com"
          },
          workingHours: {
            weekdays: "Pazartesi - Cuma: 09:00 - 18:00",
            saturday: "Cumartesi: 09:00 - 14:00",
            sunday: "Pazar: Kapalı"
          },
          socialMedia: {
            linkedin: "https://linkedin.com/company/baybar",
            twitter: "https://twitter.com/baybar",
            instagram: "https://instagram.com/baybar",
            facebook: "https://facebook.com/baybar"
          },
          mapCoordinates: {
            lat: 39.9334,
            lng: 32.8597
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Sayfa başlığını güncelle
  useEffect(() => {
    document.title = 'İletişim - Baybar | Bizimle İletişime Geçin';
  }, []);

  // Form input değişikliklerini handle et
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validasyonu
  const validateForm = () => {
    const errors = {};
    
    // Ad validasyonu
    if (!formData.name.trim()) {
      errors.name = 'Ad Soyad alanı zorunludur';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Ad Soyad en az 2 karakter olmalıdır';
    }
    
    // E-posta validasyonu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'E-posta adresi zorunludur';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    // Telefon validasyonu (opsiyonel ama girilirse geçerli olmalı)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        errors.phone = 'Geçerli bir telefon numarası giriniz';
      }
    }
    
    // Konu validasyonu
    if (!formData.subject.trim()) {
      errors.subject = 'Konu alanı zorunludur';
    }
    
    // Mesaj validasyonu
    if (!formData.message.trim()) {
      errors.message = 'Mesaj alanı zorunludur';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Mesaj en az 10 karakter olmalıdır';
    }
    
    // Onay validasyonu
    if (!formData.consent) {
      errors.consent = 'Kişisel verilerin işlenmesine onay vermelisiniz';
    }
    
    return errors;
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Form verilerini mesaj olarak API'ye gönder
      const messageData = {
        senderName: formData.name,
        senderEmail: formData.email,
        senderPhone: formData.phone,
        senderCompany: formData.company,
        subject: formData.subject,
        message: formData.message,
        source: formData.source,
        status: 'new',
        priority: 'medium',
        tags: [formData.subject.toLowerCase()],
        isStarred: false
      };
      
      const response = await post('/contact/messages', messageData);
      
      if (response.success || response.data) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          source: 'website',
          consent: false
        });
        setFormErrors({});
      } else {
        throw new Error(response.message || 'Form gönderimi başarısız');
      }
      
    } catch (error) {
      console.error('Form gönderimi hatası:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp ile iletişim
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Merhaba, Baybar hizmetleri hakkında bilgi almak istiyorum.');
    const whatsappUrl = `https://wa.me/${contactInfo.phone?.whatsapp?.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Telefon araması
  const handlePhoneCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // E-posta gönderimi
  const handleEmailContact = (email) => {
    window.location.href = `mailto:${email}?subject=Baybar Hizmetleri Hakkında`;
  };

  if (isLoading) {
    return <Loading variant="logo" size="large" fullscreen text="Sayfa yükleniyor..." />;
  }

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero__content">
            <h1 className="contact-hero__title">İletişime Geçin</h1>
            <p className="contact-hero__subtitle">
              Projeleriniz için profesyonel çözümler sunmaya hazırız. 
              Size en uygun hizmeti birlikte belirleyelim.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content section">
        <div className="container">
          <div className="contact-content__grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="contact-form__header">
                <h2>Bize Mesaj Gönderin</h2>
                <p>Formu doldurarak bizimle iletişime geçebilir, projeleriniz hakkında detaylı bilgi alabilirsiniz.</p>
              </div>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                {submitStatus === 'success' && (
                  <div className="form-message form-message--success">
                    <span className="form-message__icon">✓</span>
                    <div>
                      <strong>Mesajınız başarıyla gönderildi!</strong>
                      <p>En kısa sürede size geri dönüş yapacağız.</p>
                    </div>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="form-message form-message--error">
                    <span className="form-message__icon">✕</span>
                    <div>
                      <strong>Mesaj gönderilemedi!</strong>
                      <p>Lütfen daha sonra tekrar deneyiniz veya alternatif iletişim yöntemlerini kullanınız.</p>
                    </div>
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Ad Soyad <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.name ? 'form-input--error' : ''}`}
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                    {formErrors.name && (
                      <span className="form-error">{formErrors.name}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      E-posta Adresi <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.email ? 'form-input--error' : ''}`}
                      placeholder="ornek@email.com"
                      required
                    />
                    {formErrors.email && (
                      <span className="form-error">{formErrors.email}</span>
                    )}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.phone ? 'form-input--error' : ''}`}
                      placeholder="+90 555 123 45 67"
                    />
                    {formErrors.phone && (
                      <span className="form-error">{formErrors.phone}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="company" className="form-label">
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Şirket adınız (opsiyonel)"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Konu <span className="required">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`form-select ${formErrors.subject ? 'form-input--error' : ''}`}
                    required
                  >
                    <option value="">Konu seçiniz</option>
                    <option value="e-ticaret">E-Ticaret Platformu</option>
                    <option value="pazarlama">Uluslararası Pazarlama</option>
                    <option value="lojistik">Lojistik ve Kargo</option>
                    <option value="destek">Müşteri Destek Hizmetleri</option>
                    <option value="fiyat">Fiyat Teklifi</option>
                    <option value="genel">Genel Bilgi</option>
                    <option value="diger">Diğer</option>
                  </select>
                  {formErrors.subject && (
                    <span className="form-error">{formErrors.subject}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Mesajınız <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`form-textarea ${formErrors.message ? 'form-input--error' : ''}`}
                    placeholder="Projeniz hakkında detaylı bilgi veriniz..."
                    rows="6"
                    required
                  ></textarea>
                  {formErrors.message && (
                    <span className="form-error">{formErrors.message}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleInputChange}
                      className={formErrors.consent ? 'form-input--error' : ''}
                      required
                    />
                    <span className="form-checkbox__checkmark"></span>
                    <span className="form-checkbox__text">
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                        Kişisel Verilerin Korunması Kanunu
                      </a> kapsamında verilerimin işlenmesini kabul ediyorum. <span className="required">*</span>
                    </span>
                  </label>
                  {formErrors.consent && (
                    <span className="form-error">{formErrors.consent}</span>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn--primary btn--large btn--full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loading variant="spinner" size="small" />
                      Gönderiliyor...
                    </>
                  ) : (
                    'Mesajı Gönder'
                  )}
                </button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-info__section">
                <h3>İletişim Bilgileri</h3>
                
                <div className="contact-item">
                  <div className="contact-item__icon">📍</div>
                  <div className="contact-item__content">
                    <h4>Adres</h4>
                    <p>
                      {contactInfo.address?.street}<br/>
                      {contactInfo.address?.district}, {contactInfo.address?.city}<br/>
                      {contactInfo.address?.postalCode} {contactInfo.address?.country}
                    </p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-item__icon">📞</div>
                  <div className="contact-item__content">
                    <h4>Telefon</h4>
                    <p>
                      <a href={`tel:${contactInfo.phone?.main}`}>
                        {contactInfo.phone?.main}
                      </a><br/>
                      <a href={`tel:${contactInfo.phone?.mobile}`}>
                        {contactInfo.phone?.mobile}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-item__icon">✉️</div>
                  <div className="contact-item__content">
                    <h4>E-posta</h4>
                    <p>
                      <a href={`mailto:${contactInfo.email?.general}`}>
                        {contactInfo.email?.general}
                      </a><br/>
                      <a href={`mailto:${contactInfo.email?.support}`}>
                        {contactInfo.email?.support}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-item__icon">🕒</div>
                  <div className="contact-item__content">
                    <h4>Çalışma Saatleri</h4>
                    <p>
                      {contactInfo.workingHours?.weekdays}<br/>
                      {contactInfo.workingHours?.saturday}<br/>
                      {contactInfo.workingHours?.sunday}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="contact-info__section">
                <h3>Hızlı İletişim</h3>
                
                <div className="quick-contact">
                  <button 
                    className="quick-contact__btn quick-contact__btn--whatsapp"
                    onClick={handleWhatsAppContact}
                  >
                    <span className="quick-contact__icon">💬</span>
                    <div>
                      <strong>WhatsApp</strong>
                      <p>Anında mesajlaşma</p>
                    </div>
                  </button>
                  
                  <button 
                    className="quick-contact__btn quick-contact__btn--phone"
                    onClick={() => handlePhoneCall(contactInfo.phone?.main)}
                  >
                    <span className="quick-contact__icon">📞</span>
                    <div>
                      <strong>Telefon</strong>
                      <p>Hemen arayın</p>
                    </div>
                  </button>
                  
                  <button 
                    className="quick-contact__btn quick-contact__btn--email"
                    onClick={() => handleEmailContact(contactInfo.email?.general)}
                  >
                    <span className="quick-contact__icon">✉️</span>
                    <div>
                      <strong>E-posta</strong>
                      <p>Detaylı mesaj gönderin</p>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="contact-info__section">
                <h3>Sosyal Medya</h3>
                
                <div className="social-links">
                  <a 
                    href={contactInfo.socialMedia?.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link social-link--linkedin"
                  >
                    <span className="social-link__icon">💼</span>
                    LinkedIn
                  </a>
                  
                  <a 
                    href={contactInfo.socialMedia?.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link social-link--twitter"
                  >
                    <span className="social-link__icon">🐦</span>
                    Twitter
                  </a>
                  
                  <a 
                    href={contactInfo.socialMedia?.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link social-link--instagram"
                  >
                    <span className="social-link__icon">📷</span>
                    Instagram
                  </a>
                  
                  <a 
                    href={contactInfo.socialMedia?.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link social-link--facebook"
                  >
                    <span className="social-link__icon">📘</span>
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map section section--no-padding">
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-placeholder__content">
              <div className="map-placeholder__icon">🗺️</div>
              <h3>Harita</h3>
              <p>Ofisimizin konumunu görmek için haritayı yükleyin</p>
              <button className="btn btn--primary">
                Haritayı Yükle
              </button>
            </div>
          </div>
          {/* Gerçek harita entegrasyonu burada olacak */}
        </div>
      </section>
    </div>
  );
};

export default Contact;