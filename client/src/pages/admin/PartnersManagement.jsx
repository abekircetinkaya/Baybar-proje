import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  Users,
  Upload,
  Image as ImageIcon,
  BarChart3,
  FileText,
  Mail,
  Settings,
  LogOut
} from 'lucide-react';
import Heading from '../../components/common/Heading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const PartnersManagement = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock partners data
  const [partners, setPartners] = useState([
    {
      id: 1,
      name: 'Microsoft',
      logo: 'https://via.placeholder.com/150x80/0078D4/FFFFFF?text=Microsoft',
      website: 'https://microsoft.com',
      description: 'Teknoloji devi Microsoft',
      order: 1
    },
    {
      id: 2,
      name: 'Google',
      logo: 'https://via.placeholder.com/150x80/4285F4/FFFFFF?text=Google',
      website: 'https://google.com',
      description: 'Arama motoru ve teknoloji şirketi',
      order: 2
    },
    {
      id: 3,
      name: 'Amazon',
      logo: 'https://via.placeholder.com/150x80/FF9900/FFFFFF?text=Amazon',
      website: 'https://amazon.com',
      description: 'E-ticaret ve bulut hizmetleri',
      order: 3
    },
    {
      id: 4,
      name: 'Apple',
      logo: 'https://via.placeholder.com/150x80/000000/FFFFFF?text=Apple',
      website: 'https://apple.com',
      description: 'Teknoloji ve elektronik ürünler',
      order: 4
    }
  ]);

  useEffect(() => {
    if (!state.user.isAuthenticated) {
      navigate('/admin/login');
      return;
    }
  }, [state.user.isAuthenticated, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('İş ortakları başarıyla güncellendi!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Güncelleme başarısız');
    } finally {
      setIsSaving(false);
    }
  };

  const addPartner = () => {
    const newPartner = {
      id: Date.now(),
      name: 'Yeni Ortak',
      logo: '',
      website: '',
      description: '',
      order: partners.length + 1
    };
    setPartners([...partners, newPartner]);
  };

  const updatePartner = (id, field, value) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, [field]: value } : partner
    ));
  };

  const removePartner = (id) => {
    setPartners(partners.filter(partner => partner.id !== id));
  };

  const movePartner = (id, direction) => {
    const index = partners.findIndex(p => p.id === id);
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < partners.length) {
      const newPartners = [...partners];
      [newPartners[index], newPartners[newIndex]] = [newPartners[newIndex], newPartners[index]];
      
      // Update order
      newPartners.forEach((partner, i) => {
        partner.order = i + 1;
      });
      
      setPartners(newPartners);
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
        <title>İş Ortakları Yönetimi - Baybar Admin</title>
        <meta name="description" content="Baybar admin paneli - iş ortakları yönetimi" />
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
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md"
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
                <h2 className="text-xl font-semibold text-gray-900">İş Ortakları Yönetimi</h2>
                <p className="text-sm text-gray-600">Firma logolarını ve bilgilerini yönetin</p>
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  İş Ortakları Listesi
                </h3>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addPartner}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ortak Ekle
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {partners.map((partner, index) => (
                  <div key={partner.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {partner.logo ? (
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-contain rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center text-gray-400 ${partner.logo ? 'hidden' : 'flex'}`}>
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {isEditing ? (
                              <Input
                                value={partner.name}
                                onChange={(e) => updatePartner(partner.id, 'name', e.target.value)}
                                className="text-lg font-medium"
                              />
                            ) : (
                              partner.name
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Sıra: {partner.order}
                          </p>
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => movePartner(partner.id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => movePartner(partner.id, 'down')}
                            disabled={index === partners.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePartner(partner.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo URL
                        </label>
                        {isEditing ? (
                          <Input
                            value={partner.logo}
                            onChange={(e) => updatePartner(partner.id, 'logo', e.target.value)}
                            placeholder="https://example.com/logo.png"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">{partner.logo || 'Logo yok'}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        {isEditing ? (
                          <Input
                            value={partner.website}
                            onChange={(e) => updatePartner(partner.id, 'website', e.target.value)}
                            placeholder="https://example.com"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">
                            {partner.website ? (
                              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                {partner.website}
                              </a>
                            ) : (
                              'Website yok'
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                      </label>
                      {isEditing ? (
                        <Input
                          value={partner.description}
                          onChange={(e) => updatePartner(partner.id, 'description', e.target.value)}
                          placeholder="Ortak açıklaması..."
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{partner.description || 'Açıklama yok'}</p>
                      )}
                    </div>
                  </div>
                ))}

                {partners.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Henüz iş ortağı eklenmemiş.</p>
                    {isEditing && (
                      <Button
                        variant="primary"
                        onClick={addPartner}
                        className="mt-4"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        İlk Ortağı Ekle
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default PartnersManagement;