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
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  Phone,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ContentManagement = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [selectedPage, setSelectedPage] = useState('home');
  const [selectedSection, setSelectedSection] = useState(null);

  // Page configurations
  const pages = [
    { 
      id: 'home', 
      name: 'Ana Sayfa', 
      icon: Home,
      sections: [
        { id: 'hero', name: 'Hero Bölümü', type: 'hero' },
        { id: 'services', name: 'Hizmetler', type: 'services' },
        { id: 'testimonials', name: 'Müşteri Yorumları', type: 'testimonials' },
        { id: 'partners', name: 'Çalıştığımız Firmalar', type: 'partners' },
        { id: 'cta', name: 'İletişim Çağrısı', type: 'cta' }
      ]
    },
    { 
      id: 'about', 
      name: 'Hakkımızda', 
      icon: User,
      sections: [
        { id: 'hero', name: 'Hero Bölümü', type: 'hero' },
        { id: 'mission', name: 'Misyon & Vizyon', type: 'mission' },
        { id: 'values', name: 'Değerlerimiz', type: 'values' },
        { id: 'journey', name: 'Yolculuğumuz', type: 'journey' },
        { id: 'partners', name: 'İş Ortakları', type: 'partners' }
      ]
    },
    { 
      id: 'services', 
      name: 'Hizmetlerimiz', 
      icon: Briefcase,
      sections: [
        { id: 'hero', name: 'Hero Bölümü', type: 'hero' },
        { id: 'services', name: 'Hizmet Kartları', type: 'services' },
        { id: 'why-us', name: 'Neden Baybar?', type: 'why-us' },
        { id: 'process', name: 'Çalışma Sürecimiz', type: 'process' }
      ]
    },
    { 
      id: 'contact', 
      name: 'İletişim', 
      icon: Phone,
      sections: [
        { id: 'hero', name: 'Hero Bölümü', type: 'hero' },
        { id: 'contact-info', name: 'İletişim Bilgileri', type: 'contact-info' },
        { id: 'map', name: 'Harita', type: 'map' },
        { id: 'form', name: 'İletişim Formu', type: 'form' }
      ]
    }
  ];

  // Mock content data
  const [contentData, setContentData] = useState({
    home: {
      hero: {
        title: 'Baybar ile Dijital Dünyada Öne Çıkın',
        subtitle: 'Profesyonel web tasarım ve dijital pazarlama hizmetleri ile işinizi büyütün',
        buttonText: 'Hemen Başlayın',
        backgroundImage: '/images/hero-bg.jpg'
      },
      services: {
        title: 'Hizmetlerimiz',
        subtitle: 'Size en uygun çözümleri sunuyoruz',
        items: [
          { title: 'Web Tasarım', description: 'Modern ve responsive web siteleri', icon: '🌐' },
          { title: 'E-ticaret', description: 'Güçlü e-ticaret platformları', icon: '🛒' },
          { title: 'Dijital Pazarlama', description: 'Sosyal medya ve SEO hizmetleri', icon: '📈' },
          { title: 'Mobil Uygulama', description: 'iOS ve Android uygulamaları', icon: '📱' }
        ]
      }
    },
    about: {
      hero: {
        title: 'Hakkımızda',
        subtitle: 'Dijital dünyada başarılı projeler üretiyoruz',
        backgroundImage: '/images/about-hero.jpg'
      },
      mission: {
        title: 'Misyonumuz',
        content: 'Müşterilerimizin dijital dünyada başarılı olmalarını sağlamak için en kaliteli hizmetleri sunmak.',
        vision: 'Türkiye\'nin en güvenilir dijital ajansı olmak.'
      }
    },
    services: {
      hero: {
        title: 'Hizmetlerimiz',
        subtitle: 'Size özel çözümler üretiyoruz',
        backgroundImage: '/images/services-hero.jpg'
      }
    },
    contact: {
      hero: {
        title: 'İletişim',
        subtitle: 'Projeleriniz için bizimle iletişime geçin',
        backgroundImage: '/images/contact-hero.jpg'
      },
      contactInfo: {
        phone: '+90 555 123 45 67',
        email: 'info@baybar.com',
        address: 'İstanbul, Türkiye',
        workingHours: 'Pazartesi - Cuma: 09:00 - 18:00'
      }
    }
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Burada gerçek API çağrısı yapılacak
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('İçerik başarıyla kaydedildi!');
      setIsEditing(false);
    } catch (error) {
      toast.error('İçerik kaydedilirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (pageId, sectionId, field, value) => {
    setContentData(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [sectionId]: {
          ...prev[pageId][sectionId],
          [field]: value
        }
      }
    }));
  };

  const addSectionItem = (pageId, sectionId) => {
    const newItem = {
      title: 'Yeni Öğe',
      description: 'Açıklama',
      icon: '⭐'
    };
    
    setContentData(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [sectionId]: {
          ...prev[pageId][sectionId],
          items: [...(prev[pageId][sectionId].items || []), newItem]
        }
      }
    }));
  };

  const removeSectionItem = (pageId, sectionId, index) => {
    setContentData(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [sectionId]: {
          ...prev[pageId][sectionId],
          items: prev[pageId][sectionId].items.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const renderSectionContent = (pageId, sectionId) => {
    const section = contentData[pageId]?.[sectionId];
    if (!section) return null;

    switch (sectionId) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <Input
                value={section.title || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'title', e.target.value)}
                placeholder="Başlık"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
              <Input
                value={section.subtitle || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'subtitle', e.target.value)}
                placeholder="Alt başlık"
              />
            </div>
            {section.buttonText && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buton Metni</label>
                <Input
                  value={section.buttonText || ''}
                  onChange={(e) => updateContent(pageId, sectionId, 'buttonText', e.target.value)}
                  placeholder="Buton metni"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arka Plan Resmi</label>
              <Input
                value={section.backgroundImage || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'backgroundImage', e.target.value)}
                placeholder="Resim URL'si"
              />
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <Input
                value={section.title || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'title', e.target.value)}
                placeholder="Başlık"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
              <Input
                value={section.subtitle || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'subtitle', e.target.value)}
                placeholder="Alt başlık"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hizmetler</label>
              <div className="space-y-3">
                {(section.items || []).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                    <Input
                      value={item.icon || ''}
                      onChange={(e) => {
                        const newItems = [...(section.items || [])];
                        newItems[index] = { ...newItems[index], icon: e.target.value };
                        updateContent(pageId, sectionId, 'items', newItems);
                      }}
                      placeholder="İkon"
                      className="w-16"
                    />
                    <Input
                      value={item.title || ''}
                      onChange={(e) => {
                        const newItems = [...(section.items || [])];
                        newItems[index] = { ...newItems[index], title: e.target.value };
                        updateContent(pageId, sectionId, 'items', newItems);
                      }}
                      placeholder="Başlık"
                      className="flex-1"
                    />
                    <Input
                      value={item.description || ''}
                      onChange={(e) => {
                        const newItems = [...(section.items || [])];
                        newItems[index] = { ...newItems[index], description: e.target.value };
                        updateContent(pageId, sectionId, 'items', newItems);
                      }}
                      placeholder="Açıklama"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSectionItem(pageId, sectionId, index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSectionItem(pageId, sectionId)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Hizmet Ekle
                </Button>
              </div>
            </div>
          </div>
        );

      case 'mission':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
              <Input
                value={section.title || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'title', e.target.value)}
                placeholder="Başlık"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Misyon</label>
              <Textarea
                value={section.content || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'content', e.target.value)}
                placeholder="Misyon metni"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vizyon</label>
              <Textarea
                value={section.vision || ''}
                onChange={(e) => updateContent(pageId, sectionId, 'vision', e.target.value)}
                placeholder="Vizyon metni"
                rows={3}
              />
            </div>
          </div>
        );

      case 'contactInfo':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <Input
                  value={section.phone || ''}
                  onChange={(e) => updateContent(pageId, sectionId, 'phone', e.target.value)}
                  placeholder="Telefon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <Input
                  value={section.email || ''}
                  onChange={(e) => updateContent(pageId, sectionId, 'email', e.target.value)}
                  placeholder="E-posta"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <Input
                  value={section.address || ''}
                  onChange={(e) => updateContent(pageId, sectionId, 'address', e.target.value)}
                  placeholder="Adres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Saatleri</label>
                <Input
                  value={section.workingHours || ''}
                  onChange={(e) => updateContent(pageId, sectionId, 'workingHours', e.target.value)}
                  placeholder="Çalışma saatleri"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Bu bölüm için düzenleme arayüzü henüz hazırlanmadı.</p>
          </div>
        );
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
        <title>İçerik Yönetimi - Baybar Admin</title>
        <meta name="description" content="Baybar admin paneli - içerik yönetimi" />
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
              
              {/* Content Management Dropdown */}
              <div>
                <button
                  onClick={() => setExpandedMenu(expandedMenu === 'content' ? null : 'content')}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-3" />
                    İçerik Yönetimi
                  </div>
                  {expandedMenu === 'content' ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {expandedMenu === 'content' && (
                  <div className="ml-6 mt-1 space-y-1">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setSelectedPage(page.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          selectedPage === page.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <page.icon className="w-4 h-4 mr-3" />
                        {page.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
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
                <h2 className="text-xl font-semibold text-gray-900">İçerik Yönetimi</h2>
                <p className="text-sm text-gray-600">
                  {pages.find(p => p.id === selectedPage)?.name} sayfası içeriklerini düzenleyin
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      İptal
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      loading={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Düzenle
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Page Sections */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {pages.find(p => p.id === selectedPage)?.name} Bölümleri
                  </h3>
                  <div className="space-y-2">
                    {pages.find(p => p.id === selectedPage)?.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setSelectedSection(section.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          selectedSection === section.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-3">{section.type === 'hero' ? '🏠' : section.type === 'services' ? '⚙️' : '📄'}</span>
                        {section.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="lg:col-span-3">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedSection ? 
                        pages.find(p => p.id === selectedPage)?.sections.find(s => s.id === selectedSection)?.name :
                        'Bölüm Seçin'
                      }
                    </h3>
                  </div>

                  <div className="p-6">
                    {selectedSection ? (
                      renderSectionContent(selectedPage, selectedSection)
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Düzenlemek istediğiniz bölümü seçin</p>
                      </div>
                    )}
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

export default ContentManagement;