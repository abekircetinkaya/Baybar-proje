/**
 * Baybar Kurumsal Tanıtım Sitesi - Backend API
 * Ana Express.js uygulama dosyası
 * @author Senior Web Developer
 * @version 1.0.0
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// MongoDB Memory Server kaldırıldı - Gerçek MongoDB kullanılıyor
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Route dosyalarını import et
const contentRoutes = require('./routes/content');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const partnerRoutes = require('./routes/partners');
const faqRoutes = require('./routes/faq');
const projectRoutes = require('./routes/projects');
const offerRoutes = require('./routes/offers');
const planRoutes = require('./routes/plans');
const adminRoutes = require('./routes/admin');

// Middleware dosyalarını import et
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { notFound: notFoundMiddleware } = require('./middleware/notFound');

// Express uygulamasını oluştur
const app = express();

// Port konfigürasyonu
const PORT = process.env.PORT || 5000;

// MongoDB bağlantısı (Gerçek MongoDB)
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/baybar';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB bağlantısı başarılı:', mongoUri);
    
    // Demo veri ekle (development ve production için)
    await seedDemoData();
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error.message);
    console.error('💡 MongoDB sunucusunun çalıştığından emin olun: mongod');
    process.exit(1);
  }
};

// Demo veri ekleme fonksiyonu
const seedDemoData = async () => {
  try {
    const Project = require('./models/Project');
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    // Admin kullanıcısını kontrol et ve oluştur
    const adminExists = await User.findOne({ email: 'admin@baybar.com' });
    
    if (!adminExists) {
      console.log('👤 Admin kullanıcısı oluşturuluyor...');
      
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        email: 'admin@baybar.com',
        password: 'Admin123!', // Ham şifre - User modelindeki middleware tarafından hash'lenecek
        role: 'admin',
        isActive: true
      });
      
      await adminUser.save();
      console.log('✅ Admin kullanıcısı oluşturuldu (admin@baybar.com / Admin123!)');
    }
    
    // Proje sayısını kontrol et
    const projectCount = await Project.countDocuments();
    
    if (projectCount === 0) {
      console.log('📦 Demo proje verileri ekleniyor...');
      
      const demoProjects = [
        {
          title: "E-Ticaret Platformu - TechStore",
          description: "Modern ve kullanıcı dostu e-ticaret platformu. React.js ve Node.js teknolojileri kullanılarak geliştirilmiş, mobil uyumlu tasarım ve güvenli ödeme sistemi içeren kapsamlı bir çözüm.",
          shortDescription: "Modern e-ticaret platformu - React.js ve Node.js ile geliştirilmiş",
          image: "/uploads/projects/techstore-main.jpg",
          gallery: ["/uploads/projects/techstore-1.jpg", "/uploads/projects/techstore-2.jpg"],
          technologies: [
            { name: "React.js", icon: "⚛️", color: "#61DAFB" },
            { name: "Node.js", icon: "🟢", color: "#339933" }
          ],
          category: "web",
          status: "completed",
          client: { name: "TechStore Ltd.", logo: "/uploads/clients/techstore-logo.png" },
          projectUrl: "https://techstore-demo.baybar.com",
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-04-30'),
          budget: 25000,
          teamSize: 4,
          isFeatured: true,
           isActive: true,
           order: 1,
           createdBy: new mongoose.Types.ObjectId(),
          tags: ["e-ticaret", "react", "nodejs"],
          features: [
             { title: "Responsive Tasarım", description: "Mobil uyumlu responsive tasarım", isCompleted: true },
             { title: "Güvenli Ödeme Sistemi", description: "SSL sertifikalı güvenli ödeme altyapısı", isCompleted: true }
           ],
          viewCount: 245
        },
        {
          title: "Mobil Uygulama - FitTracker",
          description: "Fitness takibi için geliştirilmiş mobil uygulama. React Native teknolojisi kullanılarak iOS ve Android platformları için geliştirilmiş.",
          shortDescription: "Fitness takip uygulaması - React Native ile geliştirilmiş",
          image: "/uploads/projects/fittracker-main.jpg",
          gallery: ["/uploads/projects/fittracker-1.jpg"],
          technologies: [
            { name: "React Native", icon: "📱", color: "#61DAFB" },
            { name: "Firebase", icon: "🔥", color: "#FFCA28" }
          ],
          category: "mobile",
          status: "completed",
          client: { name: "HealthTech Solutions", logo: "/uploads/clients/healthtech-logo.png" },
          projectUrl: "https://fittracker-app.com",
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-06-15'),
          budget: 35000,
          teamSize: 5,
          isFeatured: true,
           isActive: true,
           order: 2,
           createdBy: new mongoose.Types.ObjectId(),
          tags: ["mobil", "fitness"],
          features: [
             { title: "Antrenman Takibi", description: "Detaylı antrenman kayıt ve takip sistemi", isCompleted: true },
             { title: "Beslenme Planı", description: "Kişiselleştirilmiş beslenme programları", isCompleted: true }
           ],
          viewCount: 189
        },
        {
          title: "AI Chatbot Sistemi - SmartAssist",
          description: "Yapay zeka destekli müşteri hizmetleri chatbot sistemi. Python ve TensorFlow teknolojileri kullanılarak geliştirilmiş.",
          shortDescription: "AI chatbot sistemi - Python ve TensorFlow ile geliştirilmiş",
          image: "/uploads/projects/smartassist-main.jpg",
          gallery: ["/uploads/projects/smartassist-1.jpg"],
          technologies: [
            { name: "Python", icon: "🐍", color: "#3776AB" },
            { name: "TensorFlow", icon: "🧠", color: "#FF6F00" }
          ],
          category: "ai",
          status: "completed",
          client: { name: "CustomerCare Inc.", logo: "/uploads/clients/customercare-logo.png" },
          projectUrl: "https://smartassist-demo.com",
          startDate: new Date('2024-01-10'),
          endDate: new Date('2024-07-30'),
          budget: 45000,
          teamSize: 6,
          isFeatured: true,
           isActive: true,
           order: 3,
           createdBy: new mongoose.Types.ObjectId(),
          tags: ["ai", "chatbot"],
          features: [
             { title: "Doğal Dil İşleme", description: "Gelişmiş NLP algoritmaları", isCompleted: true },
             { title: "Makine Öğrenmesi", description: "Sürekli öğrenen AI modeli", isCompleted: true }
           ],
          viewCount: 298
        }
      ];
      
      await Project.insertMany(demoProjects);
      console.log(`✅ ${demoProjects.length} demo proje eklendi`);
    }
  } catch (error) {
     console.log('⚠️ Demo veri ekleme hatası:', error.message);
   }
 };

// Veritabanı bağlantısını başlat
connectDB();

// Rate limiting - DDoS koruması
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum 100 istek
  message: {
    error: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global middleware'ler
app.use(helmet()); // Güvenlik başlıkları
app.use(compression()); // Gzip sıkıştırma
app.use(morgan('combined')); // HTTP request logging
app.use(limiter); // Rate limiting

// CORS konfigürasyonu
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3003'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Statik dosya servisi
app.use('/uploads', express.static('uploads'));

// API route'larını tanımla
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Baybar API çalışıyor',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ana route
app.get('/', (req, res) => {
  res.json({
    message: 'Baybar Kurumsal Tanıtım Sitesi API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// Error handling middleware (en sonda olmalı)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM sinyali alındı, sunucu kapatılıyor...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT sinyali alındı, sunucu kapatılıyor...');
  mongoose.connection.close(() => {
    console.log('📦 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  });
});

// HTTP sunucusu oluştur
const server = http.createServer(app);

// Socket.IO sunucusunu oluştur
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket.IO bağlantı yönetimi
io.on('connection', (socket) => {
  console.log('👤 Kullanıcı bağlandı:', socket.id);
  

  
  // İçerik güncellemeleri
  socket.on('content-updated', (data) => {
    socket.broadcast.emit('content-changed', data);
    console.log('📝 İçerik güncellendi:', data.type);
  });
  
  // Bağlantı koptuğunda
  socket.on('disconnect', () => {
    console.log('👋 Kullanıcı ayrıldı:', socket.id);
  });
});

// Socket.IO'yu global olarak erişilebilir yap
app.set('io', io);

// Sunucuyu başlat
server.listen(PORT, () => {
  console.log(`🚀 Baybar API sunucusu ${PORT} portunda çalışıyor`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 WebSocket sunucusu aktif`);
});

module.exports = { app, server, io };