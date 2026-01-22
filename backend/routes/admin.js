const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const { productValidation, validate } = require('../middleware/validator');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

// ========================================
// ALL ROUTES REQUIRE ADMIN AUTHENTICATION
// ========================================
router.use(protect);
router.use(admin);

// ========================================
// DASHBOARD
// ========================================
router.get('/dashboard', adminController.getDashboardStats);

// ========================================
// PRODUCT MANAGEMENT
// ========================================
router.get('/products', adminController.getAllProducts);
router.post('/products', 
  uploadSingle, 
  handleUploadError,
  productValidation, 
  validate, 
  adminController.createProduct
);
router.put('/products/:id', 
  uploadSingle, 
  handleUploadError,
  adminController.updateProduct
);
router.delete('/products/:id', adminController.deleteProduct);
router.patch('/products/:id/featured', adminController.toggleFeatured);

// ========================================
// ORDER MANAGEMENT
// ========================================
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrder);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.put('/orders/:id/payment', adminController.updatePaymentStatus);
router.delete('/orders/:id', adminController.deleteOrder);

// ========================================
// USER MANAGEMENT
// ========================================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// ========================================
// CATEGORY MANAGEMENT
// ========================================
router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// ========================================
// ACTIVITY LOGS
// ========================================
router.get('/activity-logs', adminController.getActivityLogs);

module.exports = router;