<<<<<<< HEAD
# 🎨 Frontend - React Uygulaması

Yoklama projesi için React tabanlı kullanıcı arayüzü.

## 🚀 Teknolojiler

- **React** 18.2.0
- **Material-UI (MUI)** 5.x - Modern UI bileşenleri
- **React Router DOM** 6.x - Sayfa yönlendirme
- **HTML2Canvas** - PDF oluşturma
- **jsPDF** - PDF indirme
- **XLSX** - Excel dosya işlemleri

## 📁 Proje Yapısı

```
frontend/
├── public/
│   └── index.html          # Ana HTML dosyası
├── src/
│   ├── components/         # React bileşenleri
│   │   ├── GirisYap.js    # Giriş sayfası
│   │   ├── KayitOl.js     # Kayıt sayfası
│   │   ├── Hosgeldiniz.js # Ana sayfa
│   │   ├── OgrenciKayit.js    # Öğrenci kayıt
│   │   ├── OgrenciPanel.js    # Öğrenci paneli
│   │   ├── OgretmenKayit.js   # Öğretmen kayıt
│   │   └── OgretmenPanel.js   # Öğretmen paneli
│   ├── App.js             # Ana uygulama bileşeni
│   └── index.js           # React DOM render
├── package.json           # NPM bağımlılıkları
└── README.md             # Bu dosya
```

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 16+ 
- npm veya yarn

### Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start

# Tarayıcıda otomatik olarak açılır: http://localhost:3000
```

### Build Alma
```bash
# Production build oluştur
npm run build

# Build dosyaları build/ klasöründe oluşur
```

## 📱 Sayfalar ve Bileşenler

### 🔐 Kimlik Doğrulama
- **GirisYap.js** - Kullanıcı girişi (öğrenci/öğretmen)
- **KayitOl.js** - Yeni kullanıcı kaydı

### 👥 Kullanıcı Panelleri
- **OgrenciPanel.js** - Öğrenci dashboard'u
- **OgretmenPanel.js** - Öğretmen dashboard'u
- **OgrenciKayit.js** - Öğrenci kayıt formu
- **OgretmenKayit.js** - Öğretmen kayıt formu

### 🏠 Ana Sayfa
- **Hosgeldiniz.js** - Karşılama sayfası ve navigasyon

## 🎨 UI/UX Özellikleri

- ✅ **Responsive tasarım** - Mobil uyumlu
- ✅ **Material Design** - Modern görünüm
- ✅ **Dark/Light tema** desteği
- ✅ **Form validasyonu** - Kullanıcı dostu hatalar
- ✅ **Loading states** - Yükleme animasyonları
- ✅ **Toast bildirimleri** - Başarı/hata mesajları

## 📊 Raporlama Özellikleri

- **PDF Export** - Yoklama listelerini PDF olarak indir
- **Excel Export** - Verileri .xlsx formatında dışa aktar
- **Yazdırma** - Doğrudan tarayıcıdan yazdırma

## 🔧 Geliştirme

### Mevcut Scripts
```bash
npm start      # Geliştirme sunucusu
npm test       # Test çalıştır
npm run build  # Production build
npm run eject  # CRA yapılandırmasını aç (geri alınamaz)
```

### Yeni Bileşen Ekleme
```bash
# src/components/ altına yeni .js dosyası oluştur
# Material-UI bileşenlerini kullan
# React Router ile sayfalar arası geçiş yap
```

## 🌐 API Entegrasyonu

Frontend, backend API'si ile şu endpoint'ler üzerinden iletişim kurar:
- `/api/auth/` - Giriş/çıkış işlemleri
- `/api/students/` - Öğrenci verileri
- `/api/teachers/` - Öğretmen verileri
- `/api/attendance/` - Yoklama verileri

## 🐛 Sorun Giderme

### Port Çakışması
```bash
# Farklı port kullan
PORT=3001 npm start
```

### Node Modules Problemi
```bash
# Cache temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

## 📞 Destek

Geliştirme sırasında sorun yaşarsanız:
1. Console hatalarını kontrol edin
2. Network sekmesini inceleyin
3. React DevTools kullanın
=======
# 📚 Yoklama Projesi

Modern web teknolojileri kullanılarak geliştirilmiş öğrenci yoklama sistemi.

## 🚀 Teknolojiler

### Frontend
- **React** 18.2.0
- **Material-UI** (MUI) 5.x
- **React Router** 6.x
- **HTML2Canvas** - PDF oluşturma
- **XLSX** - Excel dosya işlemleri

### Backend
- **Django** 4.2.x
- **Django REST Framework**
- **SQLite** (geliştirme için)
- **CORS Headers**

## 📁 Proje Yapısı

```
Yoklama-Projesi/
├── frontend/          # React uygulaması
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
├── backend/           # Django API
│   ├── requirements.txt
│   └── README.md
└── .gitignore
```

## 🛠️ Kurulum

### Frontend Kurulumu
```bash
cd frontend
npm install
npm start
```

### Backend Kurulumu
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## 📱 Özellikler

- ✅ Öğrenci kaydı ve girişi
- ✅ Öğretmen kaydı ve girişi
- ✅ Yoklama alma sistemi
- ✅ PDF rapor oluşturma
- ✅ Excel dosya dışa aktarma
- ✅ Modern ve responsive tasarım

## 🎯 Kullanım

1. **Öğretmen** hesabı oluşturun
2. **Öğrenci** hesapları ekleyin
3. **Yoklama** alın
4. **Rapor** oluşturun ve dışa aktarın

## 📞 İletişim

Proje hakkında sorularınız için iletişime geçebilirsiniz.
>>>>>>> c421e655e89991aba47a4180042b418e6d71cecd
