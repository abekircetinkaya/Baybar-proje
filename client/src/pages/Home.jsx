import React from 'react';
import { Link } from 'react-router-dom';
import TestimonialsSection from '../components/ui/TestimonialsSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns=' http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/4 w-8 h-8 bg-indigo-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-60 right-1/4 w-14 h-14 bg-purple-300 rounded-full opacity-20 animate-float" style={{ animationDelay: '1.5s' }}></div>

        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-600 text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              E-ticaret Uzmanları
            </div>

            {/* Main heading with gradient text */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 bg-clip-text text-transparent">
                Baybar
              </span>
              <br />
              <span className="text-gray-900">Kurumsal</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              E-ticaret sektöründe yurtdışına hizmet veren 
              <span className="text-blue-600 font-semibold"> profesyonel şirket</span>. 
              Güvenilir ve kaliteli hizmet anlayışımızla müşterilerimize en iyi deneyimi sunuyoruz.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/services"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="relative z-10">Hizmetlerimiz</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/contact"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                İletişime Geç
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100+</div>
                <div className="text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">5+</div>
                <div className="text-gray-600">Yıl Deneyim</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Destek</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Müşterilerimize en iyi hizmeti sunmak için çalışıyoruz
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hızlı Çözümler</h3>
              <p className="text-sm text-gray-600">
                Müşterilerimizin ihtiyaçlarına hızlı ve etkili çözümler sunuyoruz.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Güvenilir Hizmet</h3>
              <p className="text-sm text-gray-600">
                Yılların deneyimi ile güvenilir ve kaliteli hizmet garantisi.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Uzman Ekip</h3>
              <p className="text-sm text-gray-600">
                Alanında uzman ekibimizle en iyi çözümleri sunuyoruz.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Harika Web Siteleri</h3>
              <p className="text-sm text-gray-600">
                Modern ve kullanıcı dostu web siteleri tasarlıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Çalıştığımız Firmalar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Güvenilir iş ortaklarımızla birlikte müşterilerimize en kaliteli hizmeti sunuyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Shopify */}
            <div className="group bg-gray-50 p-6 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    src="https://cdn.shopify.com/s/files/1/0070/7032/files/shopify_logo_whitebg.png" 
                    alt="Shopify" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shopify</h3>
                <p className="text-sm text-gray-600">E-ticaret Platformu</p>
              </div>
            </div>

            {/* WooCommerce */}
            <div className="group bg-gray-50 p-6 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    src="https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce.svg" 
                    alt="WooCommerce" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">WooCommerce</h3>
                <p className="text-sm text-gray-600">WordPress E-ticaret</p>
              </div>
            </div>

            {/* Magento */}
            <div className="group bg-gray-50 p-6 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    src="https://magento.com/sites/default/files/magento-logo.svg" 
                    alt="Magento" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Magento</h3>
                <p className="text-sm text-gray-600">Enterprise E-ticaret</p>
              </div>
            </div>

            {/* PrestaShop */}
            <div className="group bg-gray-50 p-6 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    src="https://www.prestashop.com/sites/default/files/prestashop-logo.svg" 
                    alt="PrestaShop" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PrestaShop</h3>
                <p className="text-sm text-gray-600">Açık Kaynak E-ticaret</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Bizimle Çalışmaya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Projeleriniz için en iyi çözümleri sunmak için buradayız. 
            Hemen iletişime geçin!
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            İletişime Geç
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
