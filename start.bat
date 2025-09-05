@echo off
echo Baybar Kurumsal Tanıtım Sitesi - Başlatma Scripti
echo ================================================

echo.
echo 1. Backend sunucusunu başlatıyor...
start "Backend Server" cmd /k "cd server && npm run dev"

echo.
echo 2. Frontend sunucusunu başlatıyor...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo 3. Veritabanı seed işlemi...
cd server
node seed.js
cd ..

echo.
echo Sunucular başlatıldı!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin Panel: http://localhost:3000/admin
echo.
echo Admin Giriş Bilgileri:
echo Email: admin@baybar.com
echo Şifre: admin123
echo.
pause
