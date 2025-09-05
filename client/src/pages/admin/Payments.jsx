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
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Filter,
  Search,
  Eye,
  Download
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Payments = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Mock payments data
  const [payments, setPayments] = useState([
    {
      id: 1,
      customerName: 'Ahmet Yılmaz',
      customerEmail: 'ahmet@example.com',
      service: 'E-ticaret Danışmanlığı',
      amount: 8000,
      status: 'pending',
      dueDate: '2024-02-15',
      createdAt: '2024-01-15',
      quoteId: 1,
      description: 'E-ticaret sürecimizde bize yardımcı olmanızı istiyoruz.'
    },
    {
      id: 2,
      customerName: 'Fatma Demir',
      customerEmail: 'fatma@example.com',
      service: 'Web Tasarım',
      amount: 15000,
      status: 'paid',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10',
      quoteId: 2,
      description: 'Kurumsal web sitemizin yeniden tasarlanması için teklif istiyoruz.',
      paidAt: '2024-01-18'
    },
    {
      id: 3,
      customerName: 'Mehmet Kaya',
      customerEmail: 'mehmet@example.com',
      service: 'Dijital Pazarlama',
      amount: 12000,
      status: 'overdue',
      dueDate: '2024-01-10',
      createdAt: '2024-01-05',
      quoteId: 3,
      description: 'Sosyal medya yönetimi ve dijital pazarlama stratejileri konusunda danışmanlık hizmeti arıyoruz.'
    },
    {
      id: 4,
      customerName: 'Ayşe Özkan',
      customerEmail: 'ayse@example.com',
      service: 'Mobil Uygulama',
      amount: 25000,
      status: 'pending',
      dueDate: '2024-02-28',
      createdAt: '2024-01-20',
      quoteId: 4,
      description: 'iOS ve Android uygulaması geliştirme projesi.'
    }
  ]);

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      setPayments(payments.map(payment => 
        payment.id === id ? { 
          ...payment, 
          status: newStatus,
          paidAt: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null
        } : payment
      ));
      toast.success(`Ödeme durumu ${newStatus === 'paid' ? 'ödenmiş' : 'bekliyor'} olarak güncellendi`);
    } catch (error) {
      toast.error('Ödeme durumu güncellenirken hata oluştu');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Ödenmiş';
      case 'pending':
        return 'Bekliyor';
      case 'overdue':
        return 'Gecikmiş';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);

  if (!state.user.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Yönlendiriliyor..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Ödemeler - Baybar Admin</title>
        <meta name="description" content="Baybar admin paneli - ödeme yönetimi" />
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
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
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
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
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
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Ödemeler</h2>
                <p className="text-sm text-gray-600">Ödeme işlemlerini yönetin</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="all">Tümü</option>
                    <option value="pending">Bekleyen</option>
                    <option value="paid">Ödenmiş</option>
                    <option value="overdue">Gecikmiş</option>
                  </select>
                </div>
                
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Ödeme ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-8"
                  />
                  <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                    <p className="text-2xl font-bold text-gray-900">₺{totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ödenmiş</p>
                    <p className="text-2xl font-bold text-gray-900">₺{paidAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                    <p className="text-2xl font-bold text-gray-900">₺{pendingAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Gecikmiş</p>
                    <p className="text-2xl font-bold text-gray-900">₺{overdueAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Ödemeler</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Müşteri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hizmet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vade Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                            <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{payment.service}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₺{payment.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1">{getStatusText(payment.status)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.dueDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {payment.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(payment.id, 'paid')}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Ödendi
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPayment(payment)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Payments;
