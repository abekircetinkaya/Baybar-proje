/**
 * Admin Panel Giriş Sayfası
 * JWT tabanlı kimlik doğrulama ile admin girişi
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../../services/api';
import './AdminLogin.scss';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Zaten giriş yapmış kullanıcıyı kontrol et
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (token && (userRole === 'admin' || userRole === 'superadmin')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Form değişikliklerini handle et
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata mesajını temizle
    if (error) {
      setError('');
    }
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await post('/auth/login', formData);

      if (data.success) {
        // Admin yetkisi kontrolü
        if (data.user.role !== 'admin' && data.user.role !== 'superadmin') {
          setError('Bu sayfaya erişim yetkiniz bulunmamaktadır.');
          return;
        }

        // Token ve kullanıcı bilgilerini kaydet
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user._id);

        // Dashboard'a yönlendir
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Giriş yapılırken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Şifre görünürlüğünü toggle et
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        {/* Logo ve Başlık */}
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Baybar Admin</span>
          </div>
          <h1>Admin Panel Girişi</h1>
          <p>Yönetim paneline erişmek için giriş yapın</p>
        </div>

        {/* Giriş Formu */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@baybar.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={loading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Giriş yapılıyor...</span>
              </>
            ) : (
              <>
                <span>Giriş Yap</span>
                <span className="button-icon">→</span>
              </>
            )}
          </button>
        </form>

        {/* Alt Bilgiler */}
        <div className="login-footer">
          <p>
            <Link to="/" className="back-link">
              ← Ana Siteye Dön
            </Link>
          </p>
          <div className="security-info">
            <span className="security-icon">🔐</span>
            <span>Güvenli bağlantı ile korunmaktadır</span>
          </div>
        </div>
      </div>

      {/* Arka Plan Dekorasyon */}
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>
    </div>
  );
};

export default AdminLogin;