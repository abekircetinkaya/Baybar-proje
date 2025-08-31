/**
 * Admin Panel Ana Layout Bileşeni
 * Modern, beyaz temalı admin panel layout'u
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { WebSocketProvider } from '../../contexts/WebSocketContext';
import './AdminLayout.scss';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Responsive kontrol
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Admin yetki kontrolü (geliştirme aşamasında)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    // Geliştirme aşamasında demo token ve role ekle
    if (!token) {
      localStorage.setItem('authToken', 'demo-token-123');
      localStorage.setItem('userRole', 'admin');
      return;
    }
    
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      // Demo için admin role ver
      localStorage.setItem('userRole', 'admin');
    }
  }, [navigate]);

  // Sidebar toggle fonksiyonları
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Sayfa başlığını belirle
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/users')) return 'Kullanıcı Yönetimi';
    if (path.includes('/contents')) return 'İçerik Yönetimi';
    if (path.includes('/contacts')) return 'İletişim Mesajları';
    if (path.includes('/offers')) return 'Teklifler';
    return 'Admin Panel';
  };

  return (
    <WebSocketProvider>
      <div className={`admin-layout ${
        sidebarCollapsed ? 'sidebar-collapsed' : ''
      } ${isMobile ? 'mobile' : ''}`}>
        {/* Sidebar */}
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          isMobile={isMobile}
        />
        
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={closeSidebar}
          />
        )}
        
        {/* Main content area */}
        <div className="admin-main">
          {/* Header */}
          <AdminHeader 
            onToggleSidebar={toggleSidebar}
            pageTitle={getPageTitle()}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          {/* Content */}
          <main className="admin-content">
            <div className="content-wrapper">
              {children}
            </div>
          </main>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default AdminLayout;