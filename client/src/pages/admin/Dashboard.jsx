import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  FileText,
  Users,
  Mail,
  Settings,
  LogOut,
  CreditCard,
  TrendingUp,
  DollarSign,
  UserPlus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuotes: 0,
    totalPartners: 0,
    totalRevenue: 0,
    pendingQuotes: 0,
    approvedQuotes: 0,
    monthlyGrowth: 0,
    conversionRate: 0
  });

  useEffect(() => {
    // Simulate loading data
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in real app, this would come from API
        setStats({
          totalUsers: 156,
          totalQuotes: 23,
          totalPartners: 8,
          totalRevenue: 125000,
          pendingQuotes: 5,
          approvedQuotes: 18,
          monthlyGrowth: 25,
          conversionRate: 78
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'İçerik Yönetimi',
      description: 'Sayfa içeriklerini düzenle',
      icon: FileText,
      color: 'blue',
      onClick: () => navigate('/admin/content')
    },
    {
      title: 'İş Ortakları',
      description: 'Firma logolarını yönet',
      icon: Users,
      color: 'green',
      onClick: () => navigate('/admin/partners')
    },
    {
      title: 'Teklifler',
      description: 'Müşteri tekliflerini görüntüle',
      icon: Mail,
      color: 'purple',
      onClick: () => navigate('/admin/quotes')
    },
    {
      title: 'Kullanıcılar',
      description: 'Kullanıcı hesaplarını yönet',
      icon: Users,
      color: 'indigo',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Ödemeler',
      description: 'Ödeme işlemlerini takip et',
      icon: CreditCard,
      color: 'yellow',
      onClick: () => navigate('/admin/payments')
    },
    {
      title: 'Ayarlar',
      description: 'Site ayarlarını düzenle',
      icon: Settings,
      color: 'gray',
      onClick: () => navigate('/admin/settings')
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'quote',
      title: 'Yeni teklif alındı',
      description: 'Ahmet Yılmaz - E-ticaret Danışmanlığı',
      time: '2 saat önce',
      status: 'pending'
    },
    {
      id: 2,
      type: 'user',
      title: 'Yeni kullanıcı kaydı',
      description: 'Fatma Demir sisteme katıldı',
      time: '4 saat önce',
      status: 'success'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Ödeme tamamlandı',
      description: 'Mehmet Kaya - ₺8,000',
      time: '6 saat önce',
      status: 'success'
    },
    {
      id: 4,
      type: 'content',
      title: 'İçerik güncellendi',
      description: 'Ana sayfa hero bölümü düzenlendi',
      time: '1 gün önce',
      status: 'info'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'info':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!state.user.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Yönlendiriliyor..." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Dashboard yükleniyor..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Baybar Admin</title>
        <meta name="description" content="Baybar admin paneli - dashboard" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg relative">
          <div className="p-6 border-b border-gray-200">
            <img 
              src="/logo.svg" 
              alt="Baybar Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-lg font-bold text-gray-900 mt-2">Admin Panel</h1>
          </div>
          
          <nav className="mt-6">
            <div className="px-3 space-y-1">
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => navigate('/admin/content')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FileText className="w-5 h-5 mr-3" />
                İçerik Yönetimi
              </button>
              <button
                onClick={() => navigate('/admin/partners')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Users className="w-5 h-5 mr-3" />
                İş Ortakları
              </button>
              <button
                onClick={() => navigate('/admin/quotes')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Mail className="w-5 h-5 mr-3" />
                Teklifler
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Users className="w-5 h-5 mr-3" />
                Yöneticiler
              </button>
              <button
                onClick={() => navigate('/admin/payments')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Ödemeler
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                Ayarlar
              </button>
            </div>
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{state.user.user?.username}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <Button
                onClick={() => navigate('/admin')}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
              <p className="text-sm text-gray-600">Genel bakış ve istatistikler</p>
            </div>
          </header>

          <main className="flex-1 p-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Toplam Kullanıcı
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Toplam Teklif
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalQuotes}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Toplam Gelir
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          ₺{stats.totalRevenue.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Aylık Büyüme
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          +{stats.monthlyGrowth}%
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                            <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                            <p className="text-sm text-gray-500">{action.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Son Aktiviteler</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Kullanıcı Artışı</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</div>
                    <div className="text-sm text-gray-500">Bu ay</div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Gelir Analizi</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">₺{stats.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Toplam gelir</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;