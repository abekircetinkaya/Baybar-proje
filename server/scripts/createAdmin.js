/**
 * Admin Kullanıcısı Oluşturma Script'i
 * Bu script ile varsayılan admin kullanıcısı oluşturabilirsiniz
 * @author Senior Web Developer
 * @version 1.0.0
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Admin kullanıcı bilgileri
const adminData = {
  firstName: 'Admin',
  lastName: 'User',
  username: 'admin',
  email: 'admin@baybar.com',
  password: 'admin123', // Bu şifre hash'lenecek
  role: 'admin'
};

// Admin kullanıcısı oluştur
async function createAdmin() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/baybar');
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut admin kullanıcısını kontrol et
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut:');
      console.log('E-posta:', existingAdmin.email);
      console.log('Rol:', existingAdmin.role);
      return;
    }

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Yeni admin kullanıcısı oluştur
    const newAdmin = new User({
      ...adminData,
      password: hashedPassword
    });

    await newAdmin.save();
    
    console.log('\n✅ Admin kullanıcısı başarıyla oluşturuldu!');
    console.log('📧 E-posta:', adminData.email);
    console.log('🔑 Şifre:', adminData.password);
    console.log('👤 Rol:', adminData.role);
    console.log('\n⚠️  Güvenlik için şifreyi değiştirmeyi unutmayın!');
    
  } catch (error) {
    console.error('❌ Hata oluştu:', error.message);
  } finally {
    // Bağlantıyı kapat
    await mongoose.connection.close();
    console.log('\nMongoDB bağlantısı kapatıldı');
    process.exit(0);
  }
}

// Script'i çalıştır
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;