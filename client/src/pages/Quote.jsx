import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Quote = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { actions } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    categories: []
  });

  const services = {
    1: {
      title: 'E-ticaret Danışmanlığı',
      description: 'Online mağaza kurulumundan pazarlama stratejilerine kadar kapsamlı danışmanlık hizmetleri.',
      categories: [
        'Platform Seçimi (Shopify, WooCommerce, Magento)',
        'Ürün Kataloğu Optimizasyonu',
        'Ödeme Sistemleri Entegrasyonu',
        'Kargo ve Lojistik Çözümleri',
        'SEO ve Dijital Pazarlama',
        'Müşteri Hizmetleri Sistemi',
        'Analitik ve Raporlama',
        'Güvenlik ve SSL Sertifikaları'
      ]
    },
    2: {
      title: 'Dijital Pazarlama',
      description: 'Sosyal medya yönetimi, reklam kampanyaları ve içerik pazarlama çözümleri.',
      categories: [
        'Sosyal Medya Yönetimi',
        'Google Ads Kampanyaları',
        'Facebook ve Instagram Ads',
        'İçerik Üretimi ve Yönetimi',
        'E-posta Pazarlama',
        'Influencer İşbirlikleri',
        'SEO Optimizasyonu',
        'Analitik ve Raporlama'
      ]
    },
    3: {
      title: 'Teknik Destek',
      description: '7/24 teknik destek ve sistem yönetimi ile kesintisiz hizmet garantisi.',
      categories: [
        '7/24 Teknik Destek',
        'Sistem Güvenlik Güncellemeleri',
        'Performans Optimizasyonu',
        'Yedekleme ve Kurtarma',
        'SSL Sertifika Yönetimi',
        'Sunucu Yönetimi',
        'Veritabanı Optimizasyonu',
        'API Entegrasyonları'
      ]
    },
    4: {
      title: 'E-ticaret Eğitimi',
      description: 'E-ticaret süreçleri hakkında kapsamlı eğitim programları.',
      categories: [
        'E-ticaret Temelleri',
        'Pazarlama Stratejileri',
        'Müşteri Yönetimi',
        'Analitik ve Raporlama',
        'Sosyal Medya Pazarlama',
        'E-posta Pazarlama',
        'SEO ve SEM',
        'Sertifika Programı'
      ]
    }
  };

  const currentService = services[serviceId] || services[1];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.phone || !formData.projectDescription) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (formData.categories.length === 0) {
      alert('Lütfen en az bir kategori seçin.');
      return;
    }

    try {
      const quoteData = {
        ...formData,
        serviceId: parseInt(serviceId),
        serviceTitle: currentService.title,
        amount: currentService.price || 'Belirtilmedi'
      };

      const result = await actions.submitQuote(quoteData);
      
      if (result.success) {
        alert('Teklifiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
        navigate('/');
      } else {
        alert(result.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Teklif Al - {currentService.title} | Baybar</title>
        <meta name="description" content={`${currentService.title} hizmeti için teklif alın. Uzman ekibimizle projenizi hayata geçirin.`} />
      </Helmet>

      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Geri Dön
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentService.title} - Teklif Al
            </h1>
            <p className="text-gray-600">
              {currentService.description}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Kişisel Bilgiler */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şirket
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Kategori Seçimi */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İlgilendiğiniz Kategoriler *
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentService.categories.map((category, index) => (
                    <label
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Proje Detayları */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Proje Detayları</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proje Açıklaması *
                    </label>
                    <textarea
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Projenizi detaylı bir şekilde açıklayın..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bütçe
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Bütçe Seçin</option>
                        <option value="0-5000">₺0 - ₺5.000</option>
                        <option value="5000-10000">₺5.000 - ₺10.000</option>
                        <option value="10000-25000">₺10.000 - ₺25.000</option>
                        <option value="25000-50000">₺25.000 - ₺50.000</option>
                        <option value="50000+">₺50.000+</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zaman Çizelgesi
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Zaman Çizelgesi Seçin</option>
                        <option value="1-month">1 Ay</option>
                        <option value="2-3-months">2-3 Ay</option>
                        <option value="3-6-months">3-6 Ay</option>
                        <option value="6-months+">6 Ay+</option>
                        <option value="flexible">Esnek</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Teklifi Gönder
                </button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Teklifiniz gönderildikten sonra 24 saat içinde size dönüş yapacağız.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Quote;
