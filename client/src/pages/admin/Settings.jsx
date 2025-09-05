import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  FileText,
  Users,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  Save,
  Globe,
  Mail as MailIcon,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Settings = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // Site ayarları
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Baybar',
    siteDescription: 'Profesyonel web tasarım ve dijital pazarlama hizmetleri',
    siteUrl: 'https://baybar.com',
    contactEmail: 'info@baybar.com',
    contactPhone: '+90 555 123 45 67',
    contactAddress: 'İstanbul, Türkiye',
    socialMedia: {
      facebook: 'https://facebook.com/baybar',
      twitter: 'https://twitter.com/baybar',
      instagram: 'https://instagram.com/baybar',
      linkedin: 'https://linkedin.com/company/baybar'
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Burada gerçek API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSiteSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSiteSettings(prev => ({
        ...prev,
        [field]: value
      }));
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
        <title>Ayarlar - Baybar Admin</title>
        <meta name="description" content="Baybar admin paneli - ayarlar" />
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
                onClick={() => navigate('/admin/settings')}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
              >
                <SettingsIcon className="w-5 h-5 mr-3" />
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
                <h2 className="text-xl font-semibold text-gray-900">Ayarlar</h2>
                <p className="text-sm text-gray-600">Site ayarlarını yönetin</p>
              </div>
              
              <Button
                variant="primary"
                onClick={handleSave}
                loading={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="space-y-6">
              {/* Genel Ayarlar */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Genel Ayarlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Adı
                    </label>
                    <Input
                      value={siteSettings.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      placeholder="Site adı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL
                    </label>
                    <Input
                      value={siteSettings.siteUrl}
                      onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Açıklaması
                    </label>
                    <textarea
                      value={siteSettings.siteDescription}
                      onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                      placeholder="Site açıklaması"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MailIcon className="w-4 h-4 inline mr-2" />
                      E-posta
                    </label>
                    <Input
                      value={siteSettings.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="info@example.com"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Telefon
                    </label>
                    <Input
                      value={siteSettings.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+90 555 123 45 67"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Adres
                    </label>
                    <Input
                      value={siteSettings.contactAddress}
                      onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                      placeholder="Adres bilgisi"
                    />
                  </div>
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sosyal Medya</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="w-4 h-4 inline mr-2" />
                      Facebook
                    </label>
                    <Input
                      value={siteSettings.socialMedia.facebook}
                      onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Twitter className="w-4 h-4 inline mr-2" />
                      Twitter
                    </label>
                    <Input
                      value={siteSettings.socialMedia.twitter}
                      onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 inline mr-2" />
                      Instagram
                    </label>
                    <Input
                      value={siteSettings.socialMedia.instagram}
                      onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Linkedin className="w-4 h-4 inline mr-2" />
                      LinkedIn
                    </label>
                    <Input
                      value={siteSettings.socialMedia.linkedin}
                      onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/username"
                    />
                  </div>
                </div>
              </div>

              {/* Sistem Bilgileri */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sistem Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Versiyon
                    </label>
                    <p className="text-sm text-gray-600">v1.0.0</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Son Güncelleme
                    </label>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString('tr-TR')}</p>
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

export default Settings;
