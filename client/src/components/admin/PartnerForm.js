import React, { useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const PartnerForm = ({ partner = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: partner.id || Date.now().toString(),
    name: partner.name || '',
    category: partner.category || '',
    website: partner.website || '',
    logoUrl: partner.logoUrl || '',
    isActive: partner.isActive !== undefined ? partner.isActive : true
  });
  
  const [previewImage, setPreviewImage] = useState(partner.logoUrl || '');
  const [logoFile, setLogoFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setPreviewImage(imageUrl);
        setFormData(prev => ({
          ...prev,
          logoUrl: imageUrl
        }));
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Eğer yeni bir logo yüklendiyse, dosyayı da form verilerine ekle
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (logoFile) {
      formDataToSend.append('logoFile', logoFile);
    }
    
    onSave(formDataToSend);
  };

  return (
    <div className="admin-form-container">
      <h3>{partner.id ? 'İş Ortağını Düzenle' : 'Yeni İş Ortağı Ekle'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Firma Logosu</label>
          <div className="image-upload-container">
            <div className="image-preview">
              {previewImage ? (
                <img src={previewImage} alt="Logo Önizleme" className="preview-image" />
              ) : (
                <div className="no-image">Logo Seçilmedi</div>
              )}
            </div>
            <label className="upload-btn">
              <FaUpload /> Logo Yükle
              <input 
                type="file" 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
          <p className="help-text">Önerilen boyut: 200x100 piksel, PNG formatında</p>
        </div>

        <div className="form-group">
          <label>Firma Adı <span className="required">*</span></label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Firma Adı"
          />
        </div>

        <div className="form-group">
          <label>Kategori <span className="required">*</span></label>
          <input 
            type="text" 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            required 
            placeholder="Örn: Teknoloji, Danışmanlık, vb."
          />
        </div>

        <div className="form-group">
          <label>Web Sitesi</label>
          <input 
            type="url" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            placeholder="https://ornek.com"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="isActive" 
              checked={formData.isActive} 
              onChange={handleChange} 
            />
            <span className="checkmark"></span>
            Aktif olarak göster
          </label>
          <p className="help-text">İşaretlenmezse bu iş ortağı web sitesinde gösterilmez</p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {partner.id ? 'Güncelle' : 'Ekle'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerForm;
