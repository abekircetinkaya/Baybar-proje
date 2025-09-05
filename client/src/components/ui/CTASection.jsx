import React from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import Heading from '../common/Heading';
import Button from '../common/Button';

const CTASection = ({ content }) => {
  if (!content) return null;

  const ctaSection = content.sections?.find(section => section.type === 'cta') || content.sections?.find(section => section.title?.toLowerCase().includes('iletişim'));

  if (!ctaSection) return null;

  return (
    <section className="section-padding bg-primary-600 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <Heading level={2} className="text-white mb-6">
            {ctaSection.title}
          </Heading>
          
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            {ctaSection.text}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="accent"
              size="lg"
              className="group"
            >
              <Mail className="w-5 h-5 mr-2" />
              Teklif Alın
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white hover:text-primary-600"
            >
              <Phone className="w-5 h-5 mr-2" />
              Hemen Arayın
            </Button>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Telefon</h3>
              <p className="text-primary-100">+90 555 123 45 67</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">E-posta</h3>
              <p className="text-primary-100">info@baybar.com</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Hızlı Yanıt</h3>
              <p className="text-primary-100">24 saat içinde</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
