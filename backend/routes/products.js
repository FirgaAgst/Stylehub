const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { reviewValidation, validate } = require('../middleware/validator');

// ========================================
// PUBLIC ROUTES
// ========================================

/**
 * @route   GET /api/products
 * @desc    Get all products with filters
 * @access  Public
 * @query   category, search, sort, page, limit
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 * @query   limit
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @route   GET /api/products/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/categories', productController.getCategories);

/**
 * @route   GET /api/products/category/:slug
 * @desc    Get products by category
 * @access  Public
 * @params  slug - Category slug
 */
router.get('/category/:slug', productController.getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 * @params  id - Product ID
 */
router.get('/:id', productController.getProduct);

// ========================================
// PROTECTED ROUTES (Require Authentication)
// ========================================

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Create product review
 * @access  Private
 * @params  id - Product ID
 */
router.post('/:id/reviews', 
  protect, 
  reviewValidation, 
  validate, 
  productController.createReview
);

/**
 * @route   PUT /api/products/reviews/:reviewId
 * @desc    Update product review
 * @access  Private
 * @params  reviewId - Review ID
 */
router.put('/reviews/:reviewId', 
  protect, 
  reviewValidation, 
  validate, 
  productController.updateReview
);

/**
 * @route   DELETE /api/products/reviews/:reviewId
 * @desc    Delete product review
 * @access  Private
 * @params  reviewId - Review ID
 */
router.delete('/reviews/:reviewId', 
  protect, 
  productController.deleteReview
);

/**
 * @route   POST /api/products/:id/wishlist
 * @desc    Add product to wishlist
 * @access  Private
 * @params  id - Product ID
 */
router.post('/:id/wishlist', protect, productController.addToWishlist);

/**
 * @route   DELETE /api/products/:id/wishlist
 * @desc    Remove product from wishlist
 * @access  Private
 * @params  id - Product ID
 */
router.delete('/:id/wishlist', protect, productController.removeFromWishlist);

/**
 * @route   GET /api/products/wishlist/me
 * @desc    Get user's wishlist
 * @access  Private
 */
router.get('/wishlist/me', protect, productController.getWishlist);

module.exports = router;