/**
 * Baybar Kurumsal Tanıtım Sitesi - Footer Bileşeni
 * Site alt bilgi ve bağlantılar
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Hızlı bağlantılar
  const quickLinks = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/hakkimizda', label: 'Hakkımızda' },
    { path: '/hizmetler', label: 'Hizmetler' },
    { path: '/iletisim', label: 'İletişim' }
  ];

  // Hizmetler
  const services = [
    { path: '/hizmetler#web-tasarim', label: 'Web Tasarım' },
    { path: '/hizmetler#kurumsal-kimlik', label: 'Kurumsal Kimlik' },
    { path: '/hizmetler#dijital-pazarlama', label: 'Dijital Pazarlama' },
    { path: '/hizmetler#e-ticaret', label: 'E-Ticaret Çözümleri' }
  ];

  // Sosyal medya bağlantıları
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/baybar',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/baybar',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/baybar',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/baybar',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="footer">
      {/* Ana Footer İçeriği */}
      <div className="footer__main">
        <div className="footer__container">
          <div className="footer__grid">
            {/* Şirket Bilgileri */}
            <div className="footer__section footer__section--company">
              <div className="footer__brand">
                <div className="footer__logo">
                  <svg 
                    className="footer__logo-icon" 
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
                <div className="footer__brand-text">
                  <h3 className="footer__title">BAYBAR</h3>
                  <span className="footer__subtitle">Kurumsal Çözümler</span>
                </div>
              </div>
              
              <p className="footer__description">
                Modern web tasarım ve kurumsal kimlik çözümleri ile işletmenizi 
                dijital dünyada öne çıkarıyoruz. Profesyonel yaklaşım, yaratıcı 
                tasarım ve güvenilir hizmet anlayışımızla yanınızdayız.
              </p>
              
              <div className="footer__social">
                <h4 className="footer__social-title">Bizi Takip Edin</h4>
                <div className="footer__social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="footer__social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.name} sayfamızı ziyaret edin`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Hızlı Bağlantılar */}
            <div className="footer__section">
              <h4 className="footer__section-title">Hızlı Bağlantılar</h4>
              <ul className="footer__links">
                {quickLinks.map((link) => (
                  <li key={link.path} className="footer__link-item">
                    <Link to={link.path} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hizmetlerimiz */}
            <div className="footer__section">
              <h4 className="footer__section-title">Hizmetlerimiz</h4>
              <ul className="footer__links">
                {services.map((service) => (
                  <li key={service.path} className="footer__link-item">
                    <Link to={service.path} className="footer__link">
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* İletişim Bilgileri */}
            <div className="footer__section">
              <h4 className="footer__section-title">İletişim</h4>
              <div className="footer__contact">
                <div className="footer__contact-item">
                  <div className="footer__contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <circle 
                        cx="12" 
                        cy="10" 
                        r="3" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="footer__contact-content">
                    <span className="footer__contact-label">Adres</span>
                    <span className="footer__contact-value">
                      Atatürk Mahallesi, İş Merkezi Sokak<br />
                      No: 123, Kat: 5, 34000 İstanbul
                    </span>
                  </div>
                </div>

                <div className="footer__contact-item">
                  <div className="footer__contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M22 16.92V19.92C22 20.52 21.52 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.52 0.48 -1 1.08 -1H4.08C4.68 -1 5.16 -0.52 5.16 0.08C5.16 2.08 5.56 4.04 6.32 5.84C6.48 6.24 6.36 6.72 6.04 7.04L4.84 8.24C6.28 11.6 8.4 13.72 11.76 15.16L12.96 13.96C13.28 13.64 13.76 13.52 14.16 13.68C15.96 14.44 17.92 14.84 19.92 14.84C20.52 14.84 21 15.32 21 15.92V18.92H22Z" 
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="footer__contact-content">
                    <span className="footer__contact-label">Telefon</span>
                    <a 
                      href="tel:+905551234567" 
                      className="footer__contact-value footer__contact-link"
                    >
                      +90 555 123 45 67
                    </a>
                  </div>
                </div>

                <div className="footer__contact-item">
                  <div className="footer__contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <polyline 
                        points="22,6 12,13 2,6" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="footer__contact-content">
                    <span className="footer__contact-label">E-posta</span>
                    <a 
                      href="mailto:info@baybar.com" 
                      className="footer__contact-value footer__contact-link"
                    >
                      info@baybar.com
                    </a>
                  </div>
                </div>

                <div className="footer__contact-item">
                  <div className="footer__contact-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <polyline 
                        points="12,6 12,12 16,14" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="footer__contact-content">
                    <span className="footer__contact-label">Çalışma Saatleri</span>
                    <span className="footer__contact-value">
                      Pazartesi - Cuma: 09:00 - 18:00<br />
                      Cumartesi: 10:00 - 16:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Footer */}
      <div className="footer__bottom">
        <div className="footer__container">
          <div className="footer__bottom-content">
            <div className="footer__copyright">
              <p>
                © {currentYear} <strong>Baybar Kurumsal Çözümler</strong>. 
                Tüm hakları saklıdır.
              </p>
            </div>
            
            <div className="footer__legal">
              <Link to="/gizlilik-politikasi" className="footer__legal-link">
                Gizlilik Politikası
              </Link>
              <Link to="/kullanim-kosullari" className="footer__legal-link">
                Kullanım Koşulları
              </Link>
              <Link to="/cerez-politikasi" className="footer__legal-link">
                Çerez Politikası
              </Link>
            </div>
            
            <div className="footer__credits">
              <span>Tasarım ve Geliştirme: </span>
              <strong>Baybar Team</strong>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;