# 🚀 DEPLOYMENT GUIDE - RAILWAY + NETLIFY

Panduan lengkap deploy **StyleHub** menggunakan Railway (Backend + Database) dan Netlify (Frontend).

---

## 📋 Prerequisites

- ✅ Akun [Railway.app](https://railway.app) (daftar dengan GitHub)
- ✅ Akun [Netlify](https://netlify.com) (daftar dengan GitHub)
- ✅ Project sudah di-push ke GitHub repository
- ✅ Git installed di komputer Anda

---

## 🎯 PART 1: Deploy Backend + Database ke Railway

### Step 1: Login ke Railway

1. Buka [railway.app](https://railway.app)
2. Klik **"Login"** → Pilih **"Login with GitHub"**
3. Authorize Railway untuk akses GitHub

### Step 2: Create New Project

1. Di Dashboard Railway, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Cari dan pilih repository **stylehub**
4. Railway akan detect project Anda

### Step 3: Setup MySQL Database

1. Di project Railway, klik **"New"** → **"Database"** → **"Add MySQL"**
2. Railway akan create MySQL instance (tunggu ~1 menit)
3. MySQL siap digunakan dengan credentials otomatis

### Step 4: Configure Backend Service

1. Klik service **backend** (atau root project)
2. Pergi ke tab **"Variables"**
3. Tambahkan environment variables berikut:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-ganti-ini-random-string
JWT_EXPIRE=7d
UPLOAD_PATH=./uploads/products
MAX_FILE_SIZE=5242880
```

4. **Railway akan otomatis set database variables:**
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

5. Tambahkan satu variable lagi (akan diupdate nanti):
```env
FRONTEND_URL=https://temporary.com
```

### Step 5: Setup Root Directory

1. Di service backend, klik **"Settings"**
2. Scroll ke **"Service"** section
3. Set **Root Directory** = `backend`
4. Set **Start Command** = `node server.js`

### Step 6: Deploy Backend

1. Klik **"Deploy"** atau tunggu auto-deploy
2. Tunggu build selesai (~2-3 menit)
3. Cek logs untuk memastikan "✅ Database connected successfully"

### Step 7: Get Backend URL

1. Di service backend, klik tab **"Settings"**
2. Scroll ke **"Domains"** section
3. Klik **"Generate Domain"**
4. Copy URL yang muncul (contoh: `https://stylehub-backend-production.up.railway.app`)

### Step 8: Initialize Database

**Opsi A: Via Railway MySQL Terminal (Recommended)**

1. Klik service **MySQL** di Railway dashboard
2. Klik tab **"Data"**
3. Klik **"Query"** atau **"Connect"**
4. Copy isi file `database/railway-init.sql` dari project Anda
5. Paste dan Execute query

**Opsi B: Via MySQL Client Lokal**

1. Di Railway MySQL service, klik **"Connect"**
2. Copy connection string
3. Gunakan MySQL Workbench/TablePlus untuk connect
4. Import file `database/schema.sql` dan `database/seed.sql`

### Step 9: Test Backend

Buka di browser:
```
https://your-railway-backend-url.up.railway.app/health
```

Harus return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "..."
}
```

---

## 🎨 PART 2: Deploy Frontend ke Netlify

### Step 1: Update Environment Variables

1. Di folder `frontend/`, edit file `.env.production`:

```env
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app/api
REACT_APP_IMAGE_URL=https://your-railway-backend-url.up.railway.app/uploads
GENERATE_SOURCEMAP=false
```

2. **GANTI** `your-railway-backend-url.up.railway.app` dengan URL Railway Anda dari Step 7 tadi

### Step 2: Build Frontend Locally

```bash
cd frontend
npm install
npm run build
```

Akan create folder `build/` dengan production files.

### Step 3: Deploy ke Netlify

**Opsi A: Drag & Drop (Paling Mudah)**

1. Login ke [netlify.com](https://netlify.com)
2. Klik **"Sites"** → **"Add new site"** → **"Deploy manually"**
3. Drag & drop folder `frontend/build/` ke area upload
4. Tunggu deploy selesai (~1 menit)
5. Netlify akan generate URL (contoh: `https://stylehub-xyz123.netlify.app`)

**Opsi B: Via GitHub (Auto-Deploy)**

1. Login ke Netlify
2. Klik **"Add new site"** → **"Import from Git"**
3. Pilih GitHub → Pilih repository **stylehub**
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
5. Klik **"Deploy site"**

### Step 4: Configure Netlify Environment Variables

1. Di Netlify site, klik **"Site settings"** → **"Environment variables"**
2. Add variables:

```env
REACT_APP_API_URL=https://your-railway-backend-url.up.railway.app/api
REACT_APP_IMAGE_URL=https://your-railway-backend-url.up.railway.app/uploads
GENERATE_SOURCEMAP=false
```

3. Klik **"Deploys"** → **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## 🔗 PART 3: Connect Frontend & Backend

### Step 1: Update Backend CORS

1. Kembali ke Railway dashboard
2. Klik service **backend**
3. Klik tab **"Variables"**
4. Update variable `FRONTEND_URL`:

```env
FRONTEND_URL=https://your-netlify-app.netlify.app
```

5. **GANTI** dengan URL Netlify Anda dari Part 2 Step 3

### Step 2: Redeploy Backend

Railway akan auto-redeploy setelah update variable. Tunggu ~1 menit.

### Step 3: Test Complete Application

1. Buka frontend URL: `https://your-netlify-app.netlify.app`
2. Test fitur:
   - ✅ Login/Register
   - ✅ Browse products
   - ✅ Add to cart
   - ✅ Checkout
   - ✅ Admin dashboard (login: admin@stylehub.com, password: admin123)

---

## 🎉 SELESAI!

Your app is now live:
- **Frontend**: `https://your-netlify-app.netlify.app`
- **Backend API**: `https://your-railway-backend.up.railway.app`
- **Database**: Managed by Railway MySQL

---

## 📊 Monitoring & Maintenance

### Railway Dashboard
- **Logs**: Cek error di tab "Deployments" → klik deployment → lihat logs
- **Metrics**: Monitor CPU, Memory, Network usage
- **Database**: Cek data di MySQL "Data" tab

### Netlify Dashboard
- **Deploy logs**: Cek build errors
- **Analytics**: Lihat traffic & performance
- **Forms**: Jika ada contact form

---

## 🔧 Troubleshooting

### ❌ Backend Error: Database Connection Failed

**Solusi:**
1. Cek Railway MySQL service masih running
2. Verify database credentials di Variables
3. Restart backend service

### ❌ Frontend Error: Network Error / Cannot Connect to Backend

**Solusi:**
1. Cek CORS settings di backend
2. Verify `FRONTEND_URL` di Railway backend variables
3. Verify `REACT_APP_API_URL` di Netlify environment variables
4. Clear browser cache & hard reload (Ctrl + Shift + R)

### ❌ 404 Error on Frontend Routes

**Solusi:**
1. Pastikan file `netlify.toml` ada di folder `frontend/`
2. Redeploy frontend

### ❌ Images Not Loading

**Solusi:**
1. Verify `REACT_APP_IMAGE_URL` pointing to Railway backend
2. Cek folder `uploads/` ada di Railway backend
3. Upload images via admin dashboard

### ❌ Railway Credit Running Out

**Solusi:**
1. Monitor usage di Railway dashboard
2. Optimize database queries
3. Reduce API calls di frontend
4. Upgrade plan jika perlu ($5/month hobby plan)

---

## 💰 Cost Estimation

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| **Railway** | Hobby | $5/month | Includes $5 credit |
| **Netlify** | Free | $0 | 100GB bandwidth/month |
| **Total** | | **~$0-5/month** | Gratis untuk 1-2 bulan |

Railway free $5 credit cukup untuk:
- Development & testing
- Presentasi tugas kuliah
- Demo untuk 1-2 bulan

---

## 🚀 Optional: Custom Domain

### Netlify (Frontend)
1. Beli domain (Niagahoster, Namecheap, dll)
2. Di Netlify: **Domain settings** → **Add custom domain**
3. Update DNS records sesuai instruksi Netlify

### Railway (Backend)
1. Di Railway: **Settings** → **Domains** → **Custom Domain**
2. Add subdomain `api.yourdomain.com`
3. Update DNS CNAME record

---

## 📝 Environment Variables Checklist

### Backend (Railway)
```env
✅ NODE_ENV=production
✅ PORT=5000
✅ JWT_SECRET=random-secret-key
✅ JWT_EXPIRE=7d
✅ UPLOAD_PATH=./uploads/products
✅ MAX_FILE_SIZE=5242880
✅ FRONTEND_URL=https://your-netlify-url.netlify.app
✅ MYSQLHOST (auto from Railway)
✅ MYSQLPORT (auto from Railway)
✅ MYSQLUSER (auto from Railway)
✅ MYSQLPASSWORD (auto from Railway)
✅ MYSQLDATABASE (auto from Railway)
```

### Frontend (Netlify)
```env
✅ REACT_APP_API_URL=https://your-railway-url.up.railway.app/api
✅ REACT_APP_IMAGE_URL=https://your-railway-url.up.railway.app/uploads
✅ GENERATE_SOURCEMAP=false
```

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Netlify Docs**: https://docs.netlify.com
- **Project Issues**: Create issue di GitHub repo

---

**Good luck with your deployment! 🎉**

_Last updated: January 2026_
