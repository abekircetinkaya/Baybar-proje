import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Heading from '../common/Heading';
import LoadingSpinner from '../common/LoadingSpinner';

const PartnersSection = () => {
  const { state, actions } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  React.useEffect(() => {
    if (state.partners.data.length === 0 && !state.partners.loading) {
      actions.loadPartners();
    }
  }, [state.partners.data.length, state.partners.loading, actions]);

  // Mock partners data for demonstration
  const mockPartners = [
    { _id: '1', name: 'Microsoft', logo_url: null },
    { _id: '2', name: 'Google', logo_url: null },
    { _id: '3', name: 'Amazon', logo_url: null },
    { _id: '4', name: 'Shopify', logo_url: null },
    { _id: '5', name: 'WooCommerce', logo_url: null },
    { _id: '6', name: 'Magento', logo_url: null },
    { _id: '7', name: 'PayPal', logo_url: null },
    { _id: '8', name: 'Stripe', logo_url: null },
    { _id: '9', name: 'Facebook', logo_url: null }
  ];

  const partnersData = state.partners.data.length > 0 ? state.partners.data : mockPartners;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || partnersData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(partnersData.length / 3));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, partnersData.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(partnersData.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(partnersData.length / 3)) % Math.ceil(partnersData.length / 3));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Always show partners section with mock data
  // No loading state needed as we have mock data

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Heading level={2} className="mb-4" gradient>
            Çalıştığımız Firmalar
          </Heading>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Güvenilir iş ortaklarımızla birlikte müşterilerimize en kaliteli hizmeti sunuyoruz
          </p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(partnersData.length / 3) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                    {partnersData
                      .slice(slideIndex * 3, (slideIndex + 1) * 3)
                      .map((partner, index) => (
                        <div
                          key={partner._id}
                          className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 group border border-gray-100"
                        >
                          {partner.logo_url ? (
                            <div className="text-center">
                              <img
                                src={partner.logo_url}
                                alt={partner.name}
                                className="max-h-16 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto mb-2"
                                loading="lazy"
                              />
                              <span className="text-sm text-gray-600 font-medium">
                                {partner.name}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                <span className="text-primary-600 font-bold text-xl">
                                  {partner.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600 font-medium">
                                {partner.name}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {partnersData.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {partnersData.length > 3 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(partnersData.length / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {partnersData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Henüz iş ortağı bilgisi bulunmuyor.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;
