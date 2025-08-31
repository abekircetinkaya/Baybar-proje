/**
 * Baybar Kurumsal Tanıtım Sitesi - Header Bileşeni
 * Ana navigasyon ve site başlığı
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Scroll efekti için
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Menü toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Aktif link kontrolü
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Navigasyon menü öğeleri
  const navigationItems = [
    { path: '/', label: 'Ana Sayfa', icon: 'home' },
    { path: '/hakkimizda', label: 'Hakkımızda', icon: 'info' },
    { path: '/hizmetler', label: 'Hizmetler', icon: 'services' },
    { path: '/iletisim', label: 'İletişim', icon: 'contact' }
  ];

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        {/* Logo ve Site Başlığı */}
        <div className="header__brand">
          <Link to="/" className="header__logo-link">
            <div className="header__logo">
              <svg 
                className="header__logo-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2L2 7L12 12L22 7L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 17L12 22L22 17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 12L12 17L22 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="header__brand-text">
              <h1 className="header__title">BAYBAR</h1>
              <span className="header__subtitle">Kurumsal Çözümler</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigasyon */}
        <nav className="header__nav header__nav--desktop">
          <ul className="header__nav-list">
            {navigationItems.map((item) => (
              <li key={item.path} className="header__nav-item">
                <Link 
                  to={item.path} 
                  className={`header__nav-link ${
                    isActiveLink(item.path) ? 'header__nav-link--active' : ''
                  }`}
                >
                  <span className="header__nav-text">{item.label}</span>
                  {isActiveLink(item.path) && (
                    <span className="header__nav-indicator"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="header__cta">
          <Link to="/iletisim" className="header__cta-button">
            <span>Teklif Al</span>
            <svg 
              className="header__cta-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M5 12H19M19 12L12 5M19 12L12 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`header__menu-toggle ${
            isMenuOpen ? 'header__menu-toggle--active' : ''
          }`}
          onClick={toggleMenu}
          aria-label="Menüyü aç/kapat"
          aria-expanded={isMenuOpen}
        >
          <span className="header__menu-line"></span>
          <span className="header__menu-line"></span>
          <span className="header__menu-line"></span>
        </button>
      </div>

      {/* Mobile Navigasyon */}
      <nav className={`header__nav header__nav--mobile ${
        isMenuOpen ? 'header__nav--mobile-open' : ''
      }`}>
        <div className="header__nav-overlay" onClick={toggleMenu}></div>
        <div className="header__nav-content">
          <div className="header__nav-header">
            <div className="header__nav-brand">
              <h2>Navigasyon</h2>
            </div>
            <button 
              className="header__nav-close"
              onClick={toggleMenu}
              aria-label="Menüyü kapat"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          
          <ul className="header__nav-list header__nav-list--mobile">
            {navigationItems.map((item) => (
              <li key={item.path} className="header__nav-item">
                <Link 
                  to={item.path} 
                  className={`header__nav-link header__nav-link--mobile ${
                    isActiveLink(item.path) ? 'header__nav-link--active' : ''
                  }`}
                  onClick={toggleMenu}
                >
                  <span className="header__nav-icon">
                    {/* Icon placeholder - gerçek iconlar eklenebilir */}
                    <div className="header__nav-icon-placeholder"></div>
                  </span>
                  <span className="header__nav-text">{item.label}</span>
                  {isActiveLink(item.path) && (
                    <span className="header__nav-check">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M20 6L9 17L4 12" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="header__nav-footer">
            <Link 
              to="/iletisim" 
              className="header__nav-cta"
              onClick={toggleMenu}
            >
              <span>Hemen Teklif Al</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M5 12H19M19 12L12 5M19 12L12 19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            
            <div className="header__nav-contact">
              <p className="header__nav-contact-text">
                Sorularınız için bize ulaşın
              </p>
              <a 
                href="tel:+905551234567" 
                className="header__nav-contact-phone"
              >
                +90 555 123 45 67
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;