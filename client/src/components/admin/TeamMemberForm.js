import React, { useState } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const TeamMemberForm = ({ member = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: member.id || Date.now().toString(),
    name: member.name || '',
    position: member.position || '',
    bio: member.bio || '',
    imageUrl: member.imageUrl || '',
    social: {
      linkedin: member.social?.linkedin || '',
      twitter: member.social?.twitter || '',
      github: member.social?.github || ''
    },
    expertise: member.expertise ? [...member.expertise] : []
  });
  
  const [newExpertise, setNewExpertise] = useState('');
  const [previewImage, setPreviewImage] = useState(member.imageUrl || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
          imageUrl: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addExpertise = (e) => {
    e.preventDefault();
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (index) => {
    const newExpertise = [...formData.expertise];
    newExpertise.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      expertise: newExpertise
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="admin-form-container">
      <h3>{member.id ? 'Üyeyi Düzenle' : 'Yeni Üye Ekle'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Üye Fotoğrafı</label>
          <div className="image-upload-container">
            <div className="image-preview">
              {previewImage ? (
                <img src={previewImage} alt="Önizleme" className="preview-image" />
              ) : (
                <div className="no-image">Resim Seçilmedi</div>
              )}
            </div>
            <label className="upload-btn">
              <FaUpload /> Resim Yükle
              <input 
                type="file" 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Ad Soyad</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="Ad Soyad"
          />
        </div>

        <div className="form-group">
          <label>Pozisyon</label>
          <input 
            type="text" 
            name="position" 
            value={formData.position} 
            onChange={handleChange} 
            required 
            placeholder="Pozisyon"
          />
        </div>

        <div className="form-group">
          <label>Hakkında</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            rows="4" 
            placeholder="Kısa bir açıklama"
          />
        </div>

        <div className="form-group">
          <label>Uzmanlık Alanları</label>
          <div className="expertise-tags">
            {formData.expertise.map((item, index) => (
              <span key={index} className="tag">
                {item}
                <button type="button" onClick={() => removeExpertise(index)} className="remove-tag">
                  <FaTimes size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="add-expertise">
            <input 
              type="text" 
              value={newExpertise} 
              onChange={(e) => setNewExpertise(e.target.value)} 
              placeholder="Uzmanlık alanı ekle"
            />
            <button type="button" onClick={addExpertise} className="btn btn-sm">Ekle</button>
          </div>
        </div>

        <div className="form-group">
          <h4>Sosyal Medya Hesapları</h4>
          <div className="social-inputs">
            <input 
              type="url" 
              name="social.linkedin" 
              value={formData.social.linkedin} 
              onChange={handleChange} 
              placeholder="LinkedIn URL"
            />
            <input 
              type="url" 
              name="social.twitter" 
              value={formData.social.twitter} 
              onChange={handleChange} 
              placeholder="Twitter URL"
            />
            <input 
              type="url" 
              name="social.github" 
              value={formData.social.github} 
              onChange={handleChange} 
              placeholder="GitHub URL"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {member.id ? 'Güncelle' : 'Ekle'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;
