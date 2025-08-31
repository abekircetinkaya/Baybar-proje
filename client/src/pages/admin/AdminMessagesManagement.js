/**
 * Admin İletişim Mesajları Yönetimi Sayfası
 * Gelen iletişim formlarını görüntüleme, yanıtlama ve yönetme
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, FaReply, FaArchive, FaTrash, FaEye, FaStar, 
  FaSearch, FaFilter, FaDownload, FaUser, FaPhone, FaCalendar,
  FaFlag, FaCheck, FaTimes, FaExclamationTriangle, FaTag
} from 'react-icons/fa';
import './AdminMessagesManagement.scss';

const AdminMessagesManagement = () => {
  // State yönetimi
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filtreleme ve arama
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10);

  // Yanıt formu
  const [replyForm, setReplyForm] = useState({
    subject: '',
    message: '',
    ccEmail: ''
  });

  // Mesaj durumları
  const messageStatuses = [
    { value: 'new', label: 'Yeni', color: '#3b82f6', icon: '📧' },
    { value: 'read', label: 'Okundu', color: '#10b981', icon: '👁️' },
    { value: 'replied', label: 'Yanıtlandı', color: '#8b5cf6', icon: '💬' },
    { value: 'closed', label: 'Kapatıldı', color: '#6b7280', icon: '🔒' },
    { value: 'spam', label: 'Spam', color: '#ef4444', icon: '🚫' }
  ];

  // Öncelik seviyeleri
  const priorityLevels = [
    { value: 'low', label: 'Düşük', color: '#10b981' },
    { value: 'medium', label: 'Orta', color: '#f59e0b' },
    { value: 'high', label: 'Yüksek', color: '#ef4444' },
    { value: 'urgent', label: 'Acil', color: '#dc2626' }
  ];

  // Bileşen yüklendiğinde mesajları getir
  useEffect(() => {
    fetchMessages();
  }, []);

  // Mesajları API'den getir
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Mesajlar yüklenemedi');
      }

      const data = await response.json();
      setMessages(data.messages || getDemoMessages());
    } catch (err) {
      console.error('Mesaj yükleme hatası:', err);
      setError(err.message);
      // Demo veriler
      setMessages(getDemoMessages());
    } finally {
      setLoading(false);
    }
  };

  // Demo mesajlar (geliştirme aşamasında)
  const getDemoMessages = () => {
    return [
      {
        id: 1,
        senderName: 'Ahmet Yılmaz',
        senderEmail: 'ahmet@example.com',
        senderPhone: '+90 532 123 4567',
        subject: 'E-ticaret projesi hakkında bilgi',
        message: 'Merhaba, şirketimiz için bir e-ticaret sitesi geliştirmek istiyoruz. Bu konuda detaylı bilgi alabilir miyiz?',
        status: 'new',
        priority: 'high',
        receivedAt: '2024-01-15 14:30',
        readAt: null,
        repliedAt: null,
        tags: ['e-ticaret', 'proje'],
        source: 'website',
        isStarred: false
      },
      {
        id: 2,
        senderName: 'Zeynep Kaya',
        senderEmail: 'zeynep@company.com',
        senderPhone: '+90 555 987 6543',
        subject: 'Destek talebi - Mevcut proje',
        message: 'Mevcut projemizde bir sorun yaşıyoruz. Acil destek alabilir miyiz?',
        status: 'read',
        priority: 'urgent',
        receivedAt: '2024-01-15 10:15',
        readAt: '2024-01-15 10:30',
        repliedAt: null,
        tags: ['destek', 'acil'],
        source: 'email',
        isStarred: true
      },
      {
        id: 3,
        senderName: 'Mehmet Demir',
        senderEmail: 'mehmet@startup.com',
        senderPhone: '+90 541 456 7890',
        subject: 'Mobil uygulama geliştirme',
        message: 'Startup projemiz için mobil uygulama geliştirmeniz gerekiyor. Fiyat teklifi alabilir miyiz?',
        status: 'replied',
        priority: 'medium',
        receivedAt: '2024-01-14 16:45',
        readAt: '2024-01-14 17:00',
        repliedAt: '2024-01-14 18:30',
        tags: ['mobil', 'uygulama'],
        source: 'form',
        isStarred: false
      },
      {
        id: 4,
        senderName: 'Ayşe Özkan',
        senderEmail: 'ayse@business.com',
        senderPhone: '+90 533 234 5678',
        subject: 'Web sitesi yenileme',
        message: 'Mevcut web sitemizi yenilemek istiyoruz. Modern bir tasarım ve daha iyi performans arıyoruz.',
        status: 'new',
        priority: 'low',
        receivedAt: '2024-01-14 09:20',
        readAt: null,
        repliedAt: null,
        tags: ['web', 'yenileme'],
        source: 'website',
        isStarred: false
      },
      {
        id: 5,
        senderName: 'Can Yılmaz',
        senderEmail: 'can@techcompany.com',
        senderPhone: '+90 544 567 8901',
        subject: 'API entegrasyonu',
        message: 'Mevcut sistemimize yeni API entegrasyonları yapmamız gerekiyor. Bu konuda yardım alabilir miyiz?',
        status: 'closed',
        priority: 'medium',
        receivedAt: '2024-01-13 11:10',
        readAt: '2024-01-13 11:25',
        repliedAt: '2024-01-13 14:15',
        tags: ['api', 'entegrasyon'],
        source: 'email',
        isStarred: false
      }
    ];
  };

  // Mesaj durumunu güncelle
  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Durum güncellenemedi');
      }

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: newStatus, readAt: newStatus === 'read' ? new Date().toISOString() : msg.readAt }
          : msg
      ));

      setSuccess('Mesaj durumu güncellendi');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Mesajı yıldızla/yıldızdan çıkar
  const toggleStarMessage = async (messageId) => {
    try {
      const message = messages.find(m => m.id === messageId);
      const newStarredState = !message.isStarred;

      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isStarred: newStarredState }
          : msg
      ));

      setSuccess(newStarredState ? 'Mesaj yıldızlandı' : 'Yıldız kaldırıldı');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('İşlem başarısız');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Mesajı sil
  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Mesaj silinemedi');
      }

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSuccess('Mesaj silindi');
      setShowDeleteModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Mesaj yanıtla
  const replyToMessage = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`/api/admin/messages/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: replyForm.subject,
          message: replyForm.message,
          ccEmail: replyForm.ccEmail
        })
      });

      if (!response.ok) {
        throw new Error('Yanıt gönderilemedi');
      }

      // Mesaj durumunu güncelle
      setMessages(prev => prev.map(msg => 
        msg.id === selectedMessage.id 
          ? { ...msg, status: 'replied', repliedAt: new Date().toISOString() }
          : msg
      ));

      setSuccess('Yanıt başarıyla gönderildi');
      setShowReplyModal(false);
      setReplyForm({ subject: '', message: '', ccEmail: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filtrelenmiş mesajlar
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sayfalama
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // Durum rengini al
  const getStatusColor = (status) => {
    const statusConfig = messageStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.color : '#6b7280';
  };

  // Öncelik rengini al
  const getPriorityColor = (priority) => {
    const priorityConfig = priorityLevels.find(p => p.value === priority);
    return priorityConfig ? priorityConfig.color : '#6b7280';
  };

  // Tarih formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-messages-loading">
        <div className="loading-spinner"></div>
        <p>Mesajlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="admin-messages-management">
      <div className="admin-header">
        <div className="header-left">
          <h1>
            <FaEnvelope />
            İletişim Mesajları
          </h1>
          <p>Gelen iletişim formlarını yönetin ve yanıtlayın</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => fetchMessages()}>
            Yenile
          </button>
          <button className="btn btn-primary">
            <FaDownload />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Başarı/Hata Mesajları */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filtreleme ve Arama */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Mesajlarda ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tüm Durumlar</option>
            {messageStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">Tüm Öncelikler</option>
            {priorityLevels.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mesajlar Tablosu */}
      <div className="messages-table-container">
        <table className="messages-table">
          <thead>
            <tr>
              <th>Gönderen</th>
              <th>Konu</th>
              <th>Durum</th>
              <th>Öncelik</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {currentMessages.map(message => (
              <tr 
                key={message.id} 
                className={`message-row ${message.status === 'new' ? 'unread' : ''}`}
              >
                <td>
                  <div className="sender-info">
                    <div className="sender-name">
                      {message.isStarred && <FaStar className="star-icon" />}
                      {message.senderName}
                    </div>
                    <div className="sender-email">{message.senderEmail}</div>
                  </div>
                </td>
                <td>
                  <div className="subject-cell">
                    <div className="subject">{message.subject}</div>
                    <div className="message-preview">
                      {message.message.substring(0, 60)}...
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(message.status) }}
                  >
                    {messageStatuses.find(s => s.value === message.status)?.label}
                  </span>
                </td>
                <td>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(message.priority) }}
                  >
                    {priorityLevels.find(p => p.value === message.priority)?.label}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    <div>{formatDate(message.receivedAt)}</div>
                    {message.repliedAt && (
                      <small>Yanıtlandı: {formatDate(message.repliedAt)}</small>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-icon"
                      onClick={() => setSelectedMessage(message)}
                      title="Görüntüle"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-icon"
                      onClick={() => toggleStarMessage(message.id)}
                      title={message.isStarred ? "Yıldızdan çıkar" : "Yıldızla"}
                    >
                      <FaStar style={{ color: message.isStarred ? '#f59e0b' : '#9ca3af' }} />
                    </button>
                    <button
                      className="btn btn-sm btn-icon"
                      onClick={() => {
                        setSelectedMessage(message);
                        setReplyForm({
                          subject: `Re: ${message.subject}`,
                          message: '',
                          ccEmail: ''
                        });
                        setShowReplyModal(true);
                      }}
                      title="Yanıtla"
                    >
                      <FaReply />
                    </button>
                    <button
                      className="btn btn-sm btn-icon btn-danger"
                      onClick={() => {
                        setSelectedMessage(message);
                        setShowDeleteModal(true);
                      }}
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sayfalama */}
      <div className="pagination">
        <button
          className="btn btn-outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Önceki
        </button>
        <span>
          Sayfa {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Sonraki
        </button>
      </div>

      {/* Mesaj Detay Modal */}
      {selectedMessage && !showReplyModal && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal message-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Mesaj Detayı</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedMessage(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="message-details">
                <div className="detail-row">
                  <label>Gönderen:</label>
                  <span>{selectedMessage.senderName} ({selectedMessage.senderEmail})</span>
                </div>
                <div className="detail-row">
                  <label>Telefon:</label>
                  <span>{selectedMessage.senderPhone}</span>
                </div>
                <div className="detail-row">
                  <label>Konu:</label>
                  <span>{selectedMessage.subject}</span>
                </div>
                <div className="detail-row">
                  <label>Durum:</label>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                  >
                    {messageStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="detail-row">
                  <label>Tarih:</label>
                  <span>{formatDate(selectedMessage.receivedAt)}</span>
                </div>
                <div className="detail-row full-width">
                  <label>Mesaj:</label>
                  <div className="message-content">
                    {selectedMessage.message}
                  </div>
                </div>
                {selectedMessage.tags && selectedMessage.tags.length > 0 && (
                  <div className="detail-row">
                    <label>Etiketler:</label>
                    <div className="tags">
                      {selectedMessage.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          <FaTag />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setReplyForm({
                    subject: `Re: ${selectedMessage.subject}`,
                    message: '',
                    ccEmail: ''
                  });
                  setShowReplyModal(true);
                }}
              >
                <FaReply />
                Yanıtla
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setSelectedMessage(null)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yanıt Modal */}
      {showReplyModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowReplyModal(false)}>
          <div className="modal reply-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Mesajı Yanıtla</h2>
              <button 
                className="close-btn"
                onClick={() => setShowReplyModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Alıcı:</label>
                <input 
                  type="email" 
                  value={selectedMessage.senderEmail}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Konu:</label>
                <input 
                  type="text" 
                  value={replyForm.subject}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>CC:</label>
                <input 
                  type="email" 
                  placeholder="Ek alıcı e-posta (opsiyonel)"
                  value={replyForm.ccEmail}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, ccEmail: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Mesaj:</label>
                <textarea 
                  rows="8"
                  placeholder="Yanıtınızı yazın..."
                  value={replyForm.message}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-primary"
                onClick={replyToMessage}
                disabled={!replyForm.message.trim()}
              >
                <FaReply />
                Gönder
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setShowReplyModal(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modal */}
      {showDeleteModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Mesajı Sil</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-content">
                <FaExclamationTriangle className="warning-icon" />
                <p>
                  <strong>{selectedMessage.senderName}</strong> tarafından gönderilen 
                  <strong> "{selectedMessage.subject}"</strong> konulu mesajı silmek istediğinizden emin misiniz?
                </p>
                <p className="warning-text">Bu işlem geri alınamaz!</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-danger"
                onClick={() => deleteMessage(selectedMessage.id)}
              >
                <FaTrash />
                Evet, Sil
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* İstatistikler */}
      <div className="messages-stats">
        <div className="stat-card">
          <h4>Toplam Mesaj</h4>
          <span className="stat-number">{messages.length}</span>
        </div>
        <div className="stat-card">
          <h4>Yeni Mesajlar</h4>
          <span className="stat-number">{messages.filter(m => m.status === 'new').length}</span>
        </div>
        <div className="stat-card">
          <h4>Yanıtlanan</h4>
          <span className="stat-number">{messages.filter(m => m.status === 'replied').length}</span>
        </div>
        <div className="stat-card">
          <h4>Yıldızlı</h4>
          <span className="stat-number">{messages.filter(m => m.isStarred).length}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminMessagesManagement;
