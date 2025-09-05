# Baybar Kurumsal Tanıtım Sitesi

Modern, dinamik ve admin paneli ile yönetilebilir kurumsal tanıtım sitesi.

## 🚀 Özellikler

- **Modern Tasarım**: Minimalist ve profesyonel tasarım
- **Responsive**: Mobil-first yaklaşım ile tüm cihazlarda uyumlu
- **Dinamik İçerik**: Admin paneli ile tüm içerikler yönetilebilir
- **SEO Optimized**: Arama motorları için optimize edilmiş
- **Hızlı**: Vite ile hızlı geliştirme ve build
- **Güvenli**: JWT tabanlı kimlik doğrulama

## 🛠️ Teknolojiler

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

## 📁 Proje Yapısı

```
baybar-corporate/
├── client/                 # Frontend
│   ├── public/            # Statik dosyalar
│   ├── src/
│   │   ├── components/    # React bileşenleri
│   │   │   ├── common/    # Ortak bileşenler
│   │   │   └── ui/        # Sayfa bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── contexts/      # React Context
│   │   ├── utils/         # Yardımcı fonksiyonlar
│   │   └── styles/        # CSS dosyaları
│   └── package.json
├── server/                 # Backend
│   ├── config/            # Konfigürasyon
│   ├── controllers/       # API controller'ları
│   ├── models/            # Veritabanı modelleri
│   ├── routes/            # API route'ları
│   ├── middleware/        # Middleware'ler
│   └── services/          # Servisler
└── docs/                  # Dokümantasyon
```

## 🚀 Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- MongoDB
- npm veya yarn

### 1. Projeyi klonlayın
```bash
git clone <repository-url>
cd baybar-corporate
```

### 2. Backend kurulumu
```bash
cd server
npm install
cp env.example .env
# .env dosyasını düzenleyin
npm run dev
```

### 3. Frontend kurulumu
```bash
cd client
npm install
cp env.example .env
# .env dosyasını düzenleyin
npm run dev
```

## 🔧 Konfigürasyon

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/baybar-corporate
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Baybar
```

## 📱 Kullanım

### Admin Paneli
1. `/admin/login` adresine gidin
2. Admin bilgileri ile giriş yapın
3. Dashboard'dan tüm içerikleri yönetin

### API Endpoints
- `GET /api/content/:pageName` - Sayfa içeriği getir
- `PUT /api/content/:pageName` - Sayfa içeriği güncelle
- `GET /api/partners` - İş ortakları listesi
- `POST /api/partners` - Yeni iş ortağı ekle
- `POST /api/contact` - İletişim formu gönder
- `POST /api/auth/login` - Admin girişi

## 🎨 Tasarım Sistemi

### Renkler
- Primary: #1A237E (Koyu Mavi)
- Secondary: #42A5F5 (Açık Mavi)
- Accent: #FFC107 (Altın Sarısı)
- Neutral: #FFFFFF, #F5F5F5, #000000

### Tipografi
- Başlıklar: Montserrat
- Metin: Lato

## 📦 Build ve Deploy

### Development
```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
```

### Production
```bash
# Backend
cd server && npm start

# Frontend
cd client && npm run build
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- Website: [baybar.com](https://baybar.com)
- Email: info@baybar.com
- Phone: +90 555 123 45 67