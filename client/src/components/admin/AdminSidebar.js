/**
 * Admin Panel Sidebar Bileşeni
 * Dinamik menü yapısı ve dropdown destekli navigasyon
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiBriefcase, FiMail, FiUsers, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { BiSolidDashboard } from 'react-icons/bi';
import './AdminSidebar.scss';

const AdminSidebar = ({ collapsed, isOpen, onClose, isMobile }) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // Menü yapısı
  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: <BiSolidDashboard size={18} />,
      path: '/admin/dashboard',
      exact: true
    },
    {
      id: 'content',
      title: 'İçerik Yönetimi',
      icon: <FiFileText size={18} />,
      hasChildren: true,
      children: [
        {
          id: 'home-content',
          title: 'Ana Sayfa Yönetimi',
          path: '/admin/content/home'
        },
        {
          id: 'about-content',
          title: 'Hakkımızda Yönetimi',
          path: '/admin/content/about'
        },
        {
          id: 'services-content',
          title: 'Hizmetler Yönetimi',
          path: '/admin/content/services'
        },
        {
          id: 'contact-content',
          title: 'İletişim Yönetimi',
          path: '/admin/content/contact'
        }
      ]
    },
    {
      id: 'offers',
      title: 'Teklifler',
      icon: <FiBriefcase size={18} />,
      path: '/admin/offers'
    },
    {
      id: 'messages',
      title: 'İletişim Mesajları',
      icon: <FiMail size={18} />,
      path: '/admin/messages'
    },
    {
      id: 'users',
      title: 'Kullanıcılar',
      icon: <FiUsers size={18} />,
      path: '/admin/users'
    }
  ];

  // Dropdown toggle
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Aktif menü kontrolü
  const isActiveMenu = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    if (item.path) {
      return location.pathname.startsWith(item.path);
    }
    if (item.children) {
      return item.children.some(child => 
        location.pathname.startsWith(child.path)
      );
    }
    return false;
  };

  // Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/admin/login');
  };

  // Menü item render
  const renderMenuItem = (item) => {
    const isActive = isActiveMenu(item);
    const isExpanded = expandedMenus[item.id];
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={item.id} className={`menu-item ${
        isActive ? 'active' : ''
      } ${hasChildren ? 'has-children' : ''}`}>
        {hasChildren ? (
          <>
            <button
              className="menu-button"
              onClick={() => toggleMenu(item.id)}
              title={collapsed ? item.title : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="menu-title">{item.title}</span>
                  <span className={`dropdown-arrow ${
                    isExpanded ? 'expanded' : ''
                  }`}><FiChevronDown size={14} /></span>
                </>
              )}
            </button>
            
            {!collapsed && (
              <ul className={`submenu ${
                isExpanded ? 'expanded' : ''
              }`}>
                {item.children.map(child => (
                  <li key={child.id} className={`submenu-item ${
                    location.pathname === child.path ? 'active' : ''
                  }`}>
                    <Link
                      to={child.path}
                      className="submenu-link"
                      onClick={isMobile ? onClose : undefined}
                    >
                      <span className="submenu-title">{child.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={item.path}
            className="menu-link"
            onClick={isMobile ? onClose : undefined}
            title={collapsed ? item.title : ''}
          >
            <span className="menu-icon">{item.icon}</span>
            {!collapsed && (
              <span className="menu-title">{item.title}</span>
            )}
          </Link>
        )}
      </li>
    );
  };

  return (
    <aside className={`admin-sidebar ${
      collapsed ? 'collapsed' : ''
    } ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <Link to="/admin/dashboard" className="logo">
          {!collapsed ? (
            <>
              <span className="logo-icon">
                <FiHome size={22} />
              </span>
              <span className="logo-text">Baybar Admin</span>
            </>
          ) : (
            <span className="logo-icon">
              <FiHome size={22} />
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map(renderMenuItem)}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className="logout-button"
          onClick={handleLogout}
          title={collapsed ? 'Çıkış Yap' : ''}
        >
          <span className="logout-icon"><FiLogOut size={18} /></span>
          {!collapsed && (
            <span className="logout-text">Çıkış Yap</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;