/**
 * Ana Sayfa İçerik Yönetimi Bileşeni
 * Hero bölümü, hizmetler, çalışmalar ve diğer ana sayfa içeriklerini yönetir
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { get, post, put } from '../../../services/api';
import './ContentPageManagement.scss';
import { FaHome, FaSave, FaUndo, FaImage } from 'react-icons/fa';

const HomePageManagement = () => {
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
      buttonText: '',
      imageUrl: '',
      stats: []
    },
    services: {
      title: '',
      subtitle: '',
      items: []
    },
    partners: {
      title: '',
      subtitle: '',
      logos: []
    },
    featuredWorks: {
      title: '',
      subtitle: '',
      items: []
    }
  });

  // Bileşen yüklendiğinde içerikleri getir
  useEffect(() => {
    fetchHomeContent();
  }, []);

  // Ana sayfa içeriklerini API'den getir
  const fetchHomeContent = async () => {
    try {
      setLoading(true);
      const response = await get('/content/page/home');
      
      if (response && response.data) {
        setContent(response.data);
        setFormData(response.data);
      } else {
        // Varsayılan içerik yapısını kullan
        console.log('Ana sayfa içeriği bulunamadı, varsayılan yapı kullanılıyor');
      }
    } catch (err) {
      console.error('Ana sayfa içeriği yükleme hatası:', err);
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
        pageName: 'home',
        pageTitle: 'Ana Sayfa',
        lastUpdated: new Date()
      };

      const response = method === 'PUT' 
        ? await put(url, payload)
        : await post(url, payload);

      setSuccess('Ana sayfa içeriği başarıyla kaydedildi!');
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

  // Hero istatistik ekle
  const addHeroStat = () => {
    const newStat = { number: '', label: '' };
    
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        stats: [...prev.hero.stats, newStat]
      }
    }));
  };

  // Hero istatistik güncelle
  const updateHeroStat = (index, field, value) => {
    const updatedStats = [...formData.hero.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        stats: updatedStats
      }
    }));
  };

  // Hero istatistik sil
  const removeHeroStat = (index) => {
    const updatedStats = formData.hero.stats.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        stats: updatedStats
      }
    }));
  };

  // Hizmet ekle
  const addService = () => {
    const newService = { 
      title: '', 
      description: '', 
      icon: '', 
      features: [] 
    };
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: [...prev.services.items, newService]
      }
    }));
  };

  // Hizmet güncelle
  const updateService = (index, field, value) => {
    const updatedServices = [...formData.services.items];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: updatedServices
      }
    }));
  };

  // Hizmet özelliği ekle
  const addServiceFeature = (serviceIndex) => {
    const updatedServices = [...formData.services.items];
    updatedServices[serviceIndex].features.push('');
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: updatedServices
      }
    }));
  };

  // Hizmet özelliği güncelle
  const updateServiceFeature = (serviceIndex, featureIndex, value) => {
    const updatedServices = [...formData.services.items];
    updatedServices[serviceIndex].features[featureIndex] = value;
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: updatedServices
      }
    }));
  };

  // Hizmet özelliği sil
  const removeServiceFeature = (serviceIndex, featureIndex) => {
    const updatedServices = [...formData.services.items];
    updatedServices[serviceIndex].features = updatedServices[serviceIndex].features
      .filter((_, i) => i !== featureIndex);
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: updatedServices
      }
    }));
  };

  // Hizmet sil
  const removeService = (index) => {
    const updatedServices = formData.services.items.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: updatedServices
      }
    }));
  };

  // Partner logo ekle
  const addPartnerLogo = () => {
    const newLogo = { name: '', imageUrl: '' };
    
    setFormData(prev => ({
      ...prev,
      partners: {
        ...prev.partners,
        logos: [...prev.partners.logos, newLogo]
      }
    }));
  };

  // Partner logo güncelle
  const updatePartnerLogo = (index, field, value) => {
    const updatedLogos = [...formData.partners.logos];
    updatedLogos[index] = {
      ...updatedLogos[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      partners: {
        ...prev.partners,
        logos: updatedLogos
      }
    }));
  };

  // Partner logo sil
  const removePartnerLogo = (index) => {
    const updatedLogos = formData.partners.logos.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      partners: {
        ...prev.partners,
        logos: updatedLogos
      }
    }));
  };

  // Öne çıkan çalışma ekle
  const addFeaturedWork = () => {
    const newWork = { 
      title: '', 
      description: '', 
      imageUrl: '', 
      technologies: [],
      link: ''
    };
    
    setFormData(prev => ({
      ...prev,
      featuredWorks: {
        ...prev.featuredWorks,
        items: [...prev.featuredWorks.items, newWork]
      }
    }));
  };

  // Öne çıkan çalışma güncelle
  const updateFeaturedWork = (index, field, value) => {
    const updatedWorks = [...formData.featuredWorks.items];
    updatedWorks[index] = {
      ...updatedWorks[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      featuredWorks: {
        ...prev.featuredWorks,
        items: updatedWorks
      }
    }));
  };

  // Teknoloji ekle
  const addTechnology = (workIndex) => {
    const updatedWorks = [...formData.featuredWorks.items];
    updatedWorks[workIndex].technologies.push('');
    
    setFormData(prev => ({
      ...prev,
      featuredWorks: {
        ...prev.featuredWorks,
        items: updatedWorks
      }
    }));
  };

  // Teknoloji güncelle
  const updateTechnology = (workIndex, techIndex, value) => {
    const updatedWorks = [...formData.featuredWorks.items];
    updatedWorks[workIndex].technologies[techIndex] = value;
    
    setFormData(prev => ({
      ...prev,
      featuredWorks: {
        ...prev.featuredWorks,
        items: updatedWorks
      }
    }));
  };

  // Teknoloji sil
  const removeTechnology = (workIndex, techIndex) => {
    const updatedWorks = [...formData.featuredWorks.items];
    updatedWorks[workIndex].technologies = updatedWorks[workIndex].technologies
      .filter((_, i) => i !== techIndex);
    
    setFormData(prev => ({
      ...prev,
      featuredWorks: {
        ...prev.featuredWorks,
        items: updatedWorks
      }
    }));
  };

  // Öne çıkan çalışma sil
  const removeFeaturedWork = (index) => {
    const updatedWorks = formData.featuredWorks.items.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      featuredWorks: {
        ...prev.featuredWorks,
        items: updatedWorks
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
            <FaHome /> Ana Sayfa İçerik Yönetimi
          </h1>
          <p>Ana sayfa bölümlerini ve içeriklerini düzenleyin</p>
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
            <p>Ana sayfanın üst kısmında görünen karşılama bölümü</p>
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
            <label>Buton Metni</label>
            <input
              type="text"
              value={formData.hero.buttonText}
              onChange={(e) => updateFormData('hero', 'buttonText', e.target.value)}
              placeholder="Buton metni"
              className="form-control"
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

          <div className="form-group">
            <label>İstatistikler</label>
            <div className="stats-container">
              {formData.hero.stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-inputs">
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => updateHeroStat(index, 'number', e.target.value)}
                      placeholder="Sayı"
                      className="form-control"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateHeroStat(index, 'label', e.target.value)}
                      placeholder="Etiket"
                      className="form-control"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHeroStat(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHeroStat}
                className="btn btn-outline-primary"
              >
                İstatistik Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Hizmetler Bölümü */}
        <div className="form-section">
          <div className="section-header">
            <h2>Hizmetler Bölümü</h2>
            <p>Ana sayfada gösterilen hizmetler</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.services.title}
              onChange={(e) => updateFormData('services', 'title', e.target.value)}
              placeholder="Bölüm başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.services.subtitle}
              onChange={(e) => updateFormData('services', 'subtitle', e.target.value)}
              placeholder="Bölüm açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Hizmetler</label>
            <div className="services-container">
              {formData.services.items.map((service, serviceIndex) => (
                <div key={serviceIndex} className="service-item">
                  <div className="service-header">
                    <h3>Hizmet #{serviceIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeService(serviceIndex)}
                      className="btn btn-danger btn-sm"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(serviceIndex, 'title', e.target.value)}
                      placeholder="Hizmet başlığı"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Açıklama</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(serviceIndex, 'description', e.target.value)}
                      placeholder="Hizmet açıklaması"
                      className="form-control"
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label>İkon</label>
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => updateService(serviceIndex, 'icon', e.target.value)}
                      placeholder="İkon (emoji veya SVG)"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Özellikler</label>
                    <div className="features-container">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="feature-item">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateServiceFeature(serviceIndex, featureIndex, e.target.value)}
                            placeholder="Özellik"
                            className="form-control"
                          />
                          <button
                            type="button"
                            onClick={() => removeServiceFeature(serviceIndex, featureIndex)}
                            className="btn btn-danger btn-sm"
                          >
                            Sil
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addServiceFeature(serviceIndex)}
                        className="btn btn-outline-secondary"
                      >
                        Özellik Ekle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="btn btn-outline-primary"
              >
                Hizmet Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Partnerler Bölümü */}
        <div className="form-section">
          <div className="section-header">
            <h2>Partnerler Bölümü</h2>
            <p>Çalıştığımız firmalar ve markalar</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.partners.title}
              onChange={(e) => updateFormData('partners', 'title', e.target.value)}
              placeholder="Bölüm başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.partners.subtitle}
              onChange={(e) => updateFormData('partners', 'subtitle', e.target.value)}
              placeholder="Bölüm açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Partner Logoları</label>
            <div className="logos-container">
              {formData.partners.logos.map((logo, index) => (
                <div key={index} className="logo-item">
                  <div className="logo-inputs">
                    <input
                      type="text"
                      value={logo.name}
                      onChange={(e) => updatePartnerLogo(index, 'name', e.target.value)}
                      placeholder="Firma adı"
                      className="form-control"
                    />
                    <input
                      type="text"
                      value={logo.imageUrl}
                      onChange={(e) => updatePartnerLogo(index, 'imageUrl', e.target.value)}
                      placeholder="Logo URL"
                      className="form-control"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePartnerLogo(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Sil
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPartnerLogo}
                className="btn btn-outline-primary"
              >
                Logo Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Öne Çıkan Çalışmalar */}
        <div className="form-section">
          <div className="section-header">
            <h2>Öne Çıkan Çalışmalar</h2>
            <p>Ana sayfada gösterilen projeler</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.featuredWorks.title}
              onChange={(e) => updateFormData('featuredWorks', 'title', e.target.value)}
              placeholder="Bölüm başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.featuredWorks.subtitle}
              onChange={(e) => updateFormData('featuredWorks', 'subtitle', e.target.value)}
              placeholder="Bölüm açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Çalışmalar</label>
            <div className="works-container">
              {formData.featuredWorks.items.map((work, workIndex) => (
                <div key={workIndex} className="work-item">
                  <div className="work-header">
                    <h3>Proje #{workIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeFeaturedWork(workIndex)}
                      className="btn btn-danger btn-sm"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={work.title}
                      onChange={(e) => updateFeaturedWork(workIndex, 'title', e.target.value)}
                      placeholder="Proje başlığı"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Açıklama</label>
                    <textarea
                      value={work.description}
                      onChange={(e) => updateFeaturedWork(workIndex, 'description', e.target.value)}
                      placeholder="Proje açıklaması"
                      className="form-control"
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <label>Görsel URL</label>
                    <div className="input-group">
                      <input
                        type="text"
                        value={work.imageUrl}
                        onChange={(e) => updateFeaturedWork(workIndex, 'imageUrl', e.target.value)}
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

                  <div className="form-group">
                    <label>Proje Linki</label>
                    <input
                      type="text"
                      value={work.link}
                      onChange={(e) => updateFeaturedWork(workIndex, 'link', e.target.value)}
                      placeholder="Proje URL"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Teknolojiler</label>
                    <div className="technologies-container">
                      {work.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="technology-item">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => updateTechnology(workIndex, techIndex, e.target.value)}
                            placeholder="Teknoloji adı"
                            className="form-control"
                          />
                          <button
                            type="button"
                            onClick={() => removeTechnology(workIndex, techIndex)}
                            className="btn btn-danger btn-sm"
                          >
                            Sil
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addTechnology(workIndex)}
                        className="btn btn-outline-secondary"
                      >
                        Teknoloji Ekle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeaturedWork}
                className="btn btn-outline-primary"
              >
                Proje Ekle
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
            onClick={fetchHomeContent}
            disabled={saving}
          >
            <FaUndo /> Sıfırla
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePageManagement;