/**
 * Baybar Kurumsal Tanıtım Sitesi - Ana Uygulama Bileşeni
 * Routing yapısını ve genel layout'u yönetir
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.scss';

// Layout bileşenleri
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Sayfa bileşenleri
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import PurchaseDetail from './pages/PurchaseDetail';
import PlanDetail from './pages/PlanDetail';

// Admin bileşenleri
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContentManagement from './pages/admin/AdminContentManagement';
import AdminOffersManagement from './pages/admin/AdminOffersManagement';
import AdminUsersManagement from './pages/admin/AdminUsersManagement';
import AdminMessagesManagement from './pages/admin/AdminMessagesManagement';

// İçerik Yönetimi Sayfaları
import HomePageManagement from './pages/admin/content/HomePageManagement';
import AboutPageManagement from './pages/admin/content/AboutPageManagement';
import ServicesPageManagement from './pages/admin/content/ServicesPageManagement';
import ContactPageManagement from './pages/admin/content/ContactPageManagement';




/**
 * Ana uygulama bileşeni
 * Tüm sayfalar için ortak layout ve routing yapısını sağlar
 */
function App() {
  return (
    <div className="App">
      <Routes>
        {/* Admin rotaları - Ayrı layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="content" element={<AdminContentManagement />} />
                  <Route path="content/home" element={<HomePageManagement />} />
                  <Route path="content/about" element={<AboutPageManagement />} />
                  <Route path="content/services" element={<ServicesPageManagement />} />
                  <Route path="content/contact" element={<ContactPageManagement />} />
                  <Route path="offers" element={<AdminOffersManagement />} />
                  <Route path="messages" element={<AdminMessagesManagement />} />
                  <Route path="users" element={<AdminUsersManagement />} />
                </Routes>
              </AdminLayout>
            } />
        
        {/* Normal web sitesi rotaları - Header/Footer ile */}
        <Route path="/*" element={
          <>
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/hizmetler" element={<Services />} />
                <Route path="/plan-detail/:planId" element={<PlanDetail />} />
                <Route path="/hizmetler/:planName-satin-alma" element={<PurchaseDetail />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;