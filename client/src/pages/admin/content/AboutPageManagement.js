/**
 * Hakkımızda Sayfası İçerik Yönetimi Bileşeni
 * Şirket bilgileri, vizyon, misyon ve ekip üyeleri içeriklerini yönetir
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { get, post, put, uploadFile } from '../../../services/api';
import './ContentPageManagement.scss';
import { FaUsers, FaSave, FaUndo, FaImage, FaPlus, FaEdit, FaTrash, FaHandshake } from 'react-icons/fa';
import TeamMemberForm from '../../../components/admin/TeamMemberForm';
import PartnerForm from '../../../components/admin/PartnerForm';

const AboutPageManagement = () => {
  // State yönetimi
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    hero: {
      title: '',
      subtitle: '',
      imageUrl: ''
    },
    company: {
      title: '',
      description: '',
      foundedYear: '',
      employeeCount: ''
    },
    mission: {
      title: '',
      description: '',
      imageUrl: ''
    },
    vision: {
      title: '',
      description: '',
      imageUrl: ''
    },
    values: {
      title: '',
      subtitle: '',
      items: []
    },
    team: {
      title: '',
      subtitle: '',
      members: []
    },
    partners: []
  });

  // Bileşen yüklendiğinde içerikleri getir
  useEffect(() => {
    fetchAboutContent();
  }, []);

  // Hakkımızda sayfası içeriklerini API'den getir
  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await get('/admin/content/page/about');
      console.log('Hakkımızda API Yanıtı:', response);

      if (response && response.data) {
        setContent(response.data);
        setFormData(response.data);
      } else if (response) {
        setContent(response);
        setFormData(response);
      } else {
        // Varsayılan içerik yapısını kullan
        console.log('Hakkımızda sayfası içeriği bulunamadı, varsayılan yapı kullanılıyor');
      }
    } catch (err) {
      console.error('Hakkımızda sayfası içeriği yükleme hatası:', err);
      setError('İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Takım üyesi ekle/güncelle
  const handleSaveTeamMember = async (memberData) => {
    try {
      setSaving(true);

      // Eğer resim dosyası varsa yükle
      if (memberData.imageFile) {
        const imageUrl = await uploadFile(memberData.imageFile, 'team');
        memberData.imageUrl = imageUrl;
      }

      const updatedMembers = [...formData.team.members];
      const existingIndex = updatedMembers.findIndex(m => m.id === memberData.id);

      if (existingIndex >= 0) {
        updatedMembers[existingIndex] = memberData;
      } else {
        updatedMembers.push(memberData);
      }

      setFormData(prev => ({
        ...prev,
        team: {
          ...prev.team,
          members: updatedMembers
        }
      }));

      setShowTeamForm(false);
      setEditingTeamMember(null);
      setSuccess('Takım üyesi başarıyla kaydedildi.');
    } catch (err) {
      console.error('Takım üyesi kaydedilirken hata:', err);
      setError('Takım üyesi kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // İş ortağı ekle/güncelle
  const handleSavePartner = async (partnerData) => {
    try {
      setSaving(true);

      // Eğer logo dosyası varsa yükle
      if (partnerData.logoFile) {
        const logoUrl = await uploadFile(partnerData.logoFile, 'partners');
        partnerData.logoUrl = logoUrl;
      }

      const updatedPartners = [...formData.partners];
      const existingIndex = updatedPartners.findIndex(p => p.id === partnerData.id);

      if (existingIndex >= 0) {
        updatedPartners[existingIndex] = partnerData;
      } else {
        updatedPartners.push(partnerData);
      }

      setFormData(prev => ({
        ...prev,
        partners: updatedPartners
      }));

      setShowPartnerForm(false);
      setEditingPartner(null);
      setSuccess('İş ortağı başarıyla kaydedildi.');
    } catch (err) {
      console.error('İş ortağı kaydedilirken hata:', err);
      setError('İş ortağı kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Takım üyesi sil
  const deleteTeamMember = (id) => {
    if (window.confirm('Bu üyeyi silmek istediğinize emin misiniz?')) {
      setFormData(prev => ({
        ...prev,
        team: {
          ...prev.team,
          members: prev.team.members.filter(member => member.id !== id)
        }
      }));
      setSuccess('Takım üyesi başarıyla silindi.');
    }
  };

  // İş ortağı sil
  const deletePartner = (id) => {
    if (window.confirm('Bu iş ortağını silmek istediğinize emin misiniz?')) {
      setFormData(prev => ({
        ...prev,
        partners: prev.partners.filter(partner => partner.id !== id)
      }));
      setSuccess('İş ortağı başarıyla silindi.');
    }
  };

  // İçerik kaydet
  const saveContent = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');

      const payload = {
        ...formData,
        pageName: 'about',
        pageTitle: 'Hakkımızda',
        lastUpdated: new Date()
      };

      let response;
      if (content && content._id) {
        response = await put(`/admin/content/${content._id}`, payload);
      } else {
        response = await post('/admin/content', payload);
      }

      // İçerik başarıyla kaydedildi

      setSuccess('Hakkımızda sayfası içeriği başarıyla kaydedildi!');
      setContent(response.content);

      // Başarı mesajını 3 saniye sonra temizle
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('İçerik kaydetme hatası:', err);
      setError('İçerik kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  // Form verilerini güncelle
  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Değer ekle
  const addValue = () => {
    const newValue = { title: '', description: '', icon: '' };

    setFormData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: [...prev.values.items, newValue]
      }
    }));
  };

  // Değer güncelle
  const updateValue = (index, field, value) => {
    const updatedValues = [...formData.values.items];
    updatedValues[index] = {
      ...updatedValues[index],
      [field]: value
    };

    setFormData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: updatedValues
      }
    }));
  };

  // Değer sil
  const removeValue = (index) => {
    const updatedValues = formData.values.items.filter((_, i) => i !== index);

    setFormData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: updatedValues
      }
    }));
  };

  // Ekip üyesi ekle
  const addTeamMember = () => {
    const newMember = { 
      name: '', 
      position: '', 
      bio: '', 
      imageUrl: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        email: ''
      }
    };

    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: [...prev.team.members, newMember]
      }
    }));
  };

  // Ekip üyesi güncelle
  const updateTeamMember = (index, field, value) => {
    const updatedMembers = [...formData.team.members];

    // Eğer sosyal medya alanlarından biriyse
    if (field.includes('.')) {
      const [mainField, subField] = field.split('.');
      updatedMembers[index] = {
        ...updatedMembers[index],
        [mainField]: {
          ...updatedMembers[index][mainField],
          [subField]: value
        }
      };
    } else {
      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value
      };
    }

    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: updatedMembers
      }
    }));
  };

  // Ekip üyesi sil
  const removeTeamMember = (index) => {
    const updatedMembers = formData.team.members.filter((_, i) => i !== index);

    setFormData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: updatedMembers
      }
    }));
  };

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>İçerik yükleniyor...</p>
      </div>
    );
  }

  // Sekme içerikleri
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="tab-content">
            <h3>Genel Bilgiler</h3>
            <div className="form-group">
              <label>Sayfa Başlığı</label>
              <input 
                type="text" 
                name="hero.title" 
                value={formData.hero.title} 
                onChange={(e) => updateFormData('hero', 'title', e.target.value)} 
                placeholder="Sayfa Başlığı"
              />
            </div>
            <div className="form-group">
              <label>Alt Başlık</label>
              <input 
                type="text" 
                name="hero.subtitle" 
                value={formData.hero.subtitle} 
                onChange={(e) => updateFormData('hero', 'subtitle', e.target.value)} 
                placeholder="Sayfa Alt Başlığı"
              />
            </div>
            <div className="form-group">
              <label>Hero Görseli</label>
              <input 
                type="file" 
                onChange={(e) => updateFormData('hero', 'imageUrl', e.target.value)} 
                accept="image/*" 
              />
              {formData.hero.imageUrl && (
                <div className="image-preview">
                  <img src={formData.hero.imageUrl} alt="Hero Önizleme" />
                </div>
              )}
            </div>
          </div>
        );
      
      case 'team':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h3>Ekip Üyeleri</h3>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  setEditingTeamMember(null);
                  setShowTeamForm(true);
                }}
              >
                <FaPlus /> Yeni Ekip Üyesi Ekle
              </button>
            </div>
            
            {showTeamForm ? (
              <div className="form-container">
                <TeamMemberForm 
                  member={editingTeamMember || {}}
                  onSave={handleSaveTeamMember}
                  onCancel={() => {
                    setShowTeamForm(false);
                    setEditingTeamMember(null);
                  }}
                />
              </div>
            ) : (
              <div className="team-grid">
                {formData.team.members.map(member => (
                  <div key={member.id} className="team-card">
                    <div className="team-card-image">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} />
                      ) : (
                        <div className="no-image">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="team-card-content">
                      <h4>{member.name}</h4>
                      <p className="position">{member.position}</p>
                      <div className="expertise">
                        {member.expertise && member.expertise.slice(0, 3).map((exp, i) => (
                          <span key={i} className="expertise-tag">{exp}</span>
                        ))}
                      </div>
                      <div className="actions">
                        <button 
                          className="btn btn-sm btn-edit"
                          onClick={() => {
                            setEditingTeamMember(member);
                            setShowTeamForm(true);
                          }}
                        >
                          <FaEdit /> Düzenle
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteTeamMember(member.id)}
                        >
                          <FaTrash /> Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.team.members.length === 0 && (
                  <div className="no-items">
                    <p>Henüz ekip üyesi eklenmemiş.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      case 'partners':
        return (
          <div className="tab-content">
            <div className="section-header">
              <h3>İş Ortakları</h3>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  setEditingPartner(null);
                  setShowPartnerForm(true);
                }}
              >
                <FaPlus /> Yeni İş Ortağı Ekle
              </button>
            </div>
            
            {showPartnerForm ? (
              <div className="form-container">
                <PartnerForm 
                  partner={editingPartner || {}}
                  onSave={handleSavePartner}
                  onCancel={() => {
                    setShowPartnerForm(false);
                    setEditingPartner(null);
                  }}
                />
              </div>
            ) : (
              <div className="partners-grid">
                {formData.partners && formData.partners.map(partner => (
                  <div key={partner.id} className="partner-card">
                    <div className="partner-logo">
                      {partner.logoUrl ? (
                        <img src={partner.logoUrl} alt={partner.name} />
                      ) : (
                        <div className="no-logo">
                          <FaHandshake size={24} />
                        </div>
                      )}
                    </div>
                    <div className="partner-details">
                      <h4>{partner.name}</h4>
                      <p className="category">{partner.category}</p>
                      <div className="actions">
                        <button 
                          className="btn btn-sm btn-edit"
                          onClick={() => {
                            setEditingPartner(partner);
                            setShowPartnerForm(true);
                          }}
                        >
                          <FaEdit /> Düzenle
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deletePartner(partner.id)}
                        >
                          <FaTrash /> Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!formData.partners || formData.partners.length === 0) && (
                  <div className="no-items">
                    <p>Henüz iş ortağı eklenmemiş.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="content-management">
      <h2>Hakkımızda Sayfası İçerik Yönetimi</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="admin-tabs">
        <div className="tabs-header">
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            Genel Bilgiler
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            Ekip Üyeleri
          </button>
          <button 
            type="button" 
            className={`tab-btn ${activeTab === 'partners' ? 'active' : ''}`}
            onClick={() => setActiveTab('partners')}
          >
            İş Ortakları
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPageManagement;