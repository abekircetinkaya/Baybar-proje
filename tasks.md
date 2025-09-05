Baybar Kurumsal Tanıtım Sitesi - Proje Görevleri (tasks.md)
Bu dosya, projenin geliştirme sürecinde tamamlanması gereken tüm görevleri içerir. Görevler, hem teknik altyapı hem de tasarım/arayüz geliştirme süreçlerini kapsayacak şekilde düzenlenmiştir.

1. Proje Başlangıç ve Planlama
[x] Proje deposunu (repository) oluştur ve temel klasör yapısını (/client, /server, /docs) kur.

[x] .gitignore ve .env dosyalarını yapılandır.

[x] Tüm proje paydaşlarının erişebileceği, proje hedeflerini özetleyen bir README.md hazırla.

[x] Tasarım: Projenin görsel kimliğini ve tasarım hedeflerini detaylandıran design.md dosyasını oluştur ve son haline getir.

2. Backend Geliştirme (/server)
2.1. Altyapı ve Veritabanı
[x] Node.js ve Express.js ile temel sunucu yapısını kur ve gerekli npm paketlerini yükle (mongoose, bcryptjs, jsonwebtoken, dotenv).

[x] MongoDB veritabanı bağlantısını konfigüre et ve bağlantıyı test et.

[x] Modeller: contents, partners ve users (şifre hashleme için alanları içerir) Mongoose modellerini ve şemalarını oluştur.

2.2. API Endpointleri ve İş Mantığı
[x] İçerik API'leri:

[x] GET /api/content/:pageName (içeriği okur).

[x] PUT /api/content/:pageName (yetkilendirme gerektirir, içeriği günceller).

[x] İş Ortakları API'leri:

[x] GET /api/partners.

[x] POST /api/partners (yetkilendirme gerektirir).

[x] İletişim Formu API'si:

[x] POST /api/contact (form verilerini kaydeder).

[ ] Kimlik Doğrulama API'leri:

[x] POST /api/auth/register (admin kullanıcı oluşturur).

[x] POST /api/auth/login (JWT token oluşturur ve döndürür).

2.3. Güvenlik ve Middleware
[x] JWT token'ını doğrulayan ve admin API'leri için yetkilendirme sağlayan middleware'i oluştur.

[x] Kullanıcı şifrelerinin bcrypt ile güvenli bir şekilde hashlenerek saklanmasını sağla.

[x] API hatalarını (404, 500 vb.) düzgün bir şekilde yönetmek için hata yönetimi middleware'i kur.

3. Frontend Geliştirme (/client)
3.1. Tasarım Sistemi ve Temel Ayarlar
[x] React uygulamasını oluştur ve gerekli paketleri (react-router-dom, axios) yükle.

[x] design.md'de belirtilen renk paleti ve tipografi (Montserrat, Lato) için global stilleri veya CSS değişkenlerini ayarla.

[x] Atomic Design prensibine göre temel bileşenleri (Button, Input, Heading) oluştur ve tasarımla eşleştir.

3.2. Sayfa ve Bileşen Geliştirme
[x] Header ve Footer: design.md'deki navigasyon yapısı ve mobil menü mantığına uygun olarak bu ortak bileşenleri geliştir.

[x] Ana Sayfa:

[x] Hero Section (arkaplan görseli ve CTA butonu).

[x] Hizmet Tanıtım Alanı (kısa açıklamalar ve görseller).

[x] Güven Alanı (iş ortakları logoları).

[x] CTA Alanı (iletişime teşvik eden başlık ve form).

[x] Hakkımızda Sayfası: Şirket hikayesi, vizyon, misyon ve iş ortaklığı yürütülen firmaları gösterecek şekilde tasarla.

[x] Hizmetler Sayfası: Detaylı hizmet açıklamalarını ve fiyatlandırma tablolarını (eğer varsa) sergileyecek bileşeni oluştur.

[x] İletişim Sayfası: design.md'de belirtilen iletişim formu ve Google Haritalar entegrasyonunu yap.

[x] Yönetici Paneli: Yönetici kullanıcılarının içerikleri PUT /api/content endpointi üzerinden düzenlemesini sağlayacak arayüzü oluştur.

3.3. API Entegrasyonu ve State Yönetimi
[x] axios kullanarak frontend'den backend API'lerine istek atacak yardımcı fonksiyonları (utils) yaz.

[x] React Context API veya basit state hook'larını kullanarak sayfa verilerini ve kullanıcı oturumunu yönet.

[x] Tüm sayfaların dinamik içeriğini (metinler, görseller) ilgili backend API'lerinden çekmesini sağla.

[x] İletişim formunun POST isteği atmasını ve kullanıcıya geri bildirim vermesini sağla.

4. Kullanıcı Deneyimi, Güvenlik ve Test
[ ] Mobil Uyumluluk: Mobile First yaklaşımına sadık kalarak tüm sayfaların farklı cihazlarda (mobil, tablet, masaüstü) duyarlı görünümünü kontrol et ve gerekli düzenlemeleri yap.

[ ] Erişilebilirlik: WCAG 2.1 AA standartları doğrultusunda renk kontrastları, klavye navigasyonu ve ekran okuyucu etiketlerini kontrol et.

[ ] Güvenlik:

[ ] Formlarda spam koruması (reCAPTCHA veya benzeri) uygulamasını entegre et.

[ ] XSS ve CSRF gibi web güvenlik zafiyetlerine karşı gerekli önlemleri al.

[ ] Test:

[ ] Tüm API endpointlerini manuel olarak test et.

[ ] Tarayıcılar arası uyumluluğu (Chrome, Firefox, Safari) test et.

[ ] Fonksiyonel testleri (form gönderimi, navigasyon, butonlar) tamamla.

5. Dağıtım ve Optimizasyon
[ ] Üretim ortamı için gerekli ayarları (.env.production) yap.

[ ] Görsel ve statik dosyaları sıkıştırarak performans optimizasyonu yap.

[ ] Projeyi bir hosting servisine (örn. Vercel/Netlify ve Heroku/Render) dağıtıma hazırla.

[ ] SEO Optimizasyonu: Meta etiketler, Open Graph ayarları, sitemap.xml ve robots.txt dosyalarını hazırla.