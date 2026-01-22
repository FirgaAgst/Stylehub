# 🛍️ StyleHub - Fashion Marketplace

## 📖 Ringkasan Proyek

**StyleHub** adalah aplikasi e-commerce fashion modern yang dibangun dengan arsitektur full-stack menggunakan **Node.js/Express.js** untuk backend dan **React.js** untuk frontend. Aplikasi ini menyediakan platform lengkap untuk jual-beli produk fashion dengan fitur manajemen produk, sistem pembayaran, dan panel administrasi.

## 📋 Daftar Isi
- [Fitur-Fitur Aplikasi](#-fitur-fitur-aplikasi)
- [Arsitektur & Framework](#-arsitektur--framework)
- [Penjelasan Backend](#-penjelasan-backend)
- [Penjelasan Frontend](#-penjelasan-frontend)
- [Koneksi Backend & Frontend](#-koneksi-backend--frontend)
- [Cara Menjalankan](#-cara-menjalankan)
- [Kesimpulan](#-kesimpulan)

---

## ✨ Fitur-Fitur Aplikasi

### 🛒 Fitur untuk Customer
1. **Autentikasi Pengguna**
   - Registrasi akun baru
   - Login/Logout dengan JWT token
   - Update profil pengguna
   - Ubah password

2. **Manajemen Produk**
   - Browse semua produk dengan pagination
   - Filter produk berdasarkan kategori
   - Search produk berdasarkan nama/deskripsi
   - Lihat detail produk lengkap
   - Sorting produk (terbaru, harga, popularitas)
   - Produk unggulan (featured products)

3. **Shopping Cart**
   - Tambah produk ke keranjang
   - Update jumlah item di keranjang
   - Hapus item dari keranjang
   - Clear semua keranjang

4. **Sistem Pemesanan**
   - Checkout dan buat pesanan
   - Lihat riwayat pesanan
   - Detail pesanan dengan status tracking
   - Cancel pesanan

5. **Fitur Tambahan**
   - Wishlist produk favorit
   - Review dan rating produk
   - Responsive design untuk mobile & desktop
   - Dark theme modern

### 👨‍💼 Fitur untuk Admin
1. **Dashboard Admin**
   - Statistik penjualan
   - Total produk, pesanan, dan pengguna
   - Grafik dan analytics

2. **Manajemen Produk**
   - CRUD produk (Create, Read, Update, Delete)
   - Upload gambar produk
   - Set produk featured
   - Kelola kategori produk
   - Update stock dan harga

3. **Manajemen Pesanan**
   - Lihat semua pesanan
   - Update status pesanan (pending, processing, shipped, delivered, cancelled)
   - Update status pembayaran
   - Hapus pesanan

4. **Manajemen Pengguna**
   - Lihat semua pengguna
   - Update data pengguna
   - Aktifkan/nonaktifkan akun
   - Hapus pengguna

---

## 🏗️ Arsitektur & Framework

### Arsitektur Aplikasi
Aplikasi ini menggunakan arsitektur **Client-Server** dengan pemisahan yang jelas antara backend dan frontend:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                        │
│  React.js + React Router + Context API + Axios             │
│  Port: 3000                                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │ (JSON)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   SERVER (Backend)                          │
│  Node.js + Express.js + Middleware                         │
│  Port: 5000                                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   DATABASE                                  │
│  MySQL 8.0                                                  │
│  Port: 3306                                                 │
└─────────────────────────────────────────────────────────────┘
```

### Framework & Teknologi yang Digunakan

#### 🔧 Backend Framework & Tools
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Node.js** | 20.17.0 | Runtime JavaScript untuk server |
| **Express.js** | 4.18.2 | Web framework untuk membuat REST API |
| **MySQL2** | 3.6.5 | Driver database untuk koneksi ke MySQL |
| **bcryptjs** | 2.4.3 | Hashing password untuk keamanan |
| **jsonwebtoken** | 9.0.2 | Autentikasi berbasis JWT token |
| **Multer** | 1.4.5 | Upload file/gambar produk |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.3.1 | Manajemen environment variables |
| **Express Validator** | 7.0.1 | Validasi input data |

#### 🎨 Frontend Framework & Tools
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React.js** | 18.2.0 | Library UI untuk membangun interface |
| **React Router DOM** | 6.30.2 | Routing dan navigasi halaman |
| **Axios** | 1.13.2 | HTTP client untuk API calls |
| **Lucide React** | 0.553.0 | Icon library untuk UI |
| **React Scripts** | 5.0.1 | Build tools untuk React |
| **Context API** | Built-in | State management global |

#### 🗄️ Database
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **MySQL** | 8.0+ | Relational database untuk menyimpan data |

---

## 🔙 Penjelasan Backend

Backend StyleHub dibangun dengan **Node.js** dan **Express.js** mengikuti pola arsitektur **MVC (Model-View-Controller)** dan **RESTful API** principles.

### Struktur Backend
```
backend/
├── config/
│   └── database.js          # Konfigurasi koneksi MySQL dengan pooling
│
├── controllers/             # Business logic layer
│   ├── adminController.js   # Logic untuk fitur admin
│   ├── authController.js    # Logic autentikasi (register/login)
│   ├── orderController.js   # Logic pemesanan dan cart
│   └── productController.js # Logic manajemen produk
│
├── middleware/              # Middleware layer
│   ├── authMiddleware.js    # Verifikasi JWT token & authorization
│   ├── errorHandler.js      # Global error handling
│   ├── upload.js            # Multer config untuk upload file
│   └── validator.js         # Validasi input dengan express-validator
│
├── models/                  # Data access layer
│   ├── User.js             # Model untuk tabel users
│   ├── Product.js          # Model untuk tabel products
│   └── Order.js            # Model untuk tabel orders
│
├── routes/                  # Route definitions
│   ├── admin.js            # Routes untuk admin (/api/admin/*)
│   ├── auth.js             # Routes untuk auth (/api/auth/*)
│   ├── orders.js           # Routes untuk orders (/api/orders/*)
│   └── products.js         # Routes untuk products (/api/products/*)
│
├── utils/                   # Helper utilities
│   ├── errorHandler.js     # Custom error classes
│   ├── helpers.js          # Helper functions
│   ├── jwt.js              # JWT token generation & verification
│   └── response.js         # Standardized API response format
│
├── uploads/products/        # Folder penyimpanan gambar produk
├── .env                     # Environment variables
├── server.js               # Entry point aplikasi
└── package.json            # Dependencies
```

### Cara Kerja Backend

#### 1. **Entry Point (server.js)**
Server Express.js dimulai di `server.js`, yang melakukan:
- Load environment variables dari `.env`
- Setup middleware (CORS, JSON parser, static files)
- Mount semua routes (auth, products, orders, admin)
- Connect ke database MySQL
- Start server di port 5000

```javascript
// Contoh setup di server.js
const express = require('express');
const cors = require('cors');
const app = express();

// CORS agar frontend bisa akses backend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
```

#### 2. **Database Connection (config/database.js)**
Menggunakan **connection pooling** untuk efisiensi:
```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'stylehub',
    waitForConnections: true,
    connectionLimit: 10
});
```

#### 3. **Models (Data Access Layer)**
Models bertanggung jawab untuk query database. Contoh:
```javascript
// Product.js
class Product {
    static async findAll(filters) {
        const [rows] = await pool.query('SELECT * FROM products WHERE is_active = 1');
        return rows;
    }
    
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }
}
```

#### 4. **Controllers (Business Logic)**
Controllers memproses request dan response. Contoh:
```javascript
// productController.js
exports.getAllProducts = async (req, res) => {
    const products = await Product.findAll();
    res.json({
        success: true,
        data: products
    });
};
```

#### 5. **Routes (API Endpoints)**
Routes mendefinisikan URL endpoints dan menghubungkan dengan controllers:
```javascript
// products.js
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authMiddleware, adminMiddleware, productController.createProduct);
```

#### 6. **Middleware**
- **authMiddleware**: Verifikasi JWT token dari header Authorization
- **upload**: Handle file upload untuk gambar produk
- **validator**: Validasi input (email format, required fields, dll)
- **errorHandler**: Catch dan format semua error

#### 7. **Authentication Flow**
```
1. User Login → POST /api/auth/login
2. Server verify email & password (bcrypt.compare)
3. Generate JWT token dengan user data
4. Return token ke client
5. Client save token di localStorage
6. Setiap request, client kirim token di header: "Authorization: Bearer <token>"
7. Server verify token di authMiddleware
8. Jika valid, lanjutkan ke controller
```

### Database Schema
Backend menggunakan 8 tabel utama:
- **users**: Data pengguna (customer & admin)
- **products**: Katalog produk
- **categories**: Kategori produk
- **orders**: Header pesanan
- **order_items**: Detail item pesanan
- **cart_items**: Item di keranjang
- **reviews**: Review produk
- **wishlist**: Wishlist pengguna

---

## 🎨 Penjelasan Frontend

Frontend StyleHub dibangun dengan **React.js** menggunakan **functional components** dan **hooks** modern.

### Struktur Frontend
```
frontend/src/
├── commponents/              # Reusable components
│   ├── Header.jsx           # Navigation bar
│   ├── Footer.jsx           # Footer component
│   ├── ProductCard.jsx      # Card produk untuk list
│   ├── CategoryFilter.jsx   # Filter kategori
│   ├── LoadingSpinner.jsx   # Loading indicator
│   └── PrivateRoute.jsx     # Protected route wrapper
│
├── context/                  # Global state management
│   ├── AuthContext.jsx      # Authentication state (user, token, login, logout)
│   └── CartContext.jsx      # Shopping cart state (items, add, remove, update)
│
├── pages/                    # Page components (routes)
│   ├── Home.jsx             # Homepage dengan product list
│   ├── Product.jsx          # Halaman produk (alias Home)
│   ├── ProductDetail.jsx    # Detail produk single
│   ├── Cart.jsx             # Shopping cart page
│   ├── Checkout.jsx         # Checkout & payment
│   ├── Order.jsx            # Order history
│   ├── OrderDetail.jsx      # Detail pesanan
│   ├── Login.jsx            # Login form
│   ├── Register.jsx         # Register form
│   ├── AdminDasboard.jsx    # Admin dashboard
│   ├── AdminProducts.jsx    # Admin product management
│   ├── AdminOrders.jsx      # Admin order management
│   └── AdminUsers.jsx       # Admin user management
│
├── services/                 # API service layer
│   ├── Api.js               # Axios instance dengan interceptors
│   ├── AuthService.js       # Auth API calls (login, register, profile)
│   ├── productService.js    # Product API calls
│   ├── orderService.js      # Order API calls
│   └── adminService.js      # Admin API calls
│
├── styles/                   # CSS files
│   ├── variables.css        # CSS custom properties (colors, spacing)
│   ├── global.css           # Global styles & resets
│   ├── custom.css           # Component-specific styles
│   └── responsive.css       # Media queries
│
├── utils/                    # Utility functions
│   ├── constants.js         # Constants (API URLs, etc)
│   └── helpers.js           # Helper functions
│
├── App.jsx                   # Main App component dengan routing
└── index.js                 # React entry point (ReactDOM.render)
```

### Cara Kerja Frontend

#### 1. **Entry Point (index.js)**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

#### 2. **App Component & Routing (App.jsx)**
Menggunakan **React Router v6** untuk navigasi:
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
```

#### 3. **Context API (State Management)**

**AuthContext** - Mengelola state autentikasi:
```javascript
// AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**CartContext** - Mengelola shopping cart:
```javascript
// CartContext.jsx
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };
  
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
```

#### 4. **Services Layer (API Calls)**

**Api.js** - Centralized Axios instance:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**productService.js** - Product API calls:
```javascript
import api from './Api';

export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products/featured');
```

#### 5. **Components**

**Functional Component dengan Hooks**:
```javascript
// ProductCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

#### 6. **Pages (Route Components)**

Example: **Home.jsx** - Product listing page:
```javascript
import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

#### 7. **Styling**
Menggunakan **CSS Modules** dan **CSS Variables**:
```css
/* variables.css */
:root {
  --primary-color: #c026d3;
  --background: #0a0a0a;
  --surface: #1a1a1a;
  --text: #ffffff;
}

/* global.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--background);
  color: var(--text);
  font-family: 'Inter', sans-serif;
}
```

---

## 🔗 Koneksi Backend & Frontend

### Bagaimana Backend dan Frontend Terhubung?

Backend dan frontend berkomunikasi menggunakan **HTTP REST API** dengan format data **JSON**. Berikut alur komunikasinya:

### 1. **Setup Environment Variables**

**Backend (.env)**:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=stylehub
JWT_SECRET=stylehub-super-secret-key-2024
```

**Frontend (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_IMAGE_URL=http://localhost:5000/uploads
```

### 2. **CORS Configuration**

Backend mengizinkan request dari frontend dengan CORS:
```javascript
// backend/server.js
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. **Alur Request-Response**

#### Contoh: User Login

**Frontend (Login.jsx)**:
```javascript
// 1. User input email & password
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // 2. Kirim POST request ke backend
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: password
    });
    
    // 6. Terima response dari backend
    const { token, user } = response.data.data;
    
    // 7. Simpan token di localStorage
    localStorage.setItem('token', token);
    
    // 8. Update state & redirect
    setUser(user);
    navigate('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

**Backend (authController.js)**:
```javascript
// 3. Terima request di controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // 4. Cek user di database & verify password
  const user = await User.findByEmail(email);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // 5. Generate JWT token & kirim response
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  
  res.json({
    success: true,
    data: { token, user }
  });
};
```

#### Contoh: Fetch Products

**Frontend (Home.jsx)**:
```javascript
// 1. Component mount, fetch products
useEffect(() => {
  const fetchProducts = async () => {
    // 2. GET request ke backend
    const response = await axios.get('http://localhost:5000/api/products');
    
    // 5. Update state dengan data dari backend
    setProducts(response.data.data);
  };
  
  fetchProducts();
}, []);
```

**Backend (productController.js)**:
```javascript
// 3. Controller query database
exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll();
  
  // 4. Return JSON response
  res.json({
    success: true,
    data: products
  });
};
```

### 4. **Authentication Flow**

```
┌─────────────┐                          ┌─────────────┐
│  Frontend   │                          │   Backend   │
└──────┬──────┘                          └──────┬──────┘
       │                                         │
       │ 1. POST /api/auth/login                │
       │    { email, password }                 │
       │────────────────────────────────────────>│
       │                                         │
       │                    2. Verify credentials│
       │                    3. Generate JWT      │
       │                                         │
       │ 4. Response: { token, user }           │
       │<────────────────────────────────────────│
       │                                         │
       │ 5. Save token to localStorage          │
       │                                         │
       │ 6. GET /api/products                    │
       │    Header: Authorization: Bearer token  │
       │────────────────────────────────────────>│
       │                                         │
       │                       7. Verify JWT     │
       │                       8. Query database │
       │                                         │
       │ 9. Response: { products }              │
       │<────────────────────────────────────────│
       │                                         │
```

### 5. **Axios Interceptors**

Frontend menggunakan interceptors untuk otomatis menambahkan token ke setiap request:

```javascript
// frontend/src/services/Api.js
api.interceptors.request.use(config => {
  // Ambil token dari localStorage
  const token = localStorage.getItem('token');
  
  // Tambahkan token ke header jika ada
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle error response
api.interceptors.response.use(
  response => response,
  error => {
    // Jika token expired (401), redirect ke login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 6. **API Response Format**

Semua API response menggunakan format standar:

**Success Response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // actual data here
  },
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### 7. **File Upload (Product Images)**

Backend menerima file upload menggunakan **Multer**:
```javascript
// backend/middleware/upload.js
const multer = require('multer');
const storage = multer.diskStorage({
  destination: './uploads/products/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });
```

Frontend mengirim file dengan **FormData**:
```javascript
// frontend - Admin product form
const formData = new FormData();
formData.append('name', productName);
formData.append('price', price);
formData.append('image', imageFile); // File object

await axios.post('/api/admin/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### 8. **Real-time Data Flow**

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - User interactions (clicks, inputs)                    │
│  - Component renders                                     │
│  - State management (Context API)                        │
└────────────┬─────────────────────────────────────────────┘
             │
             │ HTTP Requests (Axios)
             │ - GET, POST, PUT, DELETE
             │ - JSON payload
             │ - JWT token in headers
             │
┌────────────▼─────────────────────────────────────────────┐
│                    Backend (Express)                     │
│  - Routes → Controllers → Models                         │
│  - Middleware (auth, validation, error handling)         │
│  - Business logic                                        │
└────────────┬─────────────────────────────────────────────┘
             │
             │ SQL Queries
             │
┌────────────▼─────────────────────────────────────────────┐
│                    Database (MySQL)                      │
│  - Store & retrieve data                                 │
│  - Relational tables with foreign keys                   │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- **Node.js** versi 18+ 
- **MySQL** versi 8+ 
- **npm** package manager

### 1. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE stylehub;
USE stylehub;

# Import schema & seed data
mysql -u root -p stylehub < database/schema.sql
mysql -u root -p stylehub < database/seed.sql
```


### 2. Setup Backend
```bash
cd backend
npm install
```

Konfigurasi file `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=       # Sesuaikan dengan password MySQL Anda
DB_NAME=stylehub
JWT_SECRET=stylehub-super-secret-key-2024
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Konfigurasi file `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_IMAGE_URL=http://localhost:5000/uploads
```

### 4. Jalankan Aplikasi

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```
Backend berjalan di: `http://localhost:5000`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```
Frontend berjalan di: `http://localhost:3000`

### 5. Default Login

**Admin**:
- Email: `admin@stylehub.com`
- Password: `admin123`

**Customer**:
- Email: `customer@stylehub.com`
- Password: `customer123`

---

## 📊 Kesimpulan

### Rangkuman Aplikasi StyleHub

**StyleHub** adalah platform e-commerce fashion full-stack yang mendemonstrasikan implementasi modern web development dengan pemisahan yang jelas antara client dan server.

### Poin-Poin Penting:

#### 1. **Arsitektur**
- Menggunakan arsitektur **Client-Server** dengan REST API
- Backend sebagai **API Server** yang menyediakan data
- Frontend sebagai **Client** yang mengkonsumsi API
- Database **MySQL** untuk persistent storage

#### 2. **Backend (Node.js + Express.js)**
- RESTful API dengan routing yang terstruktur
- Authentication menggunakan JWT (JSON Web Token)
- Password encryption dengan bcrypt
- File upload dengan Multer
- Error handling yang comprehensive
- Database connection pooling untuk performa
- Middleware-based architecture

#### 3. **Frontend (React.js)**
- Single Page Application (SPA) dengan React Router
- Context API untuk state management global
- Functional components dengan React Hooks
- Axios untuk HTTP client dengan interceptors
- Responsive design dengan CSS variables
- Dark theme modern

#### 4. **Komunikasi Backend-Frontend**
- Frontend mengirim HTTP request (GET, POST, PUT, DELETE) ke Backend
- Backend memproses request, query database, dan return JSON response
- Authentication menggunakan JWT token di header Authorization
- CORS enabled untuk cross-origin requests
- Centralized API service dengan Axios interceptors

#### 5. **Fitur Lengkap**
- User authentication (register, login, profile)
- Product catalog dengan filter, search, pagination
- Shopping cart functionality
- Order management & tracking
- Admin dashboard untuk CRUD operations
- Image upload untuk produk
- Review & rating system
- Wishlist feature

#### 6. **Best Practices**
- Environment variables untuk konfigurasi
- Structured folder organization (MVC pattern)
- Reusable components
- Error handling di client dan server
- Input validation
- Secure password hashing
- Token-based authentication

### Teknologi Stack Summary

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| **Frontend** | React.js 18 | UI Library |
| | React Router v6 | Client-side routing |
| | Axios | HTTP Client |
| | Context API | State Management |
| **Backend** | Node.js 20 | JavaScript Runtime |
| | Express.js 4 | Web Framework |
| | JWT | Authentication |
| | Bcrypt | Password Hashing |
| | Multer | File Upload |
| **Database** | MySQL 8 | Relational Database |
| | mysql2 | Database Driver |

### Cara Kerja Secara Keseluruhan

1. **User Interface**: User berinteraksi dengan React frontend di browser
2. **API Request**: Frontend kirim HTTP request ke backend API
3. **Authentication**: Backend verify JWT token untuk protected routes
4. **Business Logic**: Controller process request, apply business rules
5. **Database Query**: Model query MySQL database
6. **Response**: Backend return JSON response ke frontend
7. **UI Update**: React update state dan re-render UI

Aplikasi ini menunjukkan implementasi complete e-commerce system dengan separation of concerns, scalable architecture, dan best practices dalam modern web development.

---

## 📞 Informasi Tambahan

### API Documentation
Base URL: `http://localhost:5000/api`

**Endpoints tersedia**:
- `/api/auth/*` - Authentication
- `/api/products/*` - Products (public & protected)
- `/api/orders/*` - Orders (protected)
- `/api/admin/*` - Admin operations (admin only)

### Project Structure Summary
```
stylehub4/
├── backend/         # Node.js + Express API Server
├── frontend/        # React SPA Client
├── database/        # MySQL schema & seed data
└── README.md        # Documentation
```

### Port Configuration
- **Backend**: Port 5000
- **Frontend**: Port 3000
- **MySQL**: Port 3306 (default)

---

**© 2024 StyleHub - Fashion Marketplace**


