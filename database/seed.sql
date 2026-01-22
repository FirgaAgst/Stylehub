-- ========================================
-- database/seed.sql
-- Style Hub Sample Data
-- ========================================

USE stylehub;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE wishlist;
TRUNCATE TABLE product_reviews;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert users
-- Password untuk semua user: admin123
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@stylehub.com', '$2a$10$X3lXcq5n.W0tMikVB95W2O6wli81KYUQTEVr1avEtQkQDPz4ocXwG', 'admin'),
('John Doe', 'john@example.com', '$2a$10$X3lXcq5n.W0tMikVB95W2O6wli81KYUQTEVr1avEtQkQDPz4ocXwG', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$X3lXcq5n.W0tMikVB95W2O6wli81KYUQTEVr1avEtQkQDPz4ocXwG', 'user');




SELECT 'Database seeded successfully!' as message;