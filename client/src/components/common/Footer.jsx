import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <img 
                  src="/logo.svg" 
                  alt="Baybar Logo" 
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-gray-300 mb-4">
                E-ticaret sektöründe yurtdışına hizmet veren profesyonel şirket.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-white">
                    Hizmetler
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <div className="space-y-2">
                <p className="text-gray-300">İstanbul, Türkiye</p>
                <p className="text-gray-300">+90 555 123 45 67</p>
                <p className="text-gray-300">info@baybar.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
            © {currentYear} Powered by 
            <a 
              href="https://nexlysoft.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center hover:opacity-80 transition-opacity mx-1"
            >
              <img 
                src="/dar-nexlysoft-logo.svg" 
                alt="NexlySoft Logo" 
                className="w-auto filter brightness-0 invert"
                style={{ 
                  height: '1.2em',
                  maxHeight: '20px',
                  minHeight: '16px'
                }}
              />
            </a>
            Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
