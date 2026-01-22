const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Protected routes - require login
router.use(protect);

// ========================================
// ORDER ROUTES
// ========================================

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
router.post('/', orderController.createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 * @query   status, page, limit
 */
router.get('/', orderController.getUserOrders);

/**
 * @route   GET /api/orders/stats
 * @desc    Get user's order statistics
 * @access  Private
 */
router.get('/stats', orderController.getOrderStats);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 * @params  id - Order ID
 */
router.get('/:id', orderController.getOrder);

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 * @params  id - Order ID
 */
router.put('/:id/cancel', orderController.cancelOrder);

// ========================================
// CART ROUTES
// ========================================

/**
 * @route   GET /api/orders/cart/items
 * @desc    Get cart items
 * @access  Private
 */
router.get('/cart/items', orderController.getCart);

/**
 * @route   POST /api/orders/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/cart', orderController.addToCart);

/**
 * @route   PUT /api/orders/cart/:id
 * @desc    Update cart item quantity
 * @access  Private
 * @params  id - Cart item ID
 */
router.put('/cart/:id', orderController.updateCartItem);

/**
 * @route   DELETE /api/orders/cart/:id
 * @desc    Remove item from cart
 * @access  Private
 * @params  id - Cart item ID
 */
router.delete('/cart/:id', orderController.removeFromCart);

/**
 * @route   DELETE /api/orders/cart
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete('/cart', orderController.clearCart);

// ========================================
// REVIEW ROUTES
// ========================================

/**
 * @route   POST /api/orders/reviews
 * @desc    Create review for order item
 * @access  Private
 */
router.post('/reviews', orderController.createReview);

/**
 * @route   GET /api/orders/:id/reviews
 * @desc    Get order with review status for each item
 * @access  Private
 */
router.get('/:id/reviews', orderController.getOrderItemReviews);

module.exports = router;