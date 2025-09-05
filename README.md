# 🚀 Baybar Kurumsal Tanıtım Sitesi

Modern, dinamik ve tam özellikli kurumsal web sitesi ve admin paneli.

## ✨ Özellikler

### 🌐 Frontend (React + Vite)
- **Modern Tasarım**: Tailwind CSS ile responsive ve minimalist tasarım
- **Dinamik İçerik**: Tüm içerikler admin panelinden yönetilebilir
- **Kullanıcı Sistemi**: Kayıt olma, giriş yapma, profil yönetimi
- **Teklif Sistemi**: Detaylı teklif formu ve takip sistemi
- **Google Maps**: İletişim sayfasında entegre harita

### 🔧 Backend (Node.js + Express)
- **RESTful API**: Modern API mimarisi
- **MongoDB**: NoSQL veritabanı entegrasyonu
- **JWT Authentication**: Güvenli kimlik doğrulama
- **Mongoose**: Veritabanı modelleme

### 👨‍💼 Admin Panel
- **Dashboard**: İstatistikler ve hızlı işlemler
- **İçerik Yönetimi**: Dropdown menülü sayfa yönetimi
  - Ana Sayfa, Hakkımızda, Hizmetlerimiz, İletişim
- **Teklif Yönetimi**: Müşteri tekliflerini görüntüleme ve onaylama
- **Ödeme Sistemi**: Otomatik ödeme oluşturma ve takip
- **Kullanıcı Yönetimi**: Admin kullanıcıları yönetimi
- **İş Ortakları**: Firma logoları ve bilgileri yönetimi
- **Ayarlar**: Site geneli ayarlar

## 🛠️ Teknolojiler

### Frontend
- **React 18** - UI kütüphanesi
- **Vite** - Build tool
- **Tailwind CSS** - CSS framework
- **React Router v6** - Sayfa yönlendirme
- **Axios** - HTTP client
- **React Hook Form** - Form yönetimi
- **React Hot Toast** - Bildirimler
- **Lucide React** - İkonlar

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Veritabanı
- **Mongoose** - ODM
- **JWT** - Kimlik doğrulama
- **Bcryptjs** - Şifre hashleme
- **CORS** - Cross-origin resource sharing
- **Helmet** - Güvenlik

## 🚀 Kurulum

### Gereksinimler
- Node.js (v18+)
- MongoDB
- Git

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/abekircetinkaya/Baybar-proje.git
cd Baybar-proje
```

2. **Backend kurulumu**
```bash
cd server
npm install
cp env.example .env
# .env dosyasını düzenleyin
node app.js
```

3. **Frontend kurulumu**
```bash
cd ../client
npm install
npm run dev
```

## 📁 Proje Yapısı

```
Baybar-proje/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/         # Sayfalar
│   │   ├── contexts/      # Context API
│   │   ├── utils/         # Yardımcı fonksiyonlar
│   │   └── styles/        # CSS dosyaları
│   └── public/            # Statik dosyalar
├── server/                # Backend (Node.js)
│   ├── controllers/       # API kontrolcüleri
│   ├── models/           # Veritabanı modelleri
│   ├── routes/           # API rotaları
│   ├── middleware/       # Middleware'ler
│   └── config/           # Konfigürasyon
└── README.md
```

## 🔐 Admin Panel Erişimi

- **URL**: `http://localhost:3000/admin`
- **Kullanıcı Adı**: `admin`
- **Şifre**: `admin123`

## 📱 Sayfalar

### Genel Sayfalar
- **Ana Sayfa** (`/`) - Hero, hizmetler, müşteri yorumları
- **Hakkımızda** (`/about`) - Misyon, vizyon, değerler, yolculuk
- **Hizmetlerimiz** (`/services`) - Hizmet kartları ve detaylar
- **İletişim** (`/contact`) - İletişim formu ve harita

### Kullanıcı Sayfaları
- **Giriş Yap** (`/login`) - Kullanıcı girişi
- **Kayıt Ol** (`/register`) - Yeni kullanıcı kaydı
- **Profil** (`/profile`) - Kullanıcı profili ve teklifler
- **Teklif Al** (`/quote/:serviceId`) - Detaylı teklif formu

### Admin Sayfaları
- **Dashboard** (`/admin`) - Genel bakış ve istatistikler
- **İçerik Yönetimi** (`/admin/content`) - Sayfa içerikleri
- **Teklifler** (`/admin/quotes`) - Müşteri teklifleri
- **Ödemeler** (`/admin/payments`) - Ödeme takibi
- **Yöneticiler** (`/admin/users`) - Admin kullanıcıları
- **İş Ortakları** (`/admin/partners`) - Firma logoları
- **Ayarlar** (`/admin/settings`) - Site ayarları

## 🎨 Tasarım Özellikleri

- **Minimalist**: Temiz ve profesyonel görünüm
- **Responsive**: Tüm cihazlarda uyumlu
- **Modern**: Güncel tasarım trendleri
- **Kullanıcı Dostu**: Kolay navigasyon
- **Hızlı**: Optimize edilmiş performans

## 🔧 Geliştirme

### Frontend Geliştirme
```bash
cd client
npm run dev
```

### Backend Geliştirme
```bash
cd server
npm run dev
```

### Veritabanı Seed
```bash
cd server
node seed.js
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Abekir Çetinkaya**
- GitHub: [@abekircetinkaya](https://github.com/abekircetinkaya)
- Proje: [Baybar-proje](https://github.com/abekircetinkaya/Baybar-proje)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için:
- **Email**: info@baybar.com
- **Website**: [Baybar](https://baybar.com)

---

⭐ **Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**