-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Jan 2026 pada 12.56
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12


START TRANSACTION;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stylehub`
--

-- --------------------------------------------------------
USE railway;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
--
-- Struktur dari tabel `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'login', 'Admin login to dashboard', '192.168.1.1', NULL, '2025-01-08 01:00:00'),
(2, 1, 'product_update', 'Updated product: Oversized T-Shirt Premium', '192.168.1.1', NULL, '2025-01-08 01:15:00'),
(5, 3, 'register', 'New user registration', '192.168.1.101', NULL, '2025-01-01 03:00:00'),
(6, 9, 'create_order', 'Order ORD-1768371956655 created with total Rp 25.000', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-14 06:25:56'),
(7, 9, 'create_order', 'Order ORD-1768372112465 created with total Rp 165.000', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-14 06:28:32'),
(8, 1, 'login', 'User Admin Style Hub logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-14 06:32:37'),
(9, 9, 'login', 'User haru logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-14 06:37:05'),
(10, 1, 'login', 'User Admin Style Hub logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-17 00:49:15'),
(11, 9, 'login', 'User haru logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-17 00:49:43'),
(12, 9, 'create_review', 'Created review for product ID 1 with rating 5', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-17 01:32:13'),
(13, 10, 'register', 'User ilham registered with email ilham@gmail.com', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-21 04:28:54'),
(14, 10, 'login', 'User ilham logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-21 04:29:16'),
(15, 10, 'create_order', 'Order ORD-1768969803209 created with total Rp 335.000', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-21 04:30:03'),
(16, 1, 'login', 'User Admin Style Hub logged in', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', '2026-01-21 04:30:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 3, 4, 1, '2025-01-08 03:00:00', '2025-11-09 22:10:52'),
(3, 4, 8, 1, '2025-01-08 04:20:00', '2025-11-09 22:10:52'),
(5, 5, 1, 3, '2025-01-08 06:30:00', '2025-11-09 22:10:52'),
(6, 6, 1, 1, '2025-12-11 16:50:24', '2025-12-11 16:50:24');

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Wanita', 'wanita', 'Fashion untuk wanita - dress, blouse, rok, dan lainnya', '👗', '2025-11-09 22:10:52', '2025-11-09 22:10:52'),
(2, 'Pria', 'pria', 'Fashion untuk pria - kemeja, celana, jaket, dan lainnya', '👔', '2025-11-09 22:10:52', '2025-11-09 22:10:52'),
(3, 'Aksesoris', 'aksesoris', 'Aksesoris fashion - tas, dompet, jam tangan, kacamata', '👜', '2025-11-09 22:10:52', '2025-11-09 22:10:52'),
(4, 'Sepatu', 'sepatu', 'Sepatu dan sandal untuk pria dan wanita', '👟', '2025-11-09 22:10:52', '2025-11-09 22:10:52'),
(5, 'Tas', 'tas', 'Berbagai jenis tas - backpack, tote bag, clutch, dll', '🎒', '2025-11-09 22:10:52', '2025-11-09 22:10:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `is_read`, `created_at`) VALUES
(3, 3, 'order', 'Pesanan Diproses', 'Pesanan SH2025010003 sedang diproses', 0, '2025-01-08 03:15:00'),
(4, 4, 'order', 'Menunggu Pembayaran', 'Segera selesaikan pembayaran pesanan SH2025010004', 0, '2025-01-08 01:30:00'),
(5, 5, 'promo', 'Flash Sale!', 'Diskon hingga 50% untuk kategori sepatu. Buruan!', 0, '2025-01-08 00:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `payment_method` enum('transfer','cod','ewallet') NOT NULL,
  `payment_status` enum('unpaid','paid','failed') DEFAULT 'unpaid',
  `shipping_name` varchar(255) NOT NULL,
  `shipping_phone` varchar(20) NOT NULL,
  `shipping_address` text NOT NULL,
  `shipping_city` varchar(100) NOT NULL,
  `shipping_postal_code` varchar(10) NOT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `subtotal`, `shipping_cost`, `total`, `status`, `payment_method`, `payment_status`, `shipping_name`, `shipping_phone`, `shipping_address`, `shipping_city`, `shipping_postal_code`, `paid_at`, `shipped_at`, `delivered_at`, `cancelled_at`, `created_at`, `updated_at`) VALUES
(3, 3, 'SH2025010003', 500000.00, 15000.00, 515000.00, 'processing', 'transfer', 'paid', 'Jane Smith', '081234567892', 'Jl. Thamrin No. 456', 'Surabaya', '60123', '2025-01-04 04:30:00', NULL, NULL, NULL, '2025-01-04 01:20:00', '2025-11-09 22:10:52'),
(4, 4, 'SH2025010004', 320000.00, 15000.00, 335000.00, 'pending', 'ewallet', 'unpaid', 'Ahmad Rizki', '081234567893', 'Jl. Malioboro No. 789', 'Yogyakarta', '55111', NULL, NULL, NULL, NULL, '2025-01-05 09:45:00', '2025-11-09 22:10:52'),
(5, 5, 'SH2025010005', 650000.00, 15000.00, 665000.00, 'cancelled', 'transfer', 'unpaid', 'Siti Nurhaliza', '081234567894', 'Jl. Braga No. 321', 'Bandung', '40111', NULL, NULL, NULL, NULL, '2025-01-06 06:10:00', '2025-11-09 22:10:52'),
(6, 7, 'ORD-1766210015109', 300000.00, 15000.00, 315000.00, 'pending', 'cod', 'unpaid', 'panji setiawan', '098786546788765', 'Jl.siliwangi', 'Sukabumi', '08556', NULL, NULL, NULL, NULL, '2025-12-20 05:53:35', '2025-12-20 05:53:35'),
(15, 8, 'ORD-1768209340852', 100000.00, 15000.00, 115000.00, 'cancelled', 'cod', 'unpaid', 'bakti', '098786546788765', 'Jl.siliwangi', 'Sukabumi', '08556', NULL, NULL, NULL, '2026-01-14 05:44:58', '2026-01-12 09:15:40', '2026-01-14 05:44:58'),
(16, 8, 'ORD-1768209833661', 150000.00, 15000.00, 165000.00, 'pending', 'transfer', 'unpaid', 'bakti', '098786546788765', 'Jl.siliwangi', 'Sukabumi', '08556', NULL, NULL, NULL, NULL, '2026-01-12 09:23:53', '2026-01-12 09:23:53'),
(17, 8, 'ORD-1768210300250', 250000.00, 15000.00, 265000.00, 'pending', 'ewallet', 'unpaid', 'bakti', '098786546788765', 'Jl.siliwangi', 'Sukabumi', '08556', NULL, NULL, NULL, NULL, '2026-01-12 09:31:40', '2026-01-12 09:31:40'),
(18, 8, 'ORD-1768369485805', 150000.00, 15000.00, 165000.00, 'shipped', 'ewallet', 'paid', 'bakti', '098786546788765', 'Jl.siliwangi', 'Sukabumi', '08556', '2026-01-14 05:49:18', '2026-01-14 05:49:21', NULL, NULL, '2026-01-14 05:44:45', '2026-01-14 05:49:21'),
(19, 9, 'ORD-1768371956655', 10000.00, 15000.00, 25000.00, 'shipped', 'transfer', 'paid', 'haru', '0821232123', 'Jl.siliwangi', 'Sukabumi', '08556', '2026-01-14 06:36:20', '2026-01-14 06:36:18', NULL, NULL, '2026-01-14 06:25:56', '2026-01-14 06:36:20'),
(20, 9, 'ORD-1768372112465', 150000.00, 15000.00, 165000.00, 'delivered', 'ewallet', 'paid', 'haru', '0821232123', 'Jl.siliwangi', 'Sukabumi', '08556', '2026-01-14 06:36:01', NULL, '2026-01-17 00:49:28', NULL, '2026-01-14 06:28:32', '2026-01-17 00:49:28'),
(21, 10, 'ORD-1768969803209', 320000.00, 15000.00, 335000.00, 'pending', 'ewallet', 'unpaid', 'ilham', '0821232123', 'Jl.siliwangi', 'Sukabumi', '08555', NULL, NULL, NULL, NULL, '2026-01-21 04:30:03', '2026-01-21 04:30:03');

-- --------------------------------------------------------

--
-- Struktur dari tabel `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `subtotal` decimal(10,2) NOT NULL,
  `is_reviewed` tinyint(1) DEFAULT 0,
  `review_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_price`, `quantity`, `subtotal`, `is_reviewed`, `review_id`, `created_at`) VALUES
(6, 3, 8, 'Dress Midi Floral', 380000.00, 1, 380000.00, 0, NULL, '2025-11-09 22:10:52'),
(8, 4, 3, 'Celana Chino Slim Fit', 320000.00, 1, 320000.00, 0, NULL, '2025-11-09 22:10:52'),
(9, 5, 4, 'Jaket Bomber Premium', 580000.00, 1, 580000.00, 0, NULL, '2025-11-09 22:10:52'),
(10, 5, 10, 'Topi Baseball Premium', 85000.00, 1, 85000.00, 0, NULL, '2025-11-09 22:10:52'),
(13, 15, 39, 'baju', 100000.00, 1, 100000.00, 0, NULL, '2026-01-12 09:15:40'),
(14, 16, 1, 'Oversized T-Shirt Premium', 150000.00, 1, 150000.00, 0, NULL, '2026-01-12 09:23:53'),
(15, 17, 2, 'Kemeja Formal Lengan Panjang', 250000.00, 1, 250000.00, 0, NULL, '2026-01-12 09:31:40'),
(16, 18, 1, 'Oversized T-Shirt Premium', 150000.00, 1, 150000.00, 0, NULL, '2026-01-14 05:44:45'),
(17, 19, 40, 'ohim', 10000.00, 1, 10000.00, 0, NULL, '2026-01-14 06:25:56'),
(18, 20, 1, 'Oversized T-Shirt Premium', 150000.00, 1, 150000.00, 1, 7, '2026-01-14 06:28:32'),
(19, 21, 3, 'Hoodie Polos Premium', 320000.00, 1, 320000.00, 0, NULL, '2026-01-21 04:30:03');

-- --------------------------------------------------------

--
-- Struktur dari tabel `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT 0.0,
  `reviews_count` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `category_id`, `price`, `old_price`, `stock`, `rating`, `reviews_count`, `image`, `images`, `is_active`, `is_featured`, `created_at`, `updated_at`) VALUES
(1, 'Oversized T-Shirt Premium', 'oversized-tshirt-premium', 'T-shirt oversized dengan bahan cotton combed 30s yang nyaman dan breathable. Cocok untuk aktivitas sehari-hari dengan style casual yang modern. Tersedia berbagai warna.', 2, 150000.00, 200000.00, 50, 5.0, 2, 'products/oversized-t-shirt-premium.jpeg', NULL, 1, 1, '2025-11-09 22:10:52', '2026-01-17 01:32:13'),
(2, 'Kemeja Formal Lengan Panjang', 'kemeja-formal-lengan-panjang', 'Kemeja formal dengan bahan katun premium, cocok untuk acara formal dan kantor. Design modern dengan fit yang pas di badan. Anti-kusut dan mudah disetrika.', 2, 250000.00, 350000.00, 35, 0.0, 0, 'products/kemeja-formal-lengan-panjang.jpg', NULL, 1, 1, '2025-11-09 22:10:52', '2025-12-23 19:42:36'),
(3, 'Hoodie Polos Premium', 'celana-chino-slim-fit', 'Celana chino dengan potongan slim fit yang stylish dan nyaman. Bahan stretch yang memudahkan pergerakan. Cocok untuk casual maupun semi formal.', 2, 320000.00, 400000.00, 45, 0.0, 0, 'products/hoodie-polos-premium.jpg', NULL, 1, 0, '2025-11-09 22:10:52', '2025-12-23 19:42:36'),
(4, 'Celana Chino Slim Fit', 'jaket-bomber-premium', 'Jaket bomber dengan design klasik dan bahan berkualitas tinggi. Cocok untuk berbagai occasion. Water resistant dan windproof.', 2, 580000.00, 750000.00, 25, 0.0, 0, 'products/celana-chino-slim-fit.jpg', NULL, 1, 1, '2025-11-09 22:10:52', '2025-12-23 19:42:36'),
(5, 'Jaket Bomber', 'kaos-polo-pique', 'Kaos polo dengan bahan pique premium. Nyaman dan tidak mudah kusut. Cocok untuk golf, casual, atau smart casual.', 2, 180000.00, 240000.00, 60, 0.0, 0, 'products/jaket-bomber.jpg', NULL, 1, 0, '2025-11-09 22:10:52', '2025-12-23 19:42:36'),
(6, 'Kaos Polo', 'sweater-rajut', 'Sweater rajut dengan motif minimalis modern. Hangat dan nyaman. Cocok untuk cuaca dingin atau ruangan ber-AC.', 2, 280000.00, 350000.00, 30, 0.0, 0, 'products/kaos-polo.jpg', NULL, 1, 0, '2025-11-09 22:10:52', '2025-12-23 19:42:36'),
(7, 'Tas Ransel Canvas', 'crop-top-elegant', 'Crop top dengan design elegant dan bahan yang adem. Cocok untuk hangout dan acara casual. Bisa dipadukan dengan berbagai bottom.', 5, 120000.00, 180000.00, 30, 4.0, 1, 'products/tas-ransel-canvas.jpg', NULL, 1, 1, '2025-11-09 22:10:52', '2025-12-23 20:16:51'),
(8, 'Sneakers', 'dress-midi-floral', 'Dress midi dengan motif floral yang cantik. Bahan flowing yang nyaman dipakai seharian. Perfect untuk garden party atau casual outing.', 4, 380000.00, 500000.00, 25, 5.0, 1, 'products/sneakers.jpg', NULL, 1, 1, '2025-11-09 22:10:52', '2025-12-23 20:16:23'),
(10, 'Celana Jeans', 'rok-plisket-aline', 'Rok plisket dengan potongan A-line yang flattering. Bahan jatuh dan nyaman. Bisa untuk casual atau office look.', 1, 220000.00, 280000.00, 35, 0.0, 0, 'products/celana-jeans.jpg', NULL, 1, 0, '2025-11-09 22:10:52', '2025-12-23 19:42:36'),
(39, 'baju', 'baju-1', 'ini baju', 2, 100000.00, 150000.00, 1, 0.0, 0, 'products/product-1768205260421-57233211.jpeg', NULL, 0, 1, '2026-01-12 08:07:40', '2026-01-14 05:50:21'),
(40, 'ohim', 'ohim', 'ktp ohim', 2, 10000.00, NULL, 1, 0.0, 0, 'products/product-1768370679378-138926976.jpeg', NULL, 1, 1, '2026-01-14 06:04:39', '2026-01-21 04:31:18'),
(41, 'baju hitam', 'baju-hitam', 'ini baju hitam', 2, 100000.00, NULL, 10, 0.0, 0, 'products/product-1768969921593-380874523.jpeg', NULL, 1, 0, '2026-01-21 04:32:01', '2026-01-21 04:32:01');

-- --------------------------------------------------------

--
-- Struktur dari tabel `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `comment` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `is_verified_purchase` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `order_id`, `rating`, `comment`, `images`, `is_verified_purchase`, `created_at`, `updated_at`) VALUES
(3, 7, 3, NULL, 4, 'Bagus sih tapi ukurannya agak kecil. Overall oke lah.', NULL, 0, '2025-01-06 07:30:00', '2025-11-09 22:10:52'),
(4, 1, 4, NULL, 5, 'Mantap! Bahannya premium banget. Worth it!', NULL, 0, '2025-01-07 02:20:00', '2025-11-09 22:10:52'),
(5, 8, 5, NULL, 5, 'Dress nya cantik banget! Bahannya flowing dan nyaman. Love it!', NULL, 0, '2025-01-07 08:45:00', '2025-11-09 22:10:52'),
(7, 1, 9, 20, 5, 'bahannya bagus', NULL, 1, '2026-01-17 01:32:13', '2026-01-17 01:32:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, `postal_code`, `avatar`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin Style Hub', 'admin@stylehub.com', '$2a$10$kScJzyP5dFKBw6my0A.QIu5Rdmt2B4pQgoTNAZWNv.hqYJxyUmSsi', 'admin', '081234567890', 'Jl. Sudirman No. 1', 'Jakarta', '12190', NULL, 1, '2025-11-09 22:10:51', '2025-12-11 15:40:11'),
(3, 'Jane Smith', 'jane@test.com', '$2b$10$XqZ9j8yQGJRxLZ5vJKHZj.7qzk0ZxXKZP0vJHZKjZHjZKjZHjZHje', 'user', '081234567892', 'Jl. Thamrin No. 456', 'Surabaya', '60123', NULL, 1, '2025-11-09 22:10:51', '2025-11-09 22:10:51'),
(4, 'Ahmad Rizki', 'ahmad@test.com', '$2b$10$XqZ9j8yQGJRxLZ5vJKHZj.7qzk0ZxXKZP0vJHZKjZHjZKjZHjZHje', 'user', '081234567893', 'Jl. Malioboro No. 789', 'Yogyakarta', '55111', NULL, 1, '2025-11-09 22:10:51', '2025-11-09 22:10:51'),
(5, 'Siti Nurhaliza', 'siti@test.com', '$2b$10$XqZ9j8yQGJRxLZ5vJKHZj.7qzk0ZxXKZP0vJHZKjZHjZKjZHjZHje', 'user', '081234567894', 'Jl. Braga No. 321', 'Bandung', '40111', NULL, 1, '2025-11-09 22:10:51', '2025-11-09 22:10:51'),
(6, 'aselole', 'aselole@gmail.com', '$2a$10$sQBrdE9KZXFfCEcn.EyEW.GadoUnn9Msqe1TiQmFZ6LmC.9Ews.8.', 'user', NULL, NULL, NULL, NULL, NULL, 1, '2025-12-11 16:02:56', '2025-12-11 16:02:56'),
(7, 'panji setiawan', 'panji.angkasa@gmail.com', '$2a$10$GVDUB1QoxcT6Zj3Zh2VmVOUFoguoDtjJOuMiJNGoEmT1QKXm73mCq', 'user', NULL, NULL, NULL, NULL, NULL, 1, '2025-12-20 05:52:36', '2025-12-20 05:52:36'),
(8, 'bakti', 'bakti@gmail.com', '$2a$10$RqtLLMFWGn6Oy1PXhsz7Q.UyeSHRFB7LNODMIcif9fwzTvxT/TF0e', 'user', NULL, NULL, NULL, NULL, NULL, 1, '2026-01-12 08:20:24', '2026-01-12 08:20:24'),
(9, 'haru', 'haru@gmail.com', '$2a$10$xd587fG4qbE96n4YvkcfjOtTMppw2BRNCVw20WxBbViLzPt/6TnXS', 'user', NULL, NULL, NULL, NULL, NULL, 1, '2026-01-14 06:08:57', '2026-01-14 06:08:57'),
(10, 'ilham', 'ilham@gmail.com', '$2a$10$oQnTnGIm/bcx2wGmUXdjpOzWQNd9UWixeRlvEBVNXFc6wtAF/aDRq', 'user', NULL, NULL, NULL, NULL, NULL, 1, '2026-01-21 04:28:54', '2026-01-21 04:28:54');

-- --------------------------------------------------------

--
-- Struktur dari tabel `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(4, 3, 1, '2025-01-04 07:30:00'),
(8, 5, 4, '2025-01-06 04:45:00'),
(14, 7, 1, '2025-12-23 19:55:02'),
(15, 7, 2, '2025-12-23 19:55:13'),
(16, 9, 40, '2026-01-14 06:38:33'),
(17, 9, 1, '2026-01-14 06:38:41');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indeks untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cart` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_read` (`is_read`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_order_number` (`order_number`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indeks untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_review` (`review_id`),
  ADD KEY `idx_is_reviewed` (`is_reviewed`);

--
-- Indeks untuk tabel `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_slug` (`slug`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_price` (`price`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_featured` (`is_featured`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indeks untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_rating` (`rating`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Indeks untuk tabel `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_wishlist` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT untuk tabel `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT untuk tabel `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT untuk tabel `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT untuk tabel `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_review_fk` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
