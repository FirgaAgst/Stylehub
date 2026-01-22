const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { getAllActivityLogs } = require('../utils/activityLogger');
const db = require('../config/database');

const productModel = new Product(db);
const orderModel = new Order(db);
const userModel = new User(db);

// ========================================
// DASHBOARD
// ========================================

// Dashboard Statistics
exports.getDashboardStats = catchAsyncErrors(async (req, res, next) => {
    const [
        totalProducts,
        totalOrders,
        totalUsers,
        recentOrders,
        salesStats,
        topProducts
    ] = await Promise.all([
        productModel.count(),
        orderModel.count(),
        userModel.count(),
        orderModel.getRecent(5),
        orderModel.getSalesStats(),
        productModel.getTopSelling(5)
    ]);

    // Get orders by status
    const ordersByStatus = salesStats ? [
        { status: 'pending', label: 'Pending', count: salesStats.pending_orders || 0, color: '#eab308' },
        { status: 'processing', label: 'Processing', count: salesStats.processing_orders || 0, color: '#3b82f6' },
        { status: 'shipped', label: 'Shipped', count: salesStats.shipped_orders || 0, color: '#9333ea' },
        { status: 'delivered', label: 'Delivered', count: salesStats.delivered_orders || 0, color: '#22c55e' },
        { status: 'cancelled', label: 'Cancelled', count: salesStats.cancelled_orders || 0, color: '#ef4444' }
    ] : [];

    res.status(200).json({
        success: true,
        data: {
            overview: {
                total_products: totalProducts || 0,
                total_orders: totalOrders || 0,
                total_users: totalUsers || 0,
                total_revenue: salesStats?.total_revenue || 0
            },
            orders_by_status: ordersByStatus,
            recent_orders: recentOrders || [],
            top_products: topProducts || []
        }
    });
});

// ========================================
// PRODUCT MANAGEMENT
// ========================================

// Get all products (admin view)
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const { search, category, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const filters = {
        search,
        category,
        status,
        limit: parseInt(limit),
        offset: parseInt(offset)
    };

    const [products, total] = await Promise.all([
        productModel.findAll(filters),
        productModel.count(filters)
    ]);

    res.status(200).json({
        success: true,
        data: products,
        pagination: {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        }
    });
});

// Create product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const productData = {
        ...req.body,
        image: req.file ? `products/${req.file.filename}` : null
    };

    // Generate unique slug from name
    if (!productData.slug && productData.name) {
        let baseSlug = productData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        let slug = baseSlug;
        let counter = 1;
        
        // Check if slug exists, if yes add suffix
        while (await productModel.findBySlug(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        
        productData.slug = slug;
    }

    const productId = await productModel.create(productData);
    const product = await productModel.findById(productId);

    res.status(201).json({
        success: true,
        data: product
    });
});

// Update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const updateData = {
        ...req.body
    };

    if (req.file) {
        updateData.image = `products/${req.file.filename}`;
    }

    const updated = await productModel.update(id, updateData);
    
    if (!updated) {
        return next(new ErrorHandler('Product not found', 404));
    }

    const product = await productModel.findById(id);
    
    res.status(200).json({
        success: true,
        data: product
    });
});

// Delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const deleted = await productModel.delete(req.params.id);
    
    if (!deleted) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});

// Toggle product featured status
exports.toggleFeatured = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    
    const product = await productModel.findById(id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    const updated = await productModel.update(id, {
        is_featured: !product.is_featured
    });

    if (!updated) {
        return next(new ErrorHandler('Failed to update product', 400));
    }

    res.status(200).json({
        success: true,
        message: 'Product featured status updated'
    });
});

// ========================================
// ORDER MANAGEMENT
// ========================================

// Get all orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const { status, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const filters = {
        status,
        search,
        limit: parseInt(limit),
        offset: parseInt(offset)
    };

    const [orders, total] = await Promise.all([
        orderModel.findAll(filters),
        orderModel.count(filters)
    ]);

    res.status(200).json({
        success: true,
        data: orders,
        pagination: {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        }
    });
});

// Get single order
exports.getOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// Update order status
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return next(new ErrorHandler('Status is required', 400));
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return next(new ErrorHandler('Invalid status', 400));
    }

    const updated = await orderModel.updateStatus(id, status);
    
    if (!updated) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Order status updated successfully'
    });
});

// Update payment status
exports.updatePaymentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return next(new ErrorHandler('Payment status is required', 400));
    }

    const validStatuses = ['unpaid', 'paid', 'refunded'];
    if (!validStatuses.includes(status)) {
        return next(new ErrorHandler('Invalid payment status', 400));
    }

    const updated = await orderModel.updatePaymentStatus(id, status);
    
    if (!updated) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Payment status updated successfully'
    });
});

// Delete order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
    });
});

// ========================================
// USER MANAGEMENT
// ========================================

// Get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const { search, role, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const filters = {
        search,
        role,
        limit: parseInt(limit),
        offset: parseInt(offset)
    };

    const [users, total] = await Promise.all([
        userModel.findAll(filters),
        userModel.count(filters)
    ]);

    res.status(200).json({
        success: true,
        data: users,
        pagination: {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        }
    });
});

// Get single user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// Update user
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, email, role, phone, address, city, postal_code } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (postal_code) updateData.postal_code = postal_code;

    // Update role separately if provided
    if (role) {
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }

    if (Object.keys(updateData).length > 0) {
        const updated = await userModel.update(id, updateData);
        
        if (!updated) {
            return next(new ErrorHandler('User not found', 404));
        }
    }

    const user = await userModel.findById(id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// Update user status
exports.updateUserStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return next(new ErrorHandler('Status is required', 400));
    }

    const updated = await userModel.updateStatus(id, status);
    
    if (!updated) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'User status updated successfully'
    });
});

// Delete user
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Don't allow deleting yourself
    if (parseInt(id) === req.user.id) {
        return next(new ErrorHandler('You cannot delete your own account', 400));
    }

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});

// ========================================
// CATEGORY MANAGEMENT
// ========================================

// Get all categories
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
    const [categories] = await db.query(`
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
        GROUP BY c.id
        ORDER BY c.name
    `);

    res.status(200).json({
        success: true,
        data: categories
    });
});

// Create category
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const { name, description } = req.body;

    if (!name) {
        return next(new ErrorHandler('Category name is required', 400));
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await db.query(
        'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
        [name, slug, description || null]
    );

    const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    res.status(201).json({
        success: true,
        data: category[0]
    });
});

// Update category
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const updateData = {};
    if (name) {
        updateData.name = name;
        updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) updateData.description = description;

    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(id);

    const [result] = await db.query(
        `UPDATE categories SET ${fields} WHERE id = ?`,
        values
    );

    if (result.affectedRows === 0) {
        return next(new ErrorHandler('Category not found', 404));
    }

    const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);

    res.status(200).json({
        success: true,
        data: category[0]
    });
});

// Delete category
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    // Check if category has products
    const [products] = await db.query('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]);
    
    if (products[0].count > 0) {
        return next(new ErrorHandler('Cannot delete category with products', 400));
    }

    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
        return next(new ErrorHandler('Category not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
    });
});

// ========================================
// ACTIVITY LOGS
// ========================================

// Get all activity logs
exports.getActivityLogs = catchAsyncErrors(async (req, res, next) => {
    const { limit = 100 } = req.query;
    
    const logs = await getAllActivityLogs(parseInt(limit));
    
    res.status(200).json({
        success: true,
        data: logs
    });
});