# Teacher Attendance Frontend

Bu proje, öğretmenlerin yoklama yönetimi için modern bir React frontend uygulamasıdır.

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

2. Ortam değişkenlerini ayarlayın:

`.env` dosyasını oluşturun veya `.env.example` dosyasını kopyalayın:

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_NODE_ENV=development
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
# veya
yarn dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Komutlar

- `npm run dev`: Geliştirme sunucusunu başlatır
- `npm run build`: Üretim için derleme yapar
- `npm run build:analyze`: Bundle analizi ile derleme yapar
- `npm run build:prod`: Üretim ortamı için optimize edilmiş derleme yapar
- `npm run preview`: Derlenmiş uygulamayı önizleme için çalıştırır
- `npm run test`: Testleri çalıştırır
- `npm run test:coverage`: Test kapsamı raporu ile testleri çalıştırır
- `npm run lint`: Kod kalitesi kontrolü yapar
- `npm run lint:fix`: Kod kalitesi sorunlarını otomatik düzeltir

## Proje Yapısı

```
frontend/
├── public/             # Statik dosyalar
├── src/                # Kaynak kodları
│   ├── assets/         # Resimler, fontlar vb.
│   ├── components/     # Yeniden kullanılabilir bileşenler
│   ├── context/        # React context'leri
│   ├── hooks/          # Özel React hook'ları
│   ├── pages/          # Sayfa bileşenleri
│   ├── services/       # API servisleri
│   ├── styles/         # CSS ve stil dosyaları
│   ├── utils/          # Yardımcı fonksiyonlar
│   ├── App.jsx         # Ana uygulama bileşeni
│   ├── main.jsx        # Uygulama giriş noktası
│   └── routes.jsx      # Rota yapılandırması
├── .env                # Ortam değişkenleri
├── index.html          # HTML şablonu
├── package.json        # Bağımlılıklar ve komutlar
└── vite.config.js      # Vite yapılandırması
```

## Özellikler

- Kimlik doğrulama ve kullanıcı yönetimi
- Ders ve yoklama yönetimi
- Akademik takvim entegrasyonu
- Raporlama ve dışa aktarma
- Duyarlı tasarım
- Performans optimizasyonları
- Kapsamlı hata işleme

## Geliştirme Notları

- Proje Vite ile oluşturulmuştur
- React 18 kullanılmaktadır
- Rota tabanlı kod bölme ve lazy loading uygulanmıştır
- API yanıtları için önbellek stratejileri mevcuttur
- Erişilebilirlik özellikleri eklenmiştir
- Tarayıcı uyumluluğu için yardımcı fonksiyonlar bulunmaktadır
