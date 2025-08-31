import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Partners.scss';

const Partners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePartners, setVisiblePartners] = useState(5);

  const partners = [
    { id: 1, name: 'Teknoloji A.Ş.', logo: '/images/partners/tech-company.png' },
    { id: 2, name: 'İnovasyon Çözümleri', logo: '/images/partners/innovation-solutions.png' },
    { id: 3, name: 'Global Teknoloji', logo: '/images/partners/global-tech.png' },
    { id: 4, name: 'Akıllı Sistemler', logo: '/images/partners/smart-systems.png' },
    { id: 5, name: 'Veri Analitik', logo: '/images/partners/data-analytics.png' },
    { id: 6, name: 'Bulut Teknolojileri', logo: '/images/partners/cloud-tech.png' },
    { id: 7, name: 'Yapay Zeka Çözümleri', logo: '/images/partners/ai-solutions.png' },
    { id: 8, name: 'Dijital Dönüşüm', logo: '/images/partners/digital-transformation.png' },
  ];

  // Update visible partners based on screen size
  useEffect(() => {
    const updateVisiblePartners = () => {
      if (window.innerWidth < 768) {
        setVisiblePartners(2);
      } else if (window.innerWidth < 1024) {
        setVisiblePartners(3);
      } else {
        setVisiblePartners(5);
      }
    };

    window.addEventListener('resize', updateVisiblePartners);
    updateVisiblePartners();

    return () => window.removeEventListener('resize', updateVisiblePartners);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= partners.length - visiblePartners ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? partners.length - visiblePartners : prevIndex - 1
    );
  };

  // Calculate which partners to show
  const visibleItems = [];
  for (let i = 0; i < visiblePartners; i++) {
    const index = (currentIndex + i) % partners.length;
    visibleItems.push(partners[index]);
  }

  return (
    <section className="partners section-padding bg-light">
      <div className="container">
        <div className="section-header">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            İş Ortaklarımız
          </motion.h2>
          <motion.p 
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Güçlü iş birliklerimizle daha ileriye
          </motion.p>
        </div>

        <div className="partners-slider">
          <button 
            className="slider-arrow prev" 
            onClick={prevSlide}
            aria-label="Önceki"
          >
            <FaChevronLeft />
          </button>
          
          <div className="partners-grid">
            {visibleItems.map((partner, index) => (
              <motion.div 
                key={partner.id}
                className="partner-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="partner-logo">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.textContent = partner.name.split(' ').map(n => n[0]).join('');
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="logo-fallback"></div>
                </div>
                <h3 className="partner-name">{partner.name}</h3>
              </motion.div>
            ))}
          </div>
          
          <button 
            className="slider-arrow next" 
            onClick={nextSlide}
            aria-label="Sonraki"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="partners-dots">
          {Array.from({ length: Math.ceil(partners.length / visiblePartners) }).map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex >= index * visiblePartners && 
                          currentIndex < (index + 1) * visiblePartners ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index * visiblePartners)}
              aria-label={`Sayfa ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
