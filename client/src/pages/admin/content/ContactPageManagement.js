/**
 * İletişim Sayfası İçerik Yönetimi Bileşeni
 * İletişim bilgileri ve sosyal medya bağlantılarını yönetir
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { get, post, put } from '../../../services/api';
import './ContentPageManagement.scss';
import { FaEnvelope, FaSave, FaUndo, FaImage, FaMapMarkerAlt, FaPhone, FaWhatsapp, FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa';

const ContactPageManagement = () => {
  // State yönetimi
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      imageUrl: ''
    },
    contactInfo: {
      title: '',
      subtitle: '',
      address: {
        street: '',
        city: '',
        country: '',
        mapUrl: ''
      },
      phone: '',
      email: '',
      workingHours: ''
    },
    socialMedia: {
      title: '',
      subtitle: '',
      channels: [
        { name: 'whatsapp', url: '', icon: 'FaWhatsapp' },
        { name: 'instagram', url: '', icon: 'FaInstagram' },
        { name: 'linkedin', url: '', icon: 'FaLinkedin' },
        { name: 'facebook', url: '', icon: 'FaFacebook' },
        { name: 'twitter', url: '', icon: 'FaTwitter' }
      ]
    },
    contactForm: {
      title: '',
      subtitle: '',
      submitButtonText: '',
      successMessage: '',
      errorMessage: ''
    },
    faq: {
      title: '',
      subtitle: '',
      items: []
    }
  });

  // Bileşen yüklendiğinde içerikleri getir
  useEffect(() => {
    fetchContactContent();
  }, []);

  // İletişim sayfası içeriklerini API'den getir
  const fetchContactContent = async () => {
    try {
      setLoading(true);
      const response = await get('/content/page/contact');
      
      if (response && response.data) {
        setContent(response.data);
        setFormData(response.data);
      } else {
        // Varsayılan içerik yapısını kullan
        console.log('İletişim sayfası içeriği bulunamadı, varsayılan yapı kullanılıyor');
      }
    } catch (err) {
      console.error('İletişim sayfası içeriği yükleme hatası:', err);
      setError('İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // İçerik kaydet
  const saveContent = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      
      const method = content ? 'PUT' : 'POST';
      const url = content 
        ? `/admin/content/${content._id}`
        : '/admin/content';

      const payload = {
        ...formData,
        pageName: 'contact',
        pageTitle: 'İletişim',
        lastUpdated: new Date()
      };

      const response = method === 'PUT' 
        ? await put(url, payload)
        : await post(url, payload);

      setSuccess('İletişim sayfası içeriği başarıyla kaydedildi!');
      setContent(response.content);
      
      // Başarı mesajını 3 saniye sonra temizle
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('İçerik kaydetme hatası:', err);
      setError('İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  // Form verilerini güncelle
  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Adres bilgilerini güncelle
  const updateAddressData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        address: {
          ...prev.contactInfo.address,
          [field]: value
        }
      }
    }));
  };

  // Sosyal medya kanalını güncelle
  const updateSocialChannel = (index, field, value) => {
    const updatedChannels = [...formData.socialMedia.channels];
    updatedChannels[index] = {
      ...updatedChannels[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        channels: updatedChannels
      }
    }));
  };

  // SSS ekle
  const addFaqItem = () => {
    const newFaqItem = { question: '', answer: '' };
    
    setFormData(prev => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: [...prev.faq.items, newFaqItem]
      }
    }));
  };

  // SSS güncelle
  const updateFaqItem = (index, field, value) => {
    const updatedFaqItems = [...formData.faq.items];
    updatedFaqItems[index] = {
      ...updatedFaqItems[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: updatedFaqItems
      }
    }));
  };

  // SSS sil
  const removeFaqItem = (index) => {
    const updatedFaqItems = formData.faq.items.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: updatedFaqItems
      }
    }));
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="content-page-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>İçerik yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page-management">
      <div className="content-header">
        <div className="header-content">
          <h1>
            <FaEnvelope /> İletişim Sayfası İçerik Yönetimi
          </h1>
          <p>İletişim bilgileri ve sosyal medya bağlantılarını düzenleyin</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Hata!</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <strong>Başarılı!</strong> {success}
        </div>
      )}

      <form onSubmit={saveContent} className="content-form">
        {/* Hero Bölümü */}
        <div className="form-section">
          <div className="section-header">
            <h2>Hero Bölümü</h2>
            <p>İletişim sayfasının üst kısmında görünen karşılama bölümü</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.hero.title}
              onChange={(e) => updateFormData('hero', 'title', e.target.value)}
              placeholder="Ana başlık"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.hero.subtitle}
              onChange={(e) => updateFormData('hero', 'subtitle', e.target.value)}
              placeholder="Açıklama metni"
              className="form-control"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Görsel URL</label>
            <div className="input-group">
              <input
                type="text"
                value={formData.hero.imageUrl}
                onChange={(e) => updateFormData('hero', 'imageUrl', e.target.value)}
                placeholder="Görsel URL"
                className="form-control"
              />
              <div className="input-group-append">
                <button type="button" className="btn btn-outline-secondary">
                  <FaImage /> Görsel Seç
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="form-section">
          <div className="section-header">
            <h2>İletişim Bilgileri</h2>
            <p>Adres, telefon ve e-posta bilgileri</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.contactInfo.title}
              onChange={(e) => updateFormData('contactInfo', 'title', e.target.value)}
              placeholder="Bölüm başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.contactInfo.subtitle}
              onChange={(e) => updateFormData('contactInfo', 'subtitle', e.target.value)}
              placeholder="Bölüm açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label><FaMapMarkerAlt /> Adres Bilgileri</label>
            <div className="address-fields">
              <div className="form-group">
                <label>Sokak/Cadde</label>
                <input
                  type="text"
                  value={formData.contactInfo.address.street}
                  onChange={(e) => updateAddressData('street', e.target.value)}
                  placeholder="Sokak/Cadde, Bina No"
                  className="form-control"
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Şehir</label>
                  <input
                    type="text"
                    value={formData.contactInfo.address.city}
                    onChange={(e) => updateAddressData('city', e.target.value)}
                    placeholder="Şehir"
                    className="form-control"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Ülke</label>
                  <input
                    type="text"
                    value={formData.contactInfo.address.country}
                    onChange={(e) => updateAddressData('country', e.target.value)}
                    placeholder="Ülke"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Harita URL (Google Maps)</label>
                <input
                  type="text"
                  value={formData.contactInfo.address.mapUrl}
                  onChange={(e) => updateAddressData('mapUrl', e.target.value)}
                  placeholder="Google Maps URL"
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label><FaPhone /> Telefon</label>
            <input
              type="text"
              value={formData.contactInfo.phone}
              onChange={(e) => updateFormData('contactInfo', 'phone', e.target.value)}
              placeholder="Telefon numarası"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope /> E-posta</label>
            <input
              type="email"
              value={formData.contactInfo.email}
              onChange={(e) => updateFormData('contactInfo', 'email', e.target.value)}
              placeholder="E-posta adresi"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Çalışma Saatleri</label>
            <textarea
              value={formData.contactInfo.workingHours}
              onChange={(e) => updateFormData('contactInfo', 'workingHours', e.target.value)}
              placeholder="Örn: Pazartesi-Cuma: 09:00-18:00"
              className="form-control"
              rows="2"
            />
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="form-section">
          <div className="section-header">
            <h2>Sosyal Medya</h2>
            <p>Sosyal medya kanalları ve bağlantıları</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.socialMedia.title}
              onChange={(e) => updateFormData('socialMedia', 'title', e.target.value)}
              placeholder="Bölüm başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.socialMedia.subtitle}
              onChange={(e) => updateFormData('socialMedia', 'subtitle', e.target.value)}
              placeholder="Bölüm açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Sosyal Medya Kanalları</label>
            <div className="social-channels">
              {formData.socialMedia.channels.map((channel, index) => {
                // İkon bileşenini belirle
                let IconComponent;
                switch(channel.name) {
                  case 'whatsapp':
                    IconComponent = FaWhatsapp;
                    break;
                  case 'instagram':
                    IconComponent = FaInstagram;
                    break;
                  case 'linkedin':
                    IconComponent = FaLinkedin;
                    break;
                  case 'facebook':
                    IconComponent = FaFacebook;
                    break;
                  case 'twitter':
                    IconComponent = FaTwitter;
                    break;
                  default:
                    IconComponent = FaEnvelope;
                }
                
                return (
                  <div key={index} className="social-channel-item">
                    <div className="channel-header">
                      <h3><IconComponent /> {channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}</h3>
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="text"
                        value={channel.url}
                        onChange={(e) => updateSocialChannel(index, 'url', e.target.value)}
                        placeholder={`${channel.name.charAt(0).toUpperCase() + channel.name.slice(1)} URL`}
                        className="form-control"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="form-section">
          <div className="section-header">
            <h2>İletişim Formu</h2>
            <p>İletişim formunun başlık ve mesaj metinleri</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.contactForm.title}
              onChange={(e) => updateFormData('contactForm', 'title', e.target.value)}
              placeholder="Form başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.contactForm.subtitle}
              onChange={(e) => updateFormData('contactForm', 'subtitle', e.target.value)}
              placeholder="Form açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Gönder Butonu Metni</label>
            <input
              type="text"
              value={formData.contactForm.submitButtonText}
              onChange={(e) => updateFormData('contactForm', 'submitButtonText', e.target.value)}
              placeholder="Örn: Mesaj Gönder"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Başarı Mesajı</label>
            <textarea
              value={formData.contactForm.successMessage}
              onChange={(e) => updateFormData('contactForm', 'successMessage', e.target.value)}
              placeholder="Form başarıyla gönderildiğinde gösterilecek mesaj"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Hata Mesajı</label>
            <textarea
              value={formData.contactForm.errorMessage}
              onChange={(e) => updateFormData('contactForm', 'errorMessage', e.target.value)}
              placeholder="Form gönderilirken hata oluştuğunda gösterilecek mesaj"
              className="form-control"
              rows="2"
            />
          </div>
        </div>

        {/* Sık Sorulan Sorular */}
        <div className="form-section">
          <div className="section-header">
            <h2>Sık Sorulan Sorular</h2>
            <p>İletişim sayfasında gösterilecek SSS</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.faq.title}
              onChange={(e) => updateFormData('faq', 'title', e.target.value)}
              placeholder="SSS başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.faq.subtitle}
              onChange={(e) => updateFormData('faq', 'subtitle', e.target.value)}
              placeholder="SSS açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Sorular</label>
            <div className="faq-items-container">
              {formData.faq.items.map((item, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-header">
                    <h3>Soru #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeFaqItem(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Soru</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                      placeholder="Soru metni"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cevap</label>
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      placeholder="Cevap metni"
                      className="form-control"
                      rows="3"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFaqItem}
                className="btn btn-outline-primary"
              >
                Soru Ekle
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <FaSave /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={fetchContactContent}
            disabled={saving}
          >
            <FaUndo /> Sıfırla
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactPageManagement;