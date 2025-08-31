/**
 * Baybar Kurumsal Tanıtım Sitesi - WebSocket Servisi
 * Gerçek zamanlı güncellemeler için Socket.IO client
 * @author Senior Web Developer
 * @version 1.0.0
 */

import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Socket bağlantısını başlat
  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('🔌 WebSocket bağlantısı kuruldu');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 WebSocket bağlantısı kesildi');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔌 WebSocket bağlantı hatası:', error);
      });
    }
    return this.socket;
  }



  // İçerik güncellemesi gönder
  emitContentUpdate(type, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('content-updated', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // İçerik değişikliklerini dinle
  onContentChange(callback) {
    if (this.socket) {
      this.socket.on('content-changed', callback);
    }
  }

  // Event listener'ı kaldır
  offContentChange(callback) {
    if (this.socket) {
      this.socket.off('content-changed', callback);
    }
  }

  // Bağlantıyı kapat
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Bağlantı durumunu kontrol et
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;