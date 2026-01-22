# Fitur Rating & Komentar Produk

## 📋 Ringkasan
Fitur ini memungkinkan pembeli memberikan rating (1-5 bintang) dan komentar untuk produk yang sudah diterima (status: delivered).

## 🎯 Cara Menggunakan

### Untuk Pembeli (Customer)
1. Buka halaman **Detail Pesanan** dari pesanan yang sudah selesai (status: Delivered)
2. Pada setiap item pesanan, akan muncul tombol **"⭐ Beri Rating & Komentar"**
3. Klik tombol tersebut untuk membuka modal review
4. Pilih rating (1-5 bintang) dengan klik pada bintang
5. Tulis komentar Anda tentang produk (wajib diisi)
6. Klik **"✨ Kirim Review"**
7. Setelah review dikirim, item akan menampilkan badge **"✅ Sudah Direview"**

### Catatan Penting
- ✅ Review hanya bisa diberikan untuk pesanan dengan status **Delivered**
- ✅ Setiap item hanya bisa direview **satu kali**
- ✅ Komentar wajib diisi (minimal 1 karakter)
- ✅ Review otomatis ditandai sebagai "Verified Purchase"
- ✅ Rating produk akan otomatis terupdate setelah review dikirim

## 🛠️ Perubahan Teknis

### Database
1. **Tabel order_items** - Ditambahkan kolom:
   - `is_reviewed` (TINYINT) - Status apakah item sudah direview
   - `review_id` (INT) - Foreign key ke tabel reviews

2. **Tabel reviews** - Sudah ada dengan struktur:
   - `id`, `product_id`, `user_id`, `order_id`
   - `rating` (1-5), `comment`, `is_verified_purchase`
   - `created_at`, `updated_at`

### Backend (API Endpoints)
- `POST /api/orders/reviews` - Submit review baru
- `GET /api/orders/:id/reviews` - Get order dengan status review

### Frontend
- **OrderDetail.jsx** - Ditambahkan:
  - State management untuk review modal
  - Tombol review per item (hanya untuk status delivered & belum direview)
  - Modal review dengan rating bintang dan textarea komentar
  - Integrasi dengan API review

### Model Baru
- **Review.js** - Model untuk handle operasi review:
  - `create()` - Buat review baru
  - `canReview()` - Validasi apakah user bisa review
  - `getProductStats()` - Hitung statistik rating produk
  - `isItemReviewed()` - Cek status review item

## 📝 Migrasi Database
Jalankan SQL script berikut untuk update database:
```bash
mysql -u root -p stylehub < database/add_review_tracking.sql
```

Atau manual via MySQL client/phpMyAdmin:
```sql
USE stylehub;

ALTER TABLE order_items 
ADD COLUMN is_reviewed TINYINT(1) DEFAULT 0 AFTER subtotal,
ADD COLUMN review_id INT(11) NULL AFTER is_reviewed,
ADD KEY idx_review (review_id),
ADD CONSTRAINT order_items_review_fk 
  FOREIGN KEY (review_id) 
  REFERENCES reviews(id) 
  ON DELETE SET NULL;

ALTER TABLE order_items ADD INDEX idx_is_reviewed (is_reviewed);
```

## 🚀 Testing
1. Buat order baru atau gunakan order yang sudah ada
2. Ubah status order menjadi **"delivered"** (via Admin Dashboard)
3. Login sebagai pembeli yang membuat order tersebut
4. Buka halaman detail order
5. Klik tombol "Beri Rating & Komentar" pada salah satu item
6. Isi rating dan komentar, lalu submit
7. Verifikasi bahwa item menampilkan badge "Sudah Direview"
8. Cek di halaman produk bahwa rating terupdate

## 🎨 UI Features
- ⭐ Rating interaktif dengan 5 bintang (hover effect)
- 💬 Textarea untuk komentar (max 500 karakter)
- 🎯 Validasi real-time (tombol disabled jika komentar kosong)
- ✨ Loading state saat submit review
- 🎨 Design konsisten dengan tema aplikasi (gradient purple/pink)
- 📱 Responsive modal design

## 🔐 Security
- ✅ Protected route - Hanya user yang login
- ✅ Validasi ownership - User hanya bisa review pesanan sendiri
- ✅ Status validation - Hanya delivered orders yang bisa direview
- ✅ Duplicate prevention - Item hanya bisa direview sekali
- ✅ Auto-mark as verified purchase

## 📊 Fitur Otomatis
- Rating produk otomatis dihitung ulang setiap ada review baru
- Review count otomatis terupdate
- Order item otomatis ditandai sebagai "reviewed"
- Link antara review dan order item untuk tracking
