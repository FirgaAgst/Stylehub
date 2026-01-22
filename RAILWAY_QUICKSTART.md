# 🚀 QUICK START - Railway Deployment

Langkah cepat untuk deploy StyleHub ke Railway + Netlify (15 menit).

---

## 📦 Yang Sudah Disiapkan

✅ File konfigurasi Railway (`backend/railway.json`, `backend/nixpacks.toml`)  
✅ Database config untuk Railway (`backend/config/database.js`)  
✅ Database init script (`database/railway-init.sql`)  
✅ Frontend config (`frontend/netlify.toml`)  
✅ Environment variables template

---

## ⚡ Quick Steps

### 1️⃣ Deploy Backend (5 menit)

1. Login ke [railway.app](https://railway.app) dengan GitHub
2. **New Project** → **Deploy from GitHub repo** → Pilih repo **stylehub**
3. **New** → **Database** → **Add MySQL**
4. Klik service backend → **Settings** → Set:
   - Root Directory: `backend`
   - Start Command: `node server.js`
5. Tab **Variables** → Add:
```env
NODE_ENV=production
JWT_SECRET=ganti-dengan-random-string-rahasia
FRONTEND_URL=https://temporary.com
```
6. Tab **Settings** → **Domains** → **Generate Domain**
7. Copy URL backend Anda

### 2️⃣ Setup Database (3 menit)

1. Klik **MySQL service** → Tab **Data** → **Query**
2. Copy isi file `database/railway-init.sql`
3. Paste & Execute

### 3️⃣ Deploy Frontend (5 menit)

1. Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
REACT_APP_IMAGE_URL=https://YOUR-RAILWAY-URL.up.railway.app/uploads
```

2. Build & Deploy:
```bash
cd frontend
npm install
npm run build
```

3. Login ke [netlify.com](https://netlify.com)
4. **Add new site** → **Deploy manually**
5. Drag & drop folder `build/`
6. Copy URL Netlify Anda

### 4️⃣ Connect (2 menit)

1. Kembali ke Railway → Backend service → **Variables**
2. Update:
```env
FRONTEND_URL=https://YOUR-NETLIFY-URL.netlify.app
```

3. Test di browser: buka Netlify URL Anda

---

## ✅ Done!

- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-app.up.railway.app
- **Admin**: admin@stylehub.com / admin123

📖 **Panduan lengkap**: Lihat [DEPLOYMENT_GUIDE_RAILWAY.md](DEPLOYMENT_GUIDE_RAILWAY.md)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Cannot connect to backend | Update `FRONTEND_URL` di Railway |
| Database error | Cek MySQL service running di Railway |
| 404 on routes | Pastikan `netlify.toml` ada di folder frontend |
| Images not loading | Update `REACT_APP_IMAGE_URL` |

---

**Need help?** Read full guide: [DEPLOYMENT_GUIDE_RAILWAY.md](DEPLOYMENT_GUIDE_RAILWAY.md)
