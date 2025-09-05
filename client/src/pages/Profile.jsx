import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../contexts/AppContext';
import { User, FileText, CreditCard, Settings, Lock, Edit, Save, X } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load quotes when component mounts
  useEffect(() => {
    if (state.user.isAuthenticated && activeTab === 'quotes') {
      loadQuotes();
    }
  }, [activeTab, state.user.isAuthenticated]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const result = await actions.getMyQuotes();
      if (result.success) {
        setQuotes(result.data);
      }
    } catch (error) {
      console.error('Error loading quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditData({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      company: userProfile.company
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Burada gerçek API çağrısı yapılacak
      toast.success('Profil bilgileri güncellendi!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Profil güncellenirken hata oluştu');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı');
      return;
    }
    
    try {
      // Burada gerçek API çağrısı yapılacak
      toast.success('Şifre başarıyla değiştirildi!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Şifre değiştirilirken hata oluştu');
    }
  };

  const userProfile = state.user.isAuthenticated && state.user.user ? {
    name: state.user.user.name || 'Kullanıcı',
    email: state.user.user.email || '',
    phone: state.user.user.phone || '',
    company: state.user.user.company || '',
    username: state.user.user.username || '',
    joinDate: state.user.user.createdAt || new Date().toISOString()
  } : {};

  // Mock payments - gerçek uygulamada ayrı API olacak
  const [payments] = useState([
    {
      id: 1,
      quoteId: 2,
      service: 'Dijital Pazarlama',
      amount: '₺8.000',
      status: 'pending',
      dueDate: '2024-02-15'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'paid': return 'Ödendi';
      default: return status;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'quotes', label: 'Tekliflerim', icon: FileText },
    { id: 'payments', label: 'Bekleyen Ödemeler', icon: CreditCard }
  ];

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditProfile}
            >
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            {isEditing ? (
              <Input
                value={editData.name || ''}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                placeholder="Ad Soyad"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userProfile.name || 'Belirtilmemiş'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            {isEditing ? (
              <Input
                value={editData.email || ''}
                onChange={(e) => setEditData({...editData, email: e.target.value})}
                placeholder="E-posta"
                type="email"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userProfile.email || 'Belirtilmemiş'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kullanıcı Adı</label>
            <p className="mt-1 text-gray-900">{userProfile.username || 'Belirtilmemiş'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            {isEditing ? (
              <Input
                value={editData.phone || ''}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                placeholder="Telefon"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userProfile.phone || 'Belirtilmemiş'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şirket</label>
            {isEditing ? (
              <Input
                value={editData.company || ''}
                onChange={(e) => setEditData({...editData, company: e.target.value})}
                placeholder="Şirket"
                className="mt-1"
              />
            ) : (
              <p className="mt-1 text-gray-900">{userProfile.company || 'Belirtilmemiş'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Üyelik Tarihi</label>
            <p className="mt-1 text-gray-900">{new Date(userProfile.joinDate).toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
        
        {isEditing && (
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <X className="w-4 h-4 mr-2" />
              İptal
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
            >
              <Save className="w-4 h-4 mr-2" />
              Kaydet
            </Button>
          </div>
        )}
      </div>

      {/* Şifre Değiştirme */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Güvenlik</h3>
          {!isChangingPassword && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Şifre Değiştir
            </Button>
          )}
        </div>
        
        {isChangingPassword ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                placeholder="Mevcut şifrenizi girin"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Yeni şifrenizi girin"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Yeni Şifre Tekrar</label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="Yeni şifrenizi tekrar girin"
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
              >
                <X className="w-4 h-4 mr-2" />
                İptal
              </Button>
              <Button
                variant="primary"
                onClick={handleChangePassword}
              >
                <Save className="w-4 h-4 mr-2" />
                Şifre Değiştir
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Hesabınızın güvenliği için düzenli olarak şifrenizi değiştirin.</p>
        )}
      </div>
    </div>
  );

  const renderQuotes = () => (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Teklifler yükleniyor...</p>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Henüz teklifiniz bulunmuyor.</p>
        </div>
      ) : (
        quotes.map((quote) => (
          <div key={quote._id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{quote.serviceTitle}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Tarih: {new Date(quote.createdAt).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">{quote.amount}</p>
                <p className="text-sm text-gray-500 mt-1">{quote.projectDescription}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                {getStatusText(quote.status)}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{payment.service}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Vade: {new Date(payment.dueDate).toLocaleDateString('tr-TR')}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">{payment.amount}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                {getStatusText(payment.status)}
              </span>
              {payment.status === 'pending' && (
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Ödeme Yap
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Profil | Baybar</title>
        <meta name="description" content="Baybar hesabınızı yönetin, tekliflerinizi görüntüleyin ve ödemelerinizi takip edin." />
      </Helmet>

      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
            <p className="text-gray-600 mt-2">Hesabınızı yönetin ve tekliflerinizi takip edin</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'profile' && renderProfile()}
              {activeTab === 'quotes' && renderQuotes()}
              {activeTab === 'payments' && renderPayments()}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
