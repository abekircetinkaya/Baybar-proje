/**
 * Admin Dashboard Sayfası
 * Grafikler ve istatistikler ile genel site verilerini gösterir
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import './AdminDashboard.scss';

// Chart kütüphanesi için recharts kullanacağız
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  // State yönetimi
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalOffers: 0,
      totalProjects: 0,
      totalRevenue: 0
    },
    charts: {
      userGrowth: [],
      offerStatus: [],
      monthlyRevenue: [],
      projectTypes: []
    },
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y

  // Renk paleti
  const COLORS = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6'
  };

  const PIE_COLORS = [COLORS.primary, COLORS.success, COLORS.warning, COLORS.danger];

  // Dashboard verilerini yükle
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/dashboard/stats?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Dashboard verileri yüklenemedi');
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard yükleme hatası:', err);
      setError(err.message);
      // Demo veriler (API hazır olmadığında)
      setDashboardData(getDemoData());
    } finally {
      setLoading(false);
    }
  };

  // Demo veriler (geliştirme aşamasında)
  const getDemoData = () => {
    return {
      stats: {
        totalUsers: 1247,
        totalOffers: 89,
        totalProjects: 156,
        totalRevenue: 245000
      },
      charts: {
        userGrowth: [
          { name: 'Oca', users: 400, newUsers: 240 },
          { name: 'Şub', users: 300, newUsers: 139 },
          { name: 'Mar', users: 200, newUsers: 980 },
          { name: 'Nis', users: 278, newUsers: 390 },
          { name: 'May', users: 189, newUsers: 480 },
          { name: 'Haz', users: 239, newUsers: 380 },
          { name: 'Tem', users: 349, newUsers: 430 }
        ],
        offerStatus: [
          { name: 'Beklemede', value: 35, color: COLORS.warning },
          { name: 'Onaylandı', value: 28, color: COLORS.success },
          { name: 'Reddedildi', value: 15, color: COLORS.danger },
          { name: 'İnceleniyor', value: 11, color: COLORS.info }
        ],
        monthlyRevenue: [
          { name: 'Oca', revenue: 45000, target: 50000 },
          { name: 'Şub', revenue: 52000, target: 50000 },
          { name: 'Mar', revenue: 48000, target: 55000 },
          { name: 'Nis', revenue: 61000, target: 55000 },
          { name: 'May', revenue: 55000, target: 60000 },
          { name: 'Haz', revenue: 67000, target: 60000 }
        ],
        projectTypes: [
          { name: 'E-ticaret', count: 45 },
          { name: 'Kurumsal', count: 32 },
          { name: 'Blog', count: 28 },
          { name: 'Portfolio', count: 21 },
          { name: 'Diğer', count: 15 }
        ]
      },
      recentActivities: [
        {
          id: 1,
          type: 'user',
          message: 'Yeni kullanıcı kaydı: john.doe@example.com',
          time: '5 dakika önce',
          icon: '👤'
        },
        {
          id: 2,
          type: 'offer',
          message: 'Yeni teklif alındı: E-ticaret Projesi',
          time: '15 dakika önce',
          icon: '📋'
        },
        {
          id: 3,
          type: 'project',
          message: 'Proje tamamlandı: ABC Şirketi Web Sitesi',
          time: '1 saat önce',
          icon: '✅'
        },
        {
          id: 4,
          type: 'revenue',
          message: 'Yeni ödeme alındı: ₺15,000',
          time: '2 saat önce',
          icon: '💰'
        }
      ]
    };
  };

  // Sayı formatlama
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Para formatlama
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  // Yükleme durumu
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 Dashboard</h1>
          <p>Genel site istatistikleri ve performans verileri</p>
        </div>
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 3 Ay</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          <button 
            onClick={fetchDashboardData} 
            className="refresh-btn"
            disabled={loading}
          >
            🔄 Yenile
          </button>
        </div>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-alert">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {/* İstatistik Kartları */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3>Toplam Kullanıcı</h3>
            <p className="stat-number">{formatNumber(dashboardData.stats.totalUsers)}</p>
            <span className="stat-change positive">+12% bu ay</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon offers">📋</div>
          <div className="stat-content">
            <h3>Toplam Teklif</h3>
            <p className="stat-number">{formatNumber(dashboardData.stats.totalOffers)}</p>
            <span className="stat-change positive">+8% bu ay</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon projects">🚀</div>
          <div className="stat-content">
            <h3>Toplam Proje</h3>
            <p className="stat-number">{formatNumber(dashboardData.stats.totalProjects)}</p>
            <span className="stat-change positive">+15% bu ay</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-content">
            <h3>Toplam Gelir</h3>
            <p className="stat-number">{formatCurrency(dashboardData.stats.totalRevenue)}</p>
            <span className="stat-change positive">+22% bu ay</span>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="charts-grid">
        {/* Kullanıcı Büyümesi */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Kullanıcı Büyümesi</h3>
            <p>Aylık kullanıcı artışı</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.charts.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke={COLORS.primary} 
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Teklif Durumları */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>📊 Teklif Durumları</h3>
            <p>Mevcut tekliflerin dağılımı</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.charts.offerStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dashboardData.charts.offerStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aylık Gelir */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>💹 Aylık Gelir Analizi</h3>
            <p>Gerçekleşen vs Hedeflenen gelir</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dashboardData.charts.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={formatCurrency} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill={COLORS.primary} name="Gerçekleşen" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill={COLORS.secondary} name="Hedef" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proje Türleri */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🎯 Proje Türleri</h3>
            <p>Proje kategorilerine göre dağılım</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.charts.projectTypes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" stroke="#666" width={80} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill={COLORS.success} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🔔 Son Aktiviteler</h3>
            <p>Sistem üzerindeki son hareketler</p>
          </div>
          <div className="activities-list">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="activities-footer">
            <button className="view-all-btn">Tümünü Görüntüle →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;