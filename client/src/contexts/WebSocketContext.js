/**
 * WebSocket Context - Real-time güncelleme sistemi
 * Admin panel için real-time bildirimler ve güncellemeler
 * @author Senior Web Developer
 * @version 1.0.0
 */

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // WebSocket bağlantısını başlat
    const initSocket = () => {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        transports: ['websocket'],
        timeout: 20000,
        forceNew: true
      });

      newSocket.on('connect', () => {
        console.log('✅ WebSocket bağlantısı kuruldu');
        setIsConnected(true);
        setSocket(newSocket);
        reconnectAttempts.current = 0;

        // Admin kullanıcısı olarak kayıt ol
        const adminToken = localStorage.getItem('authToken');
      if (adminToken) {
        newSocket.emit('admin:join', { token: adminToken });
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ WebSocket bağlantısı kesildi:', reason);
        setIsConnected(false);
        setSocket(null);

        // Otomatik yeniden bağlanma
        if (reason === 'io server disconnect') {
          // Sunucu tarafından bağlantı kesildi, yeniden bağlan
          setTimeout(() => {
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current++;
              console.log(`🔄 Yeniden bağlanma denemesi ${reconnectAttempts.current}/${maxReconnectAttempts}`);
              initSocket();
            }
          }, 2000 * reconnectAttempts.current);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ WebSocket bağlantı hatası:', error);
        setIsConnected(false);
      });

      // Real-time event listeners
      newSocket.on('notification', (data) => {
        console.log('📢 Yeni bildirim:', data);
        setNotifications(prev => [{
          id: Date.now(),
          ...data,
          timestamp: new Date()
        }, ...prev.slice(0, 49)]); // Son 50 bildirimi tut
      });

      newSocket.on('user:online', (count) => {
        setOnlineUsers(count);
      });

      newSocket.on('content:updated', (data) => {
        console.log('📝 İçerik güncellendi:', data);
        // İçerik güncellendiğinde bildirim gönder
        setNotifications(prev => [{
          id: Date.now(),
          type: 'content_update',
          title: 'İçerik Güncellendi',
          message: `${data.pageName} sayfası güncellendi`,
          timestamp: new Date()
        }, ...prev.slice(0, 49)]);
      });

      newSocket.on('offer:new', (data) => {
        console.log('💼 Yeni teklif:', data);
        setNotifications(prev => [{
          id: Date.now(),
          type: 'new_offer',
          title: 'Yeni Teklif',
          message: `${data.companyName} şirketinden yeni teklif`,
          timestamp: new Date()
        }, ...prev.slice(0, 49)]);
      });

      newSocket.on('contact:new', (data) => {
        console.log('📧 Yeni iletişim:', data);
        setNotifications(prev => [{
          id: Date.now(),
          type: 'new_contact',
          title: 'Yeni İletişim',
          message: `${data.name} adlı kişiden yeni mesaj`,
          timestamp: new Date()
        }, ...prev.slice(0, 49)]);
      });

      return newSocket;
    };

    const socketInstance = initSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  // Bildirim temizleme
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Tüm bildirimleri temizle
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Bildirim gönderme
  const sendNotification = (data) => {
    if (socket && isConnected) {
      socket.emit('admin:notification', data);
    }
  };

  // Real-time veri güncelleme
  const emitDataUpdate = (type, data) => {
    if (socket && isConnected) {
      socket.emit(`admin:${type}:update`, data);
    }
  };

  const value = {
    socket,
    isConnected,
    notifications,
    onlineUsers,
    clearNotification,
    clearAllNotifications,
    sendNotification,
    emitDataUpdate
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;