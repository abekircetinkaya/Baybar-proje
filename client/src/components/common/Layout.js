/**
 * Baybar Kurumsal Tanıtım Sitesi - Layout Bileşeni
 * Ana sayfa düzeni - Header, Footer ve içerik alanı
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.scss';

const Layout = ({ children, className = '', pageTitle = '' }) => {
  const location = useLocation();

  // Sayfa değiştiğinde scroll'u en üste al
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // Sayfa başlığını güncelle
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | Baybar Kurumsal Çözümler`;
    } else {
      document.title = 'Baybar Kurumsal Çözümler - Web Tasarım ve Kurumsal Kimlik';
    }
  }, [pageTitle]);

  // Sayfa yoluna göre body class ekle
  useEffect(() => {
    const bodyClasses = document.body.className.split(' ').filter(cls => !cls.startsWith('page-'));
    const pageClass = `page-${location.pathname.replace(/\//g, '-').replace(/^-/, '') || 'home'}`;
    document.body.className = [...bodyClasses, pageClass].join(' ');

    return () => {
      // Cleanup - sayfa class'ını temizle
      document.body.className = document.body.className
        .split(' ')
        .filter(cls => !cls.startsWith('page-'))
        .join(' ');
    };
  }, [location.pathname]);

  return (
    <div className={`layout ${className}`}>
      {/* Header */}
      <Header />
      
      {/* Ana İçerik Alanı */}
      <main className="layout__main" role="main">
        <div className="layout__content">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

// Scroll to Top Button Bileşeni
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  // Scroll pozisyonunu takip et
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? 'scroll-to-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Sayfanın başına dön"
      type="button"
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="scroll-to-top__icon"
      >
        <path 
          d="M12 19V5M5 12L12 5L19 12" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default Layout;