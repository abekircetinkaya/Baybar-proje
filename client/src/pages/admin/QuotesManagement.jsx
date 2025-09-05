import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  Calendar,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Filter,
  BarChart3,
  FileText,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const QuotesManagement = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock quotes data
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 45 67',
      company: 'ABC Şirketi',
      service: 'E-ticaret Danışmanlığı',
      description: 'E-ticaret sürecimizde bize yardımcı olmanızı istiyoruz. Pazar analizi ve strateji geliştirme konularında destek bekliyoruz.',
      budget: '₺5.000 - ₺10.000',
      timeline: '3-6 ay',
      status: 'pending',
      createdAt: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Fatma Demir',
      email: 'fatma@example.com',
      phone: '+90 555 987 65 43',
      company: 'XYZ Ltd.',
      service: 'Web Tasarım',
      description: 'Kurumsal web sitemizin yeniden tasarlanması için teklif istiyoruz. Modern ve kullanıcı dostu bir tasarım bekliyoruz.',
      budget: '₺15.000 - ₺25.000',
      timeline: '2-4 ay',
      status: 'approved',
      createdAt: '2024-01-10',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 555 456 78 90',
      company: 'DEF A.Ş.',
      service: 'Dijital Pazarlama',
      description: 'Sosyal medya yönetimi ve dijital pazarlama stratejileri konusunda danışmanlık hizmeti arıyoruz.',
      budget: '₺8.000 - ₺12.000',
      timeline: '6-12 ay',
      status: 'rejected',
      createdAt: '2024-01-05',
      priority: 'low'
    }
  ]);

  const [selectedQuote, setSelectedQuote] = useState(null);

  const filteredQuotes = quotes.filter(quote => {
    const matchesFilter = filter === 'all' || quote.status === filter;
    const matchesSearch = quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    setQuotes(quotes.map(quote => 
      quote.id === id ? { ...quote, status: newStatus } : quote
    ));
    toast.success(`Teklif ${newStatus === 'approved' ? 'onaylandı' : 'reddedildi'}`);
  };

  const handleDeleteQuote = (id) => {
    if (window.confirm('Bu teklifi silmek istediğinizden emin misiniz?')) {
      setQuotes(quotes.filter(quote => quote.id !== id));
      toast.success('Teklif silindi');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      case 'pending':
        return 'Bekliyor';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

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
        <title>Teklif Yönetimi - Baybar Admin</title>
        <meta name="description" content="Baybar admin paneli - teklif yönetimi" />
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
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
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
                <h2 className="text-xl font-semibold text-gray-900">Teklif Yönetimi</h2>
                <p className="text-sm text-gray-600">Müşteri tekliflerini yönetin</p>
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
                    <option value="approved">Onaylanan</option>
                    <option value="rejected">Reddedilen</option>
                  </select>
                </div>
                
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Teklif ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-8"
                  />
                  <User className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Toplam Teklif</p>
                    <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      {quotes.filter(q => q.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Onaylanan</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {quotes.filter(q => q.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reddedilen</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {quotes.filter(q => q.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotes List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Teklifler</h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{quote.name}</h4>
                            <p className="text-sm text-gray-600">{quote.company}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                              {getStatusIcon(quote.status)}
                              <span className="ml-1">{getStatusText(quote.status)}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {quote.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {quote.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-900">{quote.service}</p>
                          <p className="text-sm text-gray-600 mt-1">{quote.description}</p>
                        </div>
                        
                        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                          <span>Bütçe: {quote.budget}</span>
                          <span>Süre: {quote.timeline}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {quote.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(quote.id, 'approved')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Onayla
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(quote.id, 'rejected')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reddet
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default QuotesManagement;
