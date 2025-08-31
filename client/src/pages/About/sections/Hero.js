import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import './Hero.scss';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Yenilikçi Çözümlerle <span className="text-gradient">Geleceği Şekillendiriyoruz</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            10 yılı aşkın deneyimimizle, sektörde fark yaratan projelere imza atıyor ve müşterilerimize en iyi hizmeti sunmak için çalışıyoruz.
          </motion.p>
          
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/projeler" className="btn btn-primary">
              Projelerimizi İncele
              <FiArrowRight className="icon" />
            </Link>
            <Link to="/iletisim" className="btn btn-outline">
              İletişime Geçin
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <img 
            src="/images/about-hero.jpg" 
            alt="Hakkımızda" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400/F9FAFB/4F46E5?text=Hakkımızda';
            }}
          />
        </motion.div>
      </div>
      
      <div className="hero-shape"></div>
    </section>
  );
};

export default Hero;
