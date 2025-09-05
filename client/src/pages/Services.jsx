import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../contexts/AppContext';
import { ArrowRight, CheckCircle, Star, Clock, Shield, Headphones } from 'lucide-react';
import Heading from '../components/common/Heading';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Services = () => {
  const { state, actions } = useApp();

  useEffect(() => {
    if (!state.content.services && !state.content.loading) {
      actions.loadContent('services');
    }
  }, [state.content.services, state.content.loading, actions]);

  if (state.content.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Sayfa yükleniyor..." />
      </div>
    );
  }

  if (state.content.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bir hata oluştu</h2>
          <p className="text-gray-600 mb-4">{state.content.error}</p>
          <button
            onClick={() => actions.loadContent('services')}
            className="btn btn-primary"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const services = [
    {
      id: 1,
      title: 'E-ticaret Danışmanlığı',
      description: 'Online mağaza kurulumundan pazarlama stratejilerine kadar kapsamlı danışmanlık hizmetleri.',
      features: [
        'E-ticaret platformu seçimi ve kurulumu',
        'Ürün kataloğu optimizasyonu',
        'Ödeme sistemleri entegrasyonu',
        'Kargo ve lojistik çözümleri',
        'SEO ve dijital pazarlama stratejisi'
      ],
      price: 'Başlangıç: ₺5.000',
      icon: '🛒',
      popular: true
    },
    {
      id: 2,
      title: 'Dijital Pazarlama',
      description: 'Sosyal medya yönetimi, reklam kampanyaları ve içerik pazarlama çözümleri.',
      features: [
        'Sosyal medya hesap yönetimi',
        'Google Ads ve Facebook Ads',
        'İçerik üretimi ve yönetimi',
        'E-posta pazarlama kampanyaları',
        'Analitik ve raporlama'
      ],
      price: 'Aylık: ₺3.000',
      icon: '📱',
      popular: false
    },
    {
      id: 3,
      title: 'Teknik Destek',
      description: '7/24 teknik destek ve sistem yönetimi ile kesintisiz hizmet garantisi.',
      features: [
        '7/24 teknik destek hattı',
        'Sistem güvenlik güncellemeleri',
        'Performans optimizasyonu',
        'Yedekleme ve kurtarma',
        'SSL sertifika yönetimi'
      ],
      price: 'Aylık: ₺2.000',
      icon: '⚙️',
      popular: false
    },
    {
      id: 4,
      title: 'E-ticaret Eğitimi',
      description: 'E-ticaret süreçleri hakkında kapsamlı eğitim programları.',
      features: [
        'E-ticaret temelleri',
        'Pazarlama stratejileri',
        'Müşteri yönetimi',
        'Analitik ve raporlama',
        'Sertifika programı'
      ],
      price: 'Program: ₺1.500',
      icon: '🎓',
      popular: false
    },
    {
      id: 5,
      title: 'Kurumsal/Kişisel Web Siteleri',
      description: 'Modern ve profesyonel web siteleri tasarım ve geliştirme hizmetleri.',
      features: [
        'Responsive tasarım',
        'SEO optimizasyonu',
        'Hızlı yükleme süreleri',
        'Güvenlik önlemleri',
        'İçerik yönetim sistemi'
      ],
      price: 'Başlangıç: ₺3.500',
      icon: '💻',
      popular: false
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Hızlı Teslimat',
      description: 'Projelerinizi zamanında teslim ediyoruz'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Güvenli İşlem',
      description: 'Tüm işlemleriniz güvenli şekilde korunur'
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: '7/24 Destek',
      description: 'Her zaman yanınızdayız'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Kalite Garantisi',
      description: 'Müşteri memnuniyeti garantisi'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Hizmetlerimiz - Baybar</title>
        <meta name="description" content="Baybar'ın sunduğu e-ticaret danışmanlığı, dijital pazarlama, teknik destek ve eğitim hizmetleri hakkında detaylı bilgi." />
      </Helmet>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding hero-bg">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-fade-in-up">
                <Heading level={1} className="mb-6" gradient>
                  Hizmetlerimiz
                </Heading>
                <p className="text-xl text-gray-600 leading-relaxed">
                  E-ticaret sektöründe ihtiyacınız olan tüm hizmetleri tek çatı altında sunuyoruz. 
                  Profesyonel ekibimizle birlikte dijital dönüşüm yolculuğunuzda yanınızdayız.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative ${
                    service.popular ? 'ring-1 ring-blue-200' : ''
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Popüler
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className="text-3xl mb-3">{service.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {service.description}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mb-4">
                      {service.price}
                    </p>
                  </div>

                  <button
                    onClick={() => window.location.href = `/quote/${service.id}`}
                    className="w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    Teklif Alın
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Heading level={2} className="mb-4" gradient>
                Neden Baybar?
              </Heading>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Müşterilerimizin başarısı için sunduğumuz avantajlar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20 text-center group hover:shadow-lg hover:bg-white/90 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Decorative element */}
                  <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary-600 text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <Heading level={2} className="text-white mb-6">
                Projenizi Hayata Geçirin
              </Heading>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Uzman ekibimizle birlikte e-ticaret yolculuğunuza başlayın. 
                Size özel çözümlerimizle başarıya ulaşın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="accent" size="lg">
                  Ücretsiz Danışmanlık
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-primary-600">
                  Hemen İletişime Geçin
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Services;
