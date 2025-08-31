const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function testLogin() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect('mongodb://127.0.0.1:27017/baybar');
    console.log('MongoDB bağlantısı başarılı');
    
    // Admin kullanıcısını bul
    const user = await User.findOne({ email: 'admin@baybar.com' }).select('+password');
    
    if (!user) {
      console.log('❌ Admin kullanıcısı bulunamadı');
      return;
    }
    
    console.log('✅ Admin kullanıcısı bulundu:', {
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    });
    
    // Şifreyi test et
    const isPasswordValid = await bcrypt.compare('admin123', user.password);
    console.log('🔐 Şifre testi:', isPasswordValid ? '✅ Doğru' : '❌ Yanlış');
    
    // Hash'i kontrol et
    console.log('🔑 Hash uzunluğu:', user.password.length);
    console.log('🔑 Hash başlangıcı:', user.password.substring(0, 10));
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı');
  }
}

testLogin();