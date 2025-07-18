# Teacher Attendance Frontend

Bu proje, akademik personel için yoklama yönetim sistemi frontend uygulamasıdır.

## Özellikler

- 🔐 Kullanıcı kimlik doğrulama ve kayıt
- 👤 Profil yönetimi
- 📅 Haftalık ders programı oluşturma
- 📚 Ders yönetimi
- ✅ Yoklama alma ve takip
- 📊 Raporlama ve dışa aktarma
- 📱 Responsive tasarım

## Teknolojiler

- React 18+
- React Router v6
- Axios
- Formik & Yup
- jsPDF
- React Toastify
- Date-fns
- Vite

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda `http://localhost:3000` adresini açın.

## Demo Kullanımı

Backend henüz hazır olmadığı için uygulama demo modunda çalışmaktadır:

### Giriş Yapma
- Herhangi bir geçerli e-posta adresi (örn: `demo@example.com`)
- En az 3 karakter uzunluğunda bir şifre (örn: `123456`)
- Bu bilgilerle giriş yapabilir ve dashboard'u görüntüleyebilirsiniz

### Test Kullanıcısı
- E-posta: `demo@example.com`
- Şifre: `123456`
- Bu bilgilerle giriş yaptığınızda demo kullanıcı profili yüklenecektir

## Proje Yapısı

```
src/
├── assets/          # Görseller, ikonlar
├── components/      # React bileşenleri
│   ├── common/      # Ortak bileşenler
│   ├── layout/      # Sayfa düzeni bileşenleri
│   ├── dashboard/   # Ana panel bileşenleri
│   ├── profile/     # Profil bileşenleri
│   └── course/      # Ders bileşenleri
├── context/         # React Context providers
├── pages/           # Sayfa bileşenleri
├── services/        # API servisleri
├── utils/           # Yardımcı fonksiyonlar
└── routes.jsx       # Yönlendirme yapılandırması
```

## Geliştirme

### Yeni Bileşen Ekleme

1. İlgili klasörde bileşen dosyasını oluşturun
2. Bileşeni export edin
3. Gerekirse route'lara ekleyin

### API Entegrasyonu

API servisleri `src/services/` klasöründe tanımlanmıştır. Backend hazır olduğunda bu servisler otomatik olarak çalışacaktır.

### Stil Düzenleme

- Global stiller: `src/index.css`
- Bileşen stilleri: CSS Modules veya Styled Components
- Utility classes: `src/App.css`

## Build

Üretim için build almak:

```bash
npm run build
```

## Test

Testleri çalıştırmak:

```bash
npm test
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.