# 🚀 Quick Start - Deploy ke cPanel

Panduan singkat untuk deployment cepat StyleHub ke cPanel.

## 📦 PERSIAPAN FILES

### 1. Backend
```bash
cd backend
npm install --production
# Zip folder backend (tanpa node_modules)
```

### 2. Frontend
```bash
cd frontend
npm run build
# Zip folder build/
```

### 3. Database
Files sudah ada di `database/schema.sql` dan `database/seed.sql`

---

## 🗂️ STRUKTUR DEPLOYMENT

```
cPanel:
├── public_html/                    ← Frontend (isi folder build/)
│   ├── index.html
│   ├── static/
│   └── .htaccess
│
└── nodejs/stylehub-backend/        ← Backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── uploads/
    ├── server.js
    ├── package.json
    └── .env
```

---

## ⚡ LANGKAH CEPAT

### Database (5 menit)
1. cPanel → MySQL Database Wizard
2. Create database: `stylehub`
3. Create user + assign ALL PRIVILEGES
4. phpMyAdmin → Import `schema.sql` dan `seed.sql`

### Backend (10 menit)
1. Upload `backend.zip` ke `~/nodejs/`
2. Extract → rename ke `stylehub-backend`
3. Copy `.env.production` → rename ke `.env`
4. Edit `.env` dengan data database Anda
5. cPanel → Setup Node.js App
   - App root: `~/nodejs/stylehub-backend`
   - Startup: `server.js`
   - Mode: Production
6. Run NPM Install
7. Start Application

### Frontend (5 menit)
1. Upload isi folder `build/` ke `public_html/`
2. Upload file `.htaccess` ke `public_html/`
3. Done!

---

## ✅ VERIFIKASI

- Backend: `https://yourdomain.com:PORT/health`
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com:PORT/api/products`

---

## 🔑 JANGAN LUPA!

1. ✅ Ganti `JWT_SECRET` di `.env` dengan nilai random
2. ✅ Update `DB_*` credentials di `.env`
3. ✅ Update `FRONTEND_URL` di `.env`
4. ✅ Update URL di `frontend/.env.production` sebelum build
5. ✅ Aktifkan SSL/HTTPS

---

## 🆘 Troubleshooting Cepat

**CORS Error?**
→ Cek `FRONTEND_URL` di backend `.env` + restart app

**API 404?**
→ Cek Node.js App status "Running"

**Database Error?**
→ Cek credentials + prefix `cpanelusername_`

**Images tidak muncul?**
→ Upload folder `uploads/` + set permission 755

---

Untuk panduan lengkap: Baca [DEPLOYMENT_GUIDE_CPANEL.md](DEPLOYMENT_GUIDE_CPANEL.md)
