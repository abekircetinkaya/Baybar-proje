import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import Heading from '../common/Heading';
import Button from '../common/Button';

const HeroSection = ({ content }) => {
  if (!content) return null;

  const heroSection = content.sections?.find(section => section.type === 'hero') || content.sections?.[0];

  if (!heroSection) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-bg overflow-hidden">
      {/* Background Image */}
      {heroSection.image_url && (
        <div className="absolute inset-0 z-0">
          <img
            src={heroSection.image_url}
            alt={heroSection.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        <div className="max-w-4xl mx-auto">
          <Heading
            level={1}
            className="text-white mb-6 animate-fade-in"
            gradient={false}
          >
            {heroSection.title}
          </Heading>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed animate-slide-up">
            {heroSection.text}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button
              variant="accent"
              size="lg"
              className="group"
            >
              Hizmetlerimizi Keşfedin
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
            >
              <Play className="w-5 h-5 mr-2" />
              Tanıtım Videosu
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
