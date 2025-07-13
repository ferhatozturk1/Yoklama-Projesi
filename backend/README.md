# Backend - Django API

Bu klasör Django backend API'sini içerecek.

## Kurulum

```bash
# Virtual environment oluştur
python -m venv venv

# Virtual environment'ı aktifleştir
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Gerekli paketleri yükle
pip install django djangorestframework django-cors-headers

# Django projesini başlat
django-admin startproject yoklama_backend .

# Migrations çalıştır
python manage.py migrate

# Sunucuyu başlat
python manage.py runserver
```

## API Endpoints

- `/api/auth/` - Kimlik doğrulama
- `/api/students/` - Öğrenci işlemleri
- `/api/teachers/` - Öğretmen işlemleri
- `/api/attendance/` - Yoklama işlemleri
