# EREN PROJE

## Proje Hakkında
Bu proje, kullanıcıların çeşitli hizmetleri yönetebileceği ve analiz edebileceği bir platform sunar. Proje, hem frontend hem de backend bileşenlerini içerir ve modern web geliştirme teknolojileri kullanılarak geliştirilmiştir.

## Özellikler
- Kullanıcı yönetimi
- Proje ve plan yönetimi
- Teklif ve iletişim modülleri
- Raporlama ve analitik sistemi
- Güvenli kimlik doğrulama ve yetkilendirme

## Kurulum
### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- Bir veritabanı (ör. MongoDB)

### Adımlar
1. Projeyi klonlayın:
   ```bash
   git clone <repository-url>
   ```
2. Gerekli bağımlılıkları yükleyin:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```
3. `.env` dosyasını yapılandırın:
   - `server/.env` dosyasını oluşturun ve gerekli yapılandırmaları ekleyin (ör. veritabanı bağlantı bilgileri, JWT anahtarları).

4. Sunucuları başlatın:
   - Backend için:
     ```bash
     cd server
     npm start
     ```
   - Frontend için:
     ```bash
     cd client
     npm start
     ```

## Proje Yapısı
### Backend
- **`server/app.js`**: Uygulama giriş noktası.
- **`server/routes/`**: API rotaları.
- **`server/models/`**: Veritabanı modelleri.
- **`server/services/`**: İş mantığı ve servisler.
- **`server/middleware/`**: Orta katman yazılımları.

### Frontend
- **`client/src/App.js`**: Uygulama giriş noktası.
- **`client/src/components/`**: Yeniden kullanılabilir bileşenler.
- **`client/src/pages/`**: Sayfa bileşenleri.
- **`client/src/services/`**: API çağrıları ve iş mantığı.
- **`client/src/styles/`**: Stil dosyaları.

## Kullanılan Teknolojiler
### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Token)

### Frontend
- React.js
- SCSS
- Axios

## Katkıda Bulunma
1. Projeyi forklayın.
2. Yeni bir dal oluşturun:
   ```bash
   git checkout -b yeni-ozellik
   ```
3. Değişikliklerinizi yapın ve commitleyin:
   ```bash
   git commit -m "Yeni özellik eklendi"
   ```
4. Dalınızı gönderin:
   ```bash
   git push origin yeni-ozellik
   ```
5. Bir pull request oluşturun.

## Lisans
Bu proje MIT Lisansı ile lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

## İletişim
Herhangi bir sorunuz veya öneriniz varsa, lütfen [email@example.com](mailto:email@example.com) adresinden bizimle iletişime geçin.