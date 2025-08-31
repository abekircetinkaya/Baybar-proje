/**
 * Hizmetler Sayfası İçerik Yönetimi Bileşeni
 * Hizmet kartları ve fiyatlandırma bilgilerini yönetir
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { get, post, put } from '../../../services/api';
import './ContentPageManagement.scss';
import { FaCogs, FaSave, FaUndo, FaImage, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const ServicesPageManagement = () => {
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
    intro: {
      title: '',
      description: ''
    },
    services: {
      title: '',
      subtitle: '',
      items: []
    },
    pricing: {
      title: '',
      subtitle: '',
      plans: []
    },
    cta: {
      title: '',
      description: '',
      buttonText: '',
      buttonUrl: ''
    }
  });

  // Bileşen yüklendiğinde içerikleri getir
  useEffect(() => {
    fetchServicesContent();
  }, []);

  // Hizmetler sayfası içeriklerini API'den getir
  const fetchServicesContent = async () => {
    try {
      setLoading(true);
      const response = await get('/content/page/services');
      
      if (response && response.data) {
        setContent(response.data);
        setFormData(response.data);
      } else {
        // Varsayılan içerik yapısını kullan
        console.log('Hizmetler sayfası içeriği bulunamadı, varsayılan yapı kullanılıyor');
      }
    } catch (err) {
      console.error('Hizmetler sayfası içeriği yükleme hatası:', err);
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
        pageName: 'services',
        pageTitle: 'Hizmetler',
        lastUpdated: new Date()
      };

      const response = method === 'PUT' 
        ? await put(url, payload)
        : await post(url, payload);

      setSuccess('Hizmetler sayfası içeriği başarıyla kaydedildi!');
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

  // Hizmet ekle
  const addService = () => {
    const newService = { 
      title: '', 
      description: '', 
      icon: '',
      imageUrl: '',
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

  // Fiyatlandırma planı ekle
  const addPricingPlan = () => {
    const newPlan = { 
      title: '', 
      price: '', 
      period: 'aylık',
      description: '',
      featured: false,
      features: [],
      buttonText: 'Satın Al',
      buttonUrl: ''
    };
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: [...prev.pricing.plans, newPlan]
      }
    }));
  };

  // Fiyatlandırma planı güncelle
  const updatePricingPlan = (index, field, value) => {
    const updatedPlans = [...formData.pricing.plans];
    
    // Özel durum: featured alanı boolean olmalı
    if (field === 'featured') {
      value = value === 'true';
    }
    
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: updatedPlans
      }
    }));
  };

  // Fiyatlandırma planı sil
  const removePricingPlan = (index) => {
    const updatedPlans = formData.pricing.plans.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: updatedPlans
      }
    }));
  };

  // Fiyatlandırma planı özelliği ekle
  const addPricingFeature = (planIndex) => {
    const updatedPlans = [...formData.pricing.plans];
    updatedPlans[planIndex].features.push('');
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: updatedPlans
      }
    }));
  };

  // Fiyatlandırma planı özelliği güncelle
  const updatePricingFeature = (planIndex, featureIndex, value) => {
    const updatedPlans = [...formData.pricing.plans];
    updatedPlans[planIndex].features[featureIndex] = value;
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: updatedPlans
      }
    }));
  };

  // Fiyatlandırma planı özelliği sil
  const removePricingFeature = (planIndex, featureIndex) => {
    const updatedPlans = [...formData.pricing.plans];
    updatedPlans[planIndex].features = updatedPlans[planIndex].features
      .filter((_, i) => i !== featureIndex);
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: updatedPlans
      }
    }));
  };

  // Hizmet sırasını değiştir
  const moveService = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === formData.services.items.length - 1)) {
      return;
    }
    
    const updatedServices = [...formData.services.items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedServices[index], updatedServices[newIndex]] = 
      [updatedServices[newIndex], updatedServices[index]];
    
    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        items: updatedServices
      }
    }));
  };

  // Fiyatlandırma planı sırasını değiştir
  const movePricingPlan = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === formData.pricing.plans.length - 1)) {
      return;
    }
    
    const updatedPlans = [...formData.pricing.plans];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedPlans[index], updatedPlans[newIndex]] = 
      [updatedPlans[newIndex], updatedPlans[index]];
    
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        plans: updatedPlans
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
            <FaCogs /> Hizmetler Sayfası İçerik Yönetimi
          </h1>
          <p>Hizmet kartları ve fiyatlandırma bilgilerini düzenleyin</p>
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
            <p>Hizmetler sayfasının üst kısmında görünen karşılama bölümü</p>
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

        {/* Giriş Bölümü */}
        <div className="form-section">
          <div className="section-header">
            <h2>Giriş Bölümü</h2>
            <p>Hizmetler sayfasının giriş metni</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.intro.title}
              onChange={(e) => updateFormData('intro', 'title', e.target.value)}
              placeholder="Giriş başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.intro.description}
              onChange={(e) => updateFormData('intro', 'description', e.target.value)}
              placeholder="Giriş açıklaması"
              className="form-control"
              rows="4"
            />
          </div>
        </div>

        {/* Hizmetler Bölümü */}
        <div className="form-section">
          <div className="section-header">
            <h2>Hizmetler</h2>
            <p>Sunulan hizmetler ve özellikleri</p>
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
              {formData.services.items.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-header">
                    <h3>Hizmet #{index + 1}</h3>
                    <div className="service-actions">
                      <button
                        type="button"
                        onClick={() => moveService(index, 'up')}
                        disabled={index === 0}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveService(index, 'down')}
                        disabled={index === formData.services.items.length - 1}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <FaArrowDown />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="btn btn-danger btn-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(index, 'title', e.target.value)}
                      placeholder="Hizmet başlığı"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Açıklama</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Hizmet açıklaması"
                      className="form-control"
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>İkon</label>
                      <input
                        type="text"
                        value={service.icon}
                        onChange={(e) => updateService(index, 'icon', e.target.value)}
                        placeholder="İkon (SVG veya Font Awesome sınıfı)"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Görsel URL</label>
                      <div className="input-group">
                        <input
                          type="text"
                          value={service.imageUrl}
                          onChange={(e) => updateService(index, 'imageUrl', e.target.value)}
                          placeholder="Görsel URL"
                          className="form-control"
                        />
                        <div className="input-group-append">
                          <button type="button" className="btn btn-outline-secondary btn-sm">
                            <FaImage />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Özellikler</label>
                    <div className="features-list">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="feature-item">
                          <div className="input-group mb-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateServiceFeature(index, featureIndex, e.target.value)}
                              placeholder="Özellik açıklaması"
                              className="form-control"
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                onClick={() => removeServiceFeature(index, featureIndex)}
                                className="btn btn-outline-danger"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addServiceFeature(index)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <FaPlus /> Özellik Ekle
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
                <FaPlus /> Hizmet Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Fiyatlandırma Bölümü */}
        <div className="form-section">
          <div className="section-header">
            <h2>Fiyatlandırma</h2>
            <p>Hizmet fiyatlandırma planları</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.pricing.title}
              onChange={(e) => updateFormData('pricing', 'title', e.target.value)}
              placeholder="Bölüm başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Alt Başlık</label>
            <textarea
              value={formData.pricing.subtitle}
              onChange={(e) => updateFormData('pricing', 'subtitle', e.target.value)}
              placeholder="Bölüm açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Fiyatlandırma Planları</label>
            <div className="pricing-plans-container">
              {formData.pricing.plans.map((plan, index) => (
                <div key={index} className="pricing-plan-item">
                  <div className="plan-header">
                    <h3>Plan #{index + 1}</h3>
                    <div className="plan-actions">
                      <button
                        type="button"
                        onClick={() => movePricingPlan(index, 'up')}
                        disabled={index === 0}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePricingPlan(index, 'down')}
                        disabled={index === formData.pricing.plans.length - 1}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <FaArrowDown />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePricingPlan(index)}
                        className="btn btn-danger btn-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Başlık</label>
                    <input
                      type="text"
                      value={plan.title}
                      onChange={(e) => updatePricingPlan(index, 'title', e.target.value)}
                      placeholder="Plan başlığı"
                      className="form-control"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Fiyat</label>
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => updatePricingPlan(index, 'price', e.target.value)}
                        placeholder="Örn: 99₺"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Periyot</label>
                      <input
                        type="text"
                        value={plan.period}
                        onChange={(e) => updatePricingPlan(index, 'period', e.target.value)}
                        placeholder="Örn: aylık, yıllık"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Açıklama</label>
                    <textarea
                      value={plan.description}
                      onChange={(e) => updatePricingPlan(index, 'description', e.target.value)}
                      placeholder="Plan açıklaması"
                      className="form-control"
                      rows="2"
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        checked={plan.featured}
                        onChange={(e) => updatePricingPlan(index, 'featured', e.target.checked.toString())}
                        className="form-check-input"
                        id={`featured-${index}`}
                      />
                      <label className="form-check-label" htmlFor={`featured-${index}`}>
                        Öne Çıkan Plan
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Özellikler</label>
                    <div className="features-list">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="feature-item">
                          <div className="input-group mb-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updatePricingFeature(index, featureIndex, e.target.value)}
                              placeholder="Özellik açıklaması"
                              className="form-control"
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                onClick={() => removePricingFeature(index, featureIndex)}
                                className="btn btn-outline-danger"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addPricingFeature(index)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <FaPlus /> Özellik Ekle
                      </button>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label>Buton Metni</label>
                      <input
                        type="text"
                        value={plan.buttonText}
                        onChange={(e) => updatePricingPlan(index, 'buttonText', e.target.value)}
                        placeholder="Örn: Satın Al"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label>Buton URL</label>
                      <input
                        type="text"
                        value={plan.buttonUrl}
                        onChange={(e) => updatePricingPlan(index, 'buttonUrl', e.target.value)}
                        placeholder="Yönlendirilecek URL"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPricingPlan}
                className="btn btn-outline-primary"
              >
                <FaPlus /> Fiyatlandırma Planı Ekle
              </button>
            </div>
          </div>
        </div>

        {/* CTA Bölümü */}
        <div className="form-section">
          <div className="section-header">
            <h2>Çağrı Butonu (CTA)</h2>
            <p>Hizmetler sayfasının alt kısmında yer alan çağrı butonu</p>
          </div>

          <div className="form-group">
            <label>Başlık</label>
            <input
              type="text"
              value={formData.cta.title}
              onChange={(e) => updateFormData('cta', 'title', e.target.value)}
              placeholder="CTA başlığı"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={formData.cta.description}
              onChange={(e) => updateFormData('cta', 'description', e.target.value)}
              placeholder="CTA açıklaması"
              className="form-control"
              rows="2"
            />
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label>Buton Metni</label>
              <input
                type="text"
                value={formData.cta.buttonText}
                onChange={(e) => updateFormData('cta', 'buttonText', e.target.value)}
                placeholder="Örn: Hemen Başlayın"
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label>Buton URL</label>
              <input
                type="text"
                value={formData.cta.buttonUrl}
                onChange={(e) => updateFormData('cta', 'buttonUrl', e.target.value)}
                placeholder="Yönlendirilecek URL"
                className="form-control"
              />
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
            onClick={fetchServicesContent}
            disabled={saving}
          >
            <FaUndo /> Sıfırla
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServicesPageManagement;