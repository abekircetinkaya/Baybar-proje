const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function recreateAdmin() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect('mongodb://127.0.0.1:27017/baybar');
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut admin kullanıcısını sil
    await User.deleteOne({ email: 'admin@baybar.com' });
    console.log('✅ Mevcut admin kullanıcısı silindi');

    // Yeni admin kullanıcısı oluştur (ham şifre ile - User modelindeki middleware hash'leyecek)
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email: 'admin@baybar.com',
      password: 'Admin123!', // Ham şifre - middleware tarafından hash'lenecek
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Yeni admin kullanıcısı oluşturuldu');

    // Kaydedilen kullanıcıyı tekrar bul ve şifre testini yap
    const savedUser = await User.findOne({ email: 'admin@baybar.com' }).select('+password');
    const testResult = await savedUser.comparePassword('Admin123!');
    console.log('🔐 Şifre testi:', testResult ? '✅ Doğru' : '❌ Yanlış');
    console.log('🔑 Hash uzunluğu:', savedUser.password.length);
    console.log('🔑 Hash başlangıcı:', savedUser.password.substring(0, 10));
    
    // Manuel bcrypt testi de yapalım
    const manualTest = await bcrypt.compare('Admin123!', savedUser.password);
    console.log('🔐 Manuel bcrypt testi:', manualTest ? '✅ Doğru' : '❌ Yanlış');

  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
  }
}

recreateAdmin();