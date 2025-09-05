import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Quote from './pages/Quote';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ContentManagement from './pages/admin/ContentManagement';
import PartnersManagement from './pages/admin/PartnersManagement';
import QuotesManagement from './pages/admin/QuotesManagement';
import UserManagement from './pages/admin/UserManagement';
import Payments from './pages/admin/Payments';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<ContentManagement />} />
          <Route path="/admin/partners" element={<PartnersManagement />} />
          <Route path="/admin/quotes" element={<QuotesManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/settings" element={<Settings />} />
          
          {/* Public Routes - With Header/Footer */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/quote/:serviceId" element={<Quote />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center pt-20">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Sayfa bulunamadı</p>
                        <a
                          href="/"
                          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        >
                          Ana Sayfaya Dön
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </main>
              
              <Footer />
            </div>
          } />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
