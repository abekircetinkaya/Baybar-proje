/**
 * Admin Kullanıcı Yönetimi Sayfası
 * Kullanıcıları listeleme, ekleme, düzenleme ve silme işlemleri
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import './AdminUsersManagement.scss';

const AdminUsersManagement = () => {
  // State yönetimi
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // list, add, edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    permissions: []
  });

  // Demo kullanıcı verileri
  const demoUsers = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@baybar.com',
      role: 'admin',
      status: 'active',
      phone: '+90 532 123 4567',
      department: 'IT',
      lastLogin: '2024-01-15 14:30',
      createdAt: '2023-06-15',
      permissions: ['users.read', 'users.write', 'content.read', 'content.write']
    },
    {
      id: 2,
      name: 'Fatma Demir',
      email: 'fatma@baybar.com',
      role: 'editor',
      status: 'active',
      phone: '+90 533 987 6543',
      department: 'Content',
      lastLogin: '2024-01-15 09:15',
      createdAt: '2023-08-20',
      permissions: ['content.read', 'content.write']
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@baybar.com',
      role: 'user',
      status: 'inactive',
      phone: '+90 534 456 7890',
      department: 'Sales',
      lastLogin: '2024-01-10 16:45',
      createdAt: '2023-09-10',
      permissions: ['content.read']
    },
    {
      id: 4,
      name: 'Ayşe Özkan',
      email: 'ayse@baybar.com',
      role: 'moderator',
      status: 'active',
      phone: '+90 535 321 0987',
      department: 'Support',
      lastLogin: '2024-01-14 11:20',
      createdAt: '2023-10-05',
      permissions: ['content.read', 'offers.read', 'offers.write']
    },
    {
      id: 5,
      name: 'Can Arslan',
      email: 'can@baybar.com',
      role: 'user',
      status: 'pending',
      phone: '+90 536 654 3210',
      department: 'Marketing',
      lastLogin: 'Hiç giriş yapmadı',
      createdAt: '2024-01-12',
      permissions: []
    }
  ];

  // Kullanıcıları yükle
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(demoUsers);
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrelenmiş kullanıcılar
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Form işlemleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      status: 'active',
      password: '',
      confirmPassword: '',
      phone: '',
      department: '',
      permissions: []
    });
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Şifreler eşleşmiyor.');
        return;
      }

      setLoading(true);
      
      if (selectedUser) {
        // Güncelleme işlemi
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...formData, id: selectedUser.id }
            : user
        );
        setUsers(updatedUsers);
        setSuccess('Kullanıcı başarıyla güncellendi.');
      } else {
        // Yeni kullanıcı ekleme
        const newUser = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: 'Hiç giriş yapmadı'
        };
        setUsers(prev => [...prev, newUser]);
        setSuccess('Kullanıcı başarıyla eklendi.');
      }
      
      resetForm();
      setActiveTab('list');
    } catch (err) {
      setError('İşlem sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
      confirmPassword: '',
      phone: user.phone,
      department: user.department,
      permissions: user.permissions
    });
    setActiveTab('edit');
  };

  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSuccess('Kullanıcı başarıyla silindi.');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Silme işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      setSuccess('Kullanıcı durumu güncellendi.');
    } catch (err) {
      setError('Durum güncellenirken bir hata oluştu.');
    }
  };

  // Rol renkleri
  const getRoleColor = (role) => {
    const colors = {
      admin: '#ef4444',
      editor: '#3b82f6',
      moderator: '#f59e0b',
      user: '#10b981'
    };
    return colors[role] || '#64748b';
  };

  // Durum renkleri
  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      inactive: '#64748b',
      pending: '#f59e0b',
      suspended: '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  // İzin listesi
  const availablePermissions = [
    { id: 'users.read', label: 'Kullanıcıları Görüntüle' },
    { id: 'users.write', label: 'Kullanıcıları Düzenle' },
    { id: 'content.read', label: 'İçerikleri Görüntüle' },
    { id: 'content.write', label: 'İçerikleri Düzenle' },
    { id: 'offers.read', label: 'Teklifleri Görüntüle' },
    { id: 'offers.write', label: 'Teklifleri Düzenle' },
    { id: 'analytics.read', label: 'Analitikleri Görüntüle' },
    { id: 'settings.write', label: 'Ayarları Düzenle' }
  ];

  if (loading && users.length === 0) {
    return (
      <div className="admin-users-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users-management">
      {/* Header */}
      <div className="users-header">
        <div className="header-content">
          <h1>👥 Kullanıcı Yönetimi</h1>
          <p>Sistem kullanıcılarını yönetin, roller ve izinler atayın</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Toplam</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{users.filter(u => u.status === 'active').length}</span>
            <span className="stat-label">Aktif</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{users.filter(u => u.status === 'pending').length}</span>
            <span className="stat-label">Beklemede</span>
          </div>
        </div>
      </div>

      {/* Bildirimler */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">{error}</span>
          <button className="alert-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span className="alert-text">{success}</span>
          <button className="alert-close" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => { setActiveTab('list'); resetForm(); }}
        >
          📋 Kullanıcı Listesi
        </button>
        <button 
          className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => { setActiveTab('add'); resetForm(); }}
        >
          ➕ Yeni Kullanıcı
        </button>
        {activeTab === 'edit' && (
          <button className="tab-btn active">
            ✏️ Kullanıcı Düzenle
          </button>
        )}
      </div>

      {/* Kullanıcı Listesi */}
      {activeTab === 'list' && (
        <div className="users-list-section">
          {/* Filtreler */}
          <div className="filters">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Kullanıcı ara (isim, email, departman)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="moderator">Moderatör</option>
              <option value="user">Kullanıcı</option>
            </select>
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="pending">Beklemede</option>
              <option value="suspended">Askıya Alınmış</option>
            </select>
          </div>

          {/* Kullanıcılar Tablosu */}
          {filteredUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <h3>Kullanıcı Bulunamadı</h3>
              <p>Arama kriterlerinize uygun kullanıcı bulunamadı.</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Kullanıcı</th>
                    <th>Rol</th>
                    <th>Durum</th>
                    <th>Departman</th>
                    <th>Son Giriş</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{user.name}</div>
                            <div className="user-email">{user.email}</div>
                            <div className="user-phone">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="role-badge"
                          style={{ backgroundColor: getRoleColor(user.role) }}
                        >
                          {user.role === 'admin' ? 'Admin' :
                           user.role === 'editor' ? 'Editor' :
                           user.role === 'moderator' ? 'Moderatör' : 'Kullanıcı'}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          style={{ color: getStatusColor(user.status) }}
                        >
                          <option value="active">Aktif</option>
                          <option value="inactive">Pasif</option>
                          <option value="pending">Beklemede</option>
                          <option value="suspended">Askıya Alınmış</option>
                        </select>
                      </td>
                      <td>
                        <span className="department">{user.department}</span>
                      </td>
                      <td>
                        <span className="last-login">{user.lastLogin}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(user)}
                            title="Düzenle"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            title="Sil"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Kullanıcı Ekleme/Düzenleme Formu */}
      {(activeTab === 'add' || activeTab === 'edit') && (
        <div className="user-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>
                {activeTab === 'add' ? '➕ Yeni Kullanıcı Ekle' : '✏️ Kullanıcı Düzenle'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Kullanıcının tam adını girin"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-posta *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="kullanici@baybar.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="department">Departman</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="form-control"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="IT, Sales, Marketing, vb."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Rol *</label>
                  <select
                    id="role"
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="user">Kullanıcı</option>
                    <option value="moderator">Moderatör</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Durum *</label>
                  <select
                    id="status"
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                    <option value="pending">Beklemede</option>
                    <option value="suspended">Askıya Alınmış</option>
                  </select>
                </div>

                {activeTab === 'add' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="password">Şifre *</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={activeTab === 'add'}
                        placeholder="Güçlü bir şifre oluşturun"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Şifre Tekrar *</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-control"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={activeTab === 'add'}
                        placeholder="Şifreyi tekrar girin"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* İzinler */}
              <div className="permissions-section">
                <h3>🔐 Kullanıcı İzinleri</h3>
                <div className="permissions-grid">
                  {availablePermissions.map(permission => (
                    <label key={permission.id} className="permission-item">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionChange(permission.id)}
                      />
                      <span className="permission-label">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    resetForm();
                    setActiveTab('list');
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Kaydediliyor...' : 
                   activeTab === 'add' ? 'Kullanıcı Ekle' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>🗑️ Kullanıcı Sil</h3>
            </div>
            <div className="modal-content">
              <p>
                <strong>{userToDelete.name}</strong> kullanıcısını silmek istediğinizden emin misiniz?
              </p>
              <p className="warning-text">
                ⚠️ Bu işlem geri alınamaz ve kullanıcının tüm verileri silinecektir.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
              >
                İptal
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(userToDelete.id)}
                disabled={loading}
              >
                {loading ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersManagement;