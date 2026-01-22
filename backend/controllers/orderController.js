const Order = require('../models/Order');
const Review = require('../models/Review');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { logActivity } = require('../utils/activityLogger');
const db = require('../config/database');

const orderModel = new Order(db);
const reviewModel = new Review(db);

// Create new Order
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        order_number,
        subtotal,
        shipping_cost,
        total,
        payment_method,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code
    } = req.body;

    // Get cart items
    const cartItems = await orderModel.getCartItems(req.user.id);
    
    if (!cartItems || cartItems.length === 0) {
        return next(new ErrorHandler('Cart is empty', 400));
    }

    const orderData = {
        user_id: req.user.id,
        order_number: order_number || `ORD-${Date.now()}`,
        subtotal,
        shipping_cost,
        total,
        payment_method,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code
    };

    const orderId = await orderModel.create(orderData);
    
    // Add order items from cart
    const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        product_name: item.name, // field dari cart adalah 'name', bukan 'product_name'
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
    }));
    
    await orderModel.addOrderItems(orderId, orderItems);
    
    // Clear cart after order created
    await orderModel.clearCart(req.user.id);
    
    const order = await orderModel.findById(orderId);

    // Log activity
    await logActivity({
        userId: req.user.id,
        action: 'create_order',
        description: `Order ${order.order_number} created with total Rp ${total.toLocaleString('id-ID')}`,
        req
    });

    res.status(201).json({
        success: true,
        data: order
    });
});

// Get Single Order
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id, req.user.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// Get User Orders
exports.getUserOrders = catchAsyncErrors(async (req, res, next) => {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const filters = {
        status,
        limit: parseInt(limit),
        offset: parseInt(offset)
    };

    const orders = await orderModel.findByUser(req.user.id, filters);

    res.status(200).json({
        success: true,
        data: orders
    });
});

// Get Order Statistics
exports.getOrderStats = catchAsyncErrors(async (req, res, next) => {
    const stats = await orderModel.getUserStats(req.user.id);

    res.status(200).json({
        success: true,
        data: stats
    });
});

// Cancel Order
exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const order = await orderModel.findById(id, req.user.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
        return next(new ErrorHandler('Cannot cancel this order', 400));
    }

    const cancelled = await orderModel.cancel(id);

    if (!cancelled) {
        return next(new ErrorHandler('Failed to cancel order', 400));
    }

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully'
    });
});

// Cart Operations
exports.getCart = catchAsyncErrors(async (req, res, next) => {
    const cartItems = await orderModel.getCartItems(req.user.id);

    res.status(200).json({
        success: true,
        data: cartItems
    });
});

exports.addToCart = catchAsyncErrors(async (req, res, next) => {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return next(new ErrorHandler('Product ID and quantity are required', 400));
    }

    const added = await orderModel.addToCart({
        user_id: req.user.id,
        product_id,
        quantity
    });

    if (!added) {
        return next(new ErrorHandler('Failed to add item to cart', 400));
    }

    res.status(201).json({
        success: true,
        message: 'Item added to cart successfully'
    });
});

exports.updateCartItem = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return next(new ErrorHandler('Valid quantity is required', 400));
    }

    const updated = await orderModel.updateCartItem(id, quantity, req.user.id);

    if (!updated) {
        return next(new ErrorHandler('Failed to update cart item', 400));
    }

    res.status(200).json({
        success: true,
        message: 'Cart item updated successfully'
    });
});

exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const removed = await orderModel.removeFromCart(id, req.user.id);

    if (!removed) {
        return next(new ErrorHandler('Failed to remove item from cart', 400));
    }

    res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully'
    });
});

exports.clearCart = catchAsyncErrors(async (req, res, next) => {
    const cleared = await orderModel.clearCart(req.user.id);

    if (!cleared) {
        return next(new ErrorHandler('Failed to clear cart', 400));
    }

    res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
    });
});

// ========================================
// REVIEW FUNCTIONS
// ========================================

// Create Review for Order Item
exports.createReview = catchAsyncErrors(async (req, res, next) => {
    const { orderId, orderItemId, productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        return next(new ErrorHandler('Rating must be between 1 and 5', 400));
    }

    // Check if user can review this item
    const checkResult = await reviewModel.canReview(userId, orderId, productId);
    
    if (!checkResult.canReview) {
        return next(new ErrorHandler(checkResult.reason, 400));
    }

    // Create review
    const reviewId = await reviewModel.create({
        product_id: productId,
        user_id: userId,
        order_id: orderId,
        order_item_id: orderItemId,
        rating,
        comment
    });

    // Update product rating
    await updateProductRating(productId);

    // Log activity
    await logActivity({
        userId: userId,
        action: 'create_review',
        description: `Created review for product ID ${productId} with rating ${rating}`,
        req
    });

    res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: { id: reviewId }
    });
});

// Get Reviews for an Order Item
exports.getOrderItemReviews = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params; // order ID
    const userId = req.user.id;

    // Get order with items and their review status
    const order = await orderModel.findById(id, userId);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // For each item, check if reviewed
    const itemsWithReviewStatus = await Promise.all(
        order.items.map(async (item) => {
            const reviewStatus = await reviewModel.isItemReviewed(item.id);
            return {
                ...item,
                is_reviewed: reviewStatus?.is_reviewed || 0,
                review_id: reviewStatus?.review_id || null
            };
        })
    );

    order.items = itemsWithReviewStatus;

    res.status(200).json({
        success: true,
        data: order
    });
});

// Helper function to update product rating
async function updateProductRating(productId) {
    try {
        const stats = await reviewModel.getProductStats(productId);
        
        const avgRating = parseFloat(stats.average_rating || 0).toFixed(1);
        const reviewCount = stats.total_reviews || 0;

        await db.query(`
            UPDATE products 
            SET rating = ?, reviews_count = ?
            WHERE id = ?
        `, [avgRating, reviewCount, productId]);

        console.log(`✅ Updated product ${productId}: rating=${avgRating}, reviews=${reviewCount}`);
    } catch (error) {
        console.error('❌ Error updating product rating:', error);
        throw error;
    }
}