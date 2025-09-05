import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Heading from '../common/Heading';
import Button from '../common/Button';

const ServicesSection = ({ content }) => {
  if (!content) return null;

  const servicesSection = content.sections?.find(section => section.type === 'service') || content.sections?.find(section => section.title?.toLowerCase().includes('hizmet'));

  if (!servicesSection) return null;

  // Mock services data - in real app this would come from API
  const services = [
    {
      id: 1,
      title: 'E-ticaret Danışmanlığı',
      description: 'Online mağaza kurulumundan pazarlama stratejilerine kadar kapsamlı danışmanlık hizmetleri.',
      features: ['Mağaza kurulumu', 'SEO optimizasyonu', 'Pazarlama stratejisi', 'Analitik raporlama'],
      icon: '🛒'
    },
    {
      id: 2,
      title: 'Dijital Pazarlama',
      description: 'Sosyal medya yönetimi, reklam kampanyaları ve içerik pazarlama çözümleri.',
      features: ['Sosyal medya yönetimi', 'Google Ads', 'Facebook Ads', 'İçerik üretimi'],
      icon: '📱'
    },
    {
      id: 3,
      title: 'Teknik Destek',
      description: '7/24 teknik destek ve sistem yönetimi ile kesintisiz hizmet garantisi.',
      features: ['7/24 destek', 'Sistem yönetimi', 'Güvenlik güncellemeleri', 'Performans optimizasyonu'],
      icon: '⚙️'
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <Heading level={2} className="mb-6" gradient>
            {servicesSection.title}
          </Heading>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {servicesSection.text}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="card p-8 group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-6">{service.icon}</div>
              
              <Heading level={3} className="mb-4 text-gray-900">
                {service.title}
              </Heading>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="w-full group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600"
              >
                Daha Fazla Bilgi
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" size="lg">
            Tüm Hizmetlerimizi Görün
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
