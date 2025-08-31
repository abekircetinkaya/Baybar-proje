/**
 * Admin Panel Header Bileşeni
 * Üst navigasyon ve kullanıcı bilgileri
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../contexts/WebSocketContext';
import './AdminHeader.scss';

const AdminHeader = ({ onToggleSidebar, pageTitle, sidebarCollapsed }) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { notifications, isConnected, onlineUsers, clearNotification, clearAllNotifications } = useWebSocket();

  // Kullanıcı bilgilerini al
  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Admin';
    const role = localStorage.getItem('userRole') || 'admin';
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setUserName(name);
    setUserRole(role);
    setIsDarkMode(darkMode);
    
    // Body'ye dark mode class ekle/çıkar
    if (darkMode) {
      document.body.classList.add('admin-dark-mode');
    }
  }, []);

  // Dropdown dışına tıklama kontrolü
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.body.classList.add('admin-dark-mode');
    } else {
      document.body.classList.remove('admin-dark-mode');
    }
  };

  // Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('darkMode');
    document.body.classList.remove('admin-dark-mode');
    navigate('/admin/login');
  };

  // Profil sayfasına git
  const goToProfile = () => {
    setUserDropdownOpen(false);
    navigate('/admin/profile');
  };

  // Ayarlar sayfasına git
  const goToSettings = () => {
    setUserDropdownOpen(false);
    navigate('/admin/settings');
  };

  // Rol badge rengi
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'superadmin':
        return 'role-superadmin';
      case 'admin':
        return 'role-admin';
      default:
        return 'role-user';
    }
  };

  // Rol metni
  const getRoleText = (role) => {
    switch (role) {
      case 'superadmin':
        return 'Süper Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'Kullanıcı';
    }
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        {/* Sidebar toggle */}
        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Sidebar'ı aç/kapat"
        >
          <span className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Page title */}
        <div className="page-title">
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle */}
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Notifications */}
        <div className="notification-dropdown" ref={notificationRef}>
          <button 
            className={`notification-button ${!isConnected ? 'disconnected' : ''}`}
            onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
            title={isConnected ? 'Bildirimler' : 'Bağlantı kesildi'}
          >
            <span className="notification-icon">🔔</span>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
            {!isConnected && <span className="connection-indicator offline">●</span>}
          </button>

          {notificationDropdownOpen && (
            <div className="notification-dropdown-menu">
              <div className="notification-header">
                <h3>Bildirimler</h3>
                <div className="notification-actions">
                  <span className="online-users">👥 {onlineUsers} aktif</span>
                  {notifications.length > 0 && (
                    <button 
                      className="clear-all-btn"
                      onClick={clearAllNotifications}
                      title="Tümünü temizle"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <span className="no-notif-icon">📭</span>
                    <p>Henüz bildirim yok</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div key={notification.id} className={`notification-item ${notification.type}`}>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">
                          {new Date(notification.timestamp).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <button 
                        className="notification-close"
                        onClick={() => clearNotification(notification.id)}
                        title="Kapat"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 10 && (
                <div className="notification-footer">
                  <span>+{notifications.length - 10} daha fazla bildirim</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="user-button"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            aria-expanded={userDropdownOpen}
          >
            <div className="user-avatar">
              <span className="avatar-text">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className={`user-role ${getRoleBadgeClass(userRole)}`}>
                {getRoleText(userRole)}
              </span>
            </div>
            <span className={`dropdown-arrow ${
              userDropdownOpen ? 'open' : ''
            }`}>▼</span>
          </button>

          {userDropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={goToProfile}
              >
                <span className="item-icon">👤</span>
                <span className="item-text">Profil</span>
              </button>
              
              <button
                className="dropdown-item"
                onClick={goToSettings}
              >
                <span className="item-icon">⚙️</span>
                <span className="item-text">Ayarlar</span>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <span className="item-icon">🚪</span>
                <span className="item-text">Çıkış Yap</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;