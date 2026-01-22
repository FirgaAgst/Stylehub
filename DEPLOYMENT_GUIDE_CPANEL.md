# 🚀 PANDUAN LENGKAP DEPLOY STYLEHUB KE CPANEL

Panduan step-by-step untuk deploy aplikasi StyleHub (React + Node.js + MySQL) ke hosting cPanel.

---

## 📋 PERSIAPAN AWAL

### Yang Dibutuhkan:
- ✅ Akses cPanel dengan Node.js support
- ✅ Domain atau subdomain aktif
- ✅ FTP/File Manager access
- ✅ Terminal SSH access (opsional tapi disarankan)
- ✅ MySQL database di cPanel

### Informasi yang Perlu Disiapkan:
1. **Domain**: `yourdomain.com`
2. **cPanel Username**: `cpanelusername`
3. **Database Name**: `cpanelusername_stylehub`
4. **Database User**: `cpanelusername_stylehub`
5. **Database Password**: (buat password yang kuat)

---

## 🗄️ BAGIAN 1: SETUP DATABASE

### 1.1 Buat Database MySQL
1. Login ke cPanel
2. Cari menu **"MySQL® Database Wizard"** atau **"MySQL® Databases"**
3. Klik **"Create New Database"**
   - Database Name: `stylehub` (akan jadi: `cpanelusername_stylehub`)
   - Klik **"Create Database"**

### 1.2 Buat Database User
1. Masih di halaman MySQL Databases
2. Bagian **"MySQL Users"**, klik **"Add New User"**
   - Username: `stylehub` (akan jadi: `cpanelusername_stylehub`)
   - Password: (generate strong password atau buat sendiri)
   - Klik **"Create User"**

### 1.3 Assign User ke Database
1. Bagian **"Add User to Database"**
2. Pilih User: `cpanelusername_stylehub`
3. Pilih Database: `cpanelusername_stylehub`
4. Klik **"Add"**
5. Pilih **"ALL PRIVILEGES"**
6. Klik **"Make Changes"**

### 1.4 Import Database Schema
1. Buka **phpMyAdmin** dari cPanel
2. Pilih database `cpanelusername_stylehub`
3. Klik tab **"Import"**
4. Pilih file `database/schema.sql` dari project Anda
5. Klik **"Go"**
6. Ulangi untuk file `database/seed.sql`

**✅ VERIFIKASI**: Pastikan ada tabel: `users`, `products`, `orders`, `reviews`

---

## 🖥️ BAGIAN 2: SETUP BACKEND (NODE.JS)

### 2.1 Build Project di Local (Opsional)
```bash
# Di folder project lokal
cd backend
npm install --production
```

### 2.2 Compress Backend
1. Buat file ZIP dari folder `backend/` (TANPA node_modules)
2. Nama: `stylehub-backend.zip`

**Files yang harus ada dalam ZIP:**
```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
├── package.json
└── .env.production (rename ke .env setelah upload)
```

### 2.3 Upload Backend ke cPanel
**Via File Manager:**
1. Login ke cPanel
2. Buka **"File Manager"**
3. Navigasi ke **home directory** (bukan public_html)
4. Buat folder baru: `nodejs` atau `applications`
5. Masuk ke folder tersebut
6. Upload `stylehub-backend.zip`
7. Extract file ZIP
8. Rename hasil extract menjadi `stylehub-backend`

**Via FTP:**
1. Connect ke FTP
2. Upload folder ke `/home/cpanelusername/nodejs/stylehub-backend/`

### 2.4 Konfigurasi Environment Variables
1. Masuk ke folder backend di File Manager
2. Buka file `.env.production`
3. Rename menjadi `.env`
4. Edit file dan isi dengan data sebenarnya:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration - ISI DENGAN DATA ANDA!
DB_HOST=localhost
DB_USER=cpanelusername_stylehub
DB_PASSWORD=password_database_yang_dibuat_tadi
DB_NAME=cpanelusername_stylehub

# JWT Configuration - GENERATE SECRET KEY BARU!
JWT_SECRET=buatSecretKeyYangSangatKuatDanRandomMinimal32Karakter!@#$%
JWT_EXPIRE=7d

# Upload Configuration
UPLOAD_PATH=./uploads/products
MAX_FILE_SIZE=5242880

# CORS Configuration - ISI DENGAN DOMAIN ANDA!
FRONTEND_URL=https://yourdomain.com
```

**💡 TIPS**: Untuk generate JWT_SECRET yang kuat:
- Buka terminal lokal
- Jalankan: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Copy hasil dan paste ke JWT_SECRET

### 2.5 Setup Node.js Application di cPanel
1. Di cPanel, cari menu **"Setup Node.js App"**
2. Klik **"Create Application"**
3. Isi form:
   - **Node.js version**: Pilih versi terbaru (minimal 14.x)
   - **Application mode**: `Production`
   - **Application root**: `/home/cpanelusername/nodejs/stylehub-backend`
   - **Application URL**: Pilih domain utama Anda
   - **Application startup file**: `server.js`
   - **Port**: Catat port yang diberikan (misal: 5000 atau yang lain)
4. Klik **"Create"**

### 2.6 Install Dependencies

**⚠️ PENTING**: Shared hosting sering punya memory limit rendah yang menyebabkan `npm install` gagal dengan error "out of memory". Gunakan salah satu solusi berikut:

#### **SOLUSI 1: Upload node_modules dari Local (PALING MUDAH)** ✅

Ini cara paling reliable untuk shared hosting:

1. **Di komputer local Anda:**
```bash
cd backend
npm install --production
```

2. **Compress node_modules:**
```bash
# Windows PowerShell
Compress-Archive -Path node_modules -DestinationPath node_modules.zip

# Linux/Mac/Git Bash
zip -r node_modules.zip node_modules/
```

3. **Upload ke cPanel:**
   - Login File Manager cPanel
   - Navigasi ke `/home/cpanelusername/nodejs/stylehub-backend/`
   - Upload `node_modules.zip`
   - Extract file
   - Delete file ZIP setelah extract

#### **SOLUSI 2: Via cPanel Button (Jika Memory Cukup)**

1. Masih di halaman **"Setup Node.js App"**
2. Setelah aplikasi dibuat, akan ada button **"Run NPM Install"**
3. Klik button tersebut (tunggu hingga selesai)

**Jika error "out of memory"**, gunakan Solusi 1 atau 3.

#### **SOLUSI 3: Install via SSH dengan Memory Limit (Advanced)**

Jika punya SSH access:

```bash
cd ~/nodejs/stylehub-backend

# Set memory limit lebih tinggi (jika diizinkan)
NODE_OPTIONS="--max-old-space-size=512" npm install --production

# Atau install tanpa optional dependencies
npm install --production --no-optional

# Atau install satu per satu
npm install express
npm install mysql2
npm install bcryptjs
# ... dst
```

### 2.7 Start Application
1. Di halaman **"Setup Node.js App"**
2. Pastikan status aplikasi **"Running"** (ada tombol hijau)
3. Jika tidak running, klik tombol **"Start"** atau **"Restart"**

**✅ VERIFIKASI**: 
- Buka browser: `https://yourdomain.com:PORT/health`
- Seharusnya muncul: `{"status":"OK","message":"Server is running",...}`

### 2.8 Setup Proxy (Opsional tapi Disarankan)
Agar API bisa diakses tanpa port (misal: `/api` bukan `:5000/api`), buat file `.htaccess` di `public_html`:

```apache
# Proxy untuk Node.js API
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Redirect API requests ke Node.js
  RewriteCond %{REQUEST_URI} ^/api/ [OR]
  RewriteCond %{REQUEST_URI} ^/uploads/
  RewriteRule ^(.*)$ http://localhost:5000/$1 [P,L]
</IfModule>
```

---

## 🎨 BAGIAN 3: SETUP FRONTEND (REACT)

### 3.1 Konfigurasi Environment Variables (di Local)
1. Buka file `frontend/.env.production`
2. Edit dan sesuaikan dengan setup Anda:

```env
# Jika pakai proxy .htaccess (tanpa port):
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_IMAGE_URL=https://yourdomain.com/uploads

# Atau jika langsung ke port Node.js:
# REACT_APP_API_URL=https://yourdomain.com:5000/api
# REACT_APP_IMAGE_URL=https://yourdomain.com:5000/uploads
```

### 3.2 Build Production di Local
```bash
# Di folder project
cd frontend

# Install dependencies (jika belum)
npm install

# Build untuk production
npm run build
```

**✅ CECK**: Seharusnya muncul folder `build/` di dalam folder frontend

### 3.3 Upload Frontend ke cPanel
1. Compress folder `build/` menjadi `frontend-build.zip`
2. Login ke cPanel File Manager
3. Navigasi ke **`public_html`** (atau folder domain Anda)
4. Hapus file default (index.html, dll) jika ada
5. Upload `frontend-build.zip`
6. Extract file ZIP
7. Pindahkan **semua isi** folder `build/` ke `public_html/` (bukan foldernya)

**Struktur akhir public_html:**
```
public_html/
├── index.html
├── favicon.ico
├── manifest.json
├── asset-manifest.json
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── .htaccess (sudah ada dari file yang kita buat)
```

### 3.4 Upload File .htaccess
1. Upload file `frontend/.htaccess` ke `public_html/`
2. Pastikan file ter-upload (mungkin hidden, aktifkan "Show Hidden Files")

---

## 📁 BAGIAN 4: UPLOAD FOLDER UPLOADS

### 4.1 Siapkan Folder Uploads
Folder `uploads/` berisi gambar produk yang perlu di-upload ke server.

### 4.2 Upload ke Backend
1. Buka File Manager cPanel
2. Navigasi ke `/home/cpanelusername/nodejs/stylehub-backend/`
3. Upload folder `uploads/` dari project lokal
4. Pastikan struktur tetap:
   ```
   uploads/
   ├── products/
   │   └── p.avif
   └── aset_bro/
   ```

### 4.3 Set Permission
1. Klik kanan folder `uploads/`
2. Pilih **"Change Permissions"**
3. Set permission ke **755** atau **775**
4. Apply to subdirectories

---

## 🧪 BAGIAN 5: TESTING & VERIFIKASI

### 5.1 Test Backend API
Buka browser dan test endpoint berikut:

**Health Check:**
```
https://yourdomain.com:5000/health
```
Expected: `{"status":"OK",...}`

**API Test:**
```
https://yourdomain.com:5000/api/test
```
Expected: `{"success":true,"message":"API is working!"}`

**Get Products:**
```
https://yourdomain.com:5000/api/products
```
Expected: JSON array produk

### 5.2 Test Frontend
1. Buka: `https://yourdomain.com`
2. Pastikan halaman home muncul
3. Test navigasi (produk, cart, login, dll)
4. Test login/register
5. Test add to cart
6. Test checkout

### 5.3 Test Upload Images
1. Login sebagai admin
2. Coba upload gambar produk baru
3. Pastikan gambar muncul

### 5.4 Check Browser Console
1. Buka Developer Tools (F12)
2. Tab Console
3. Pastikan tidak ada error merah
4. Jika ada CORS error, cek konfigurasi CORS di backend

---

## 🐛 TROUBLESHOOTING

### Problem 1: Cannot connect to database
**Solusi:**
- Cek credentials di `.env` backend
- Pastikan database name sudah include prefix: `cpanelusername_`
- Test koneksi via phpMyAdmin
- Cek user privileges

### Problem 2: CORS Error di Frontend
**Solusi:**
- Pastikan `FRONTEND_URL` di `.env` backend sudah benar
- Restart Node.js app di cPanel
- Clear browser cache

### Problem 3: Node.js App tidak running
**Solusi:**
- Cek logs di cPanel Node.js App section
- Pastikan `node_modules` ter-install (run npm install lagi)
- Cek file `server.js` tidak ada syntax error
- Restart aplikasi

### Problem 4: Images tidak muncul
**Solusi:**
- Cek permission folder `uploads/` (755 atau 775)
- Cek URL di `.env.production` frontend
- Pastikan path di backend config benar

### Problem 5: 404 Error di React Routes
**Solusi:**
- Pastikan `.htaccess` ada di `public_html/`
- Cek syntax `.htaccess` tidak ada typo
- Restart Apache (biasanya otomatis)

### Problem 6: API 500 Error
**Solusi:**
- Cek error logs di Node.js App di cPanel
- Atau via SSH: `cd ~/nodejs/stylehub-backend && npm start` (lihat error langsung)
- Biasanya karena database connection atau missing dependencies

### Problem 7: npm install "Out of Memory" Error
**Error:**
```
Fatal process out of memory: Failed to reserve memory for new V8 Isolate
```

**Solusi (Pilih salah satu):**

**A. Upload node_modules dari Local (RECOMMENDED):**
1. Install di local: `cd backend && npm install --production`
2. Zip folder node_modules
3. Upload ke server via File Manager
4. Extract di folder backend

**B. Upgrade Node.js Version:**
- Node.js 16 atau 18 lebih efficient dengan memory
- Ganti di Setup Node.js App settings

**C. Request Memory Limit Increase:**
- Hubungi hosting support
- Request increase PHP/Node memory limit
- Atau upgrade ke plan yang lebih tinggi

**D. Install Dependencies Minimal:**
```bash
# Via SSH
cd ~/nodejs/stylehub-backend
npm install --production --no-optional --prefer-offline
```

---

## 🔐 KEAMANAN (PENTING!)

### 1. Ganti JWT_SECRET
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Setup SSL/HTTPS
- Di cPanel, aktifkan **"SSL/TLS"** atau **"Let's Encrypt"**
- Pastikan domain sudah HTTPS

### 3. Protect .env File
Tambahkan di `.htaccess` backend (jika ada web access):
```apache
<Files ".env">
    Order allow,deny
    Deny from all
</Files>
```

### 4. Update Dependencies
```bash
npm audit
npm audit fix
```

### 5. Disable Directory Listing
Di `.htaccess`:
```apache
Options -Indexes
```

---

## 📊 MONITORING & MAINTENANCE

### Cek Status Aplikasi
1. Login cPanel
2. Buka **"Setup Node.js App"**
3. Lihat status (Running/Stopped)

### Restart Aplikasi
1. Klik tombol **"Restart"** di Node.js App
2. Atau via SSH:
```bash
cd ~/nodejs/stylehub-backend
touch tmp/restart.txt
```

### View Logs
**Via cPanel:**
- Masuk ke Node.js App settings
- Klik "Open Logs"

**Via SSH:**
```bash
cd ~/nodejs/stylehub-backend
pm2 logs stylehub  # Jika pakai PM2
# atau
tail -f logs/error.log  # Jika ada file log
```

### Backup
**Database:**
1. phpMyAdmin > Export > SQL
2. Download file

**Files:**
1. File Manager > Compress > Download
2. Atau pakai FTP

---

## 🚀 DEPLOYMENT CHECKLIST

Sebelum go-live, pastikan semua sudah dicentang:

**Database:**
- [ ] Database sudah dibuat
- [ ] User sudah dibuat dan assign ke database
- [ ] Schema sudah di-import
- [ ] Seed data sudah di-import
- [ ] Test query berjalan

**Backend:**
- [ ] Files sudah di-upload
- [ ] `.env` sudah dikonfigurasi dengan benar
- [ ] Dependencies sudah ter-install
- [ ] Node.js app sudah dibuat di cPanel
- [ ] App status "Running"
- [ ] Health check endpoint berfungsi
- [ ] API endpoints berfungsi

**Frontend:**
- [ ] Build production sudah dibuat
- [ ] Files build sudah di-upload ke public_html
- [ ] `.htaccess` sudah di-upload
- [ ] `.env.production` sudah dikonfigurasi
- [ ] Website bisa diakses
- [ ] Routing React berfungsi

**Testing:**
- [ ] Login/Register berfungsi
- [ ] Product listing muncul
- [ ] Product detail berfungsi
- [ ] Add to cart berfungsi
- [ ] Checkout berfungsi
- [ ] Admin dashboard accessible
- [ ] Image upload berfungsi
- [ ] No CORS errors

**Security:**
- [ ] SSL/HTTPS aktif
- [ ] JWT_SECRET sudah diganti
- [ ] Database password kuat
- [ ] .env files protected
- [ ] Dependencies up-to-date

---

## 📞 SUPPORT

Jika mengalami kesulitan:
1. Cek error logs di Node.js App
2. Cek browser console untuk frontend errors
3. Test API endpoints satu per satu
4. Hubungi support hosting untuk masalah server

---

## 📝 CATATAN PENTING

1. **Port Number**: Catat port yang diberikan cPanel untuk Node.js app
2. **Database Prefix**: Selalu tambahkan `cpanelusername_` sebelum nama database
3. **File Permissions**: uploads folder harus 755 atau 775
4. **Node Version**: Pastikan minimal Node.js 14.x
5. **Memory Limit**: Shared hosting mungkin punya limit, pantau resource usage

---

## 🎉 SELESAI!

Website StyleHub Anda sekarang sudah live di:
**https://yourdomain.com**

Selamat! 🚀

---

*Dibuat pada: 22 Januari 2026*
*Project: StyleHub E-commerce*
