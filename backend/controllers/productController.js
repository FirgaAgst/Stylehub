const Product = require('../models/Product');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const db = require('../config/database');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12, search, category, sort = 'latest' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                p.id,
                p.name,
                p.slug,
                p.description,
                p.price,
                p.old_price,
                p.stock,
                p.rating,
                p.reviews_count,
                p.image,
                p.images,
                p.is_featured,
                p.is_active,
                p.created_at,
                c.id as category_id,
                c.name as category_name,
                c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1
        `;

        const params = [];

        if (search) {
            query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (category) {
            query += ` AND (c.id = ? OR c.slug = ?)`;
            params.push(category, category);
        }

        // Sorting
        switch (sort) {
            case 'price_asc':
                query += ` ORDER BY p.price ASC`;
                break;
            case 'price_desc':
                query += ` ORDER BY p.price DESC`;
                break;
            case 'name':
                query += ` ORDER BY p.name ASC`;
                break;
            case 'popular':
                query += ` ORDER BY p.reviews_count DESC, p.rating DESC`;
                break;
            default:
                query += ` ORDER BY p.created_at DESC`;
        }

        // Get total count
        const countQuery = `
            SELECT COUNT(DISTINCT p.id) as total
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1
            ${search ? 'AND (p.name LIKE ? OR p.description LIKE ?)' : ''}
            ${category ? 'AND (c.id = ? OR c.slug = ?)' : ''}
        `;
        
        const [countResult] = await db.query(countQuery, params);
        const total = countResult[0]?.total || 0;

        // Add pagination
        query += ` LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [products] = await db.query(query, params);

        res.json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Error in getAllProducts:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving products',
            error: error.message
        });
    }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const query = `
            SELECT 
                p.*,
                c.name as category_name,
                c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1 AND p.is_featured = 1
            ORDER BY p.created_at DESC
            LIMIT ?
        `;

        const [products] = await db.query(query, [parseInt(limit)]);

        res.json({
            success: true,
            message: 'Featured products retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error('❌ Error in getFeaturedProducts:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving featured products',
            error: error.message
        });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                p.*,
                c.id as category_id,
                c.name as category_name,
                c.slug as category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ? AND p.is_active = 1
        `;

        const [products] = await db.query(query, [id]);

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Get reviews
        const reviewQuery = `
            SELECT 
                r.*,
                u.name as user_name,
                u.email as user_email,
                u.avatar as user_avatar
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `;

        const [reviews] = await db.query(reviewQuery, [id]);

        const product = products[0];
        product.reviews = reviews;

        res.json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        console.error('❌ Error in getProduct:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving product',
            error: error.message
        });
    }
};

// Get categories
exports.getCategories = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id,
                c.name,
                c.slug,
                c.description,
                c.icon,
                COUNT(p.id) as product_count
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
            GROUP BY c.id, c.name, c.slug, c.description, c.icon
            ORDER BY c.name ASC
        `;

        const [categories] = await db.query(query);

        res.json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories
        });
    } catch (error) {
        console.error('❌ Error in getCategories:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving categories',
            error: error.message
        });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const offset = (page - 1) * limit;

        const query = `
            SELECT 
                p.*,
                c.name as category_name,
                c.slug as category_slug
            FROM products p
            INNER JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1 AND c.slug = ?
            ORDER BY p.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const countQuery = `
            SELECT COUNT(p.id) as total
            FROM products p
            INNER JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = 1 AND c.slug = ?
        `;

        const [countResult] = await db.query(countQuery, [slug]);
        const total = countResult[0]?.total || 0;

        const [products] = await db.query(query, [slug, parseInt(limit), parseInt(offset)]);

        res.json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Error in getProductsByCategory:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error retrieving products',
            error: error.message
        });
    }
};

// Create review
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { id } = req.params;
        const userId = req.user.id;

        console.log(`⭐ Creating review for product ${id} by user ${userId}`);

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide rating and comment'
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if product exists
        const [products] = await db.query('SELECT id FROM products WHERE id = ? AND is_active = 1', [id]);
        
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user already reviewed
        const [existing] = await db.query(
            'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
            [id, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product'
            });
        }

        // Insert review
        await db.query(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [id, userId, rating, comment]
        );

        // Update product rating and review count
        await updateProductRating(id);

        res.status(201).json({
            success: true,
            message: 'Review created successfully'
        });
    } catch (error) {
        console.error('❌ Create review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

// Update review
exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { reviewId } = req.params;
        const userId = req.user.id;

        // Validate rating range
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if review exists and belongs to user
        const [reviews] = await db.query(
            'SELECT product_id FROM reviews WHERE id = ? AND user_id = ?',
            [reviewId, userId]
        );

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or you do not have permission to edit this review'
            });
        }

        const productId = reviews[0].product_id;

        // Update review
        await db.query(
            'UPDATE reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?',
            [rating, comment, reviewId]
        );

        // Update product rating and review count
        await updateProductRating(productId);

        res.json({
            success: true,
            message: 'Review updated successfully'
        });
    } catch (error) {
        console.error('❌ Update review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check if review exists
        const [reviews] = await db.query(
            'SELECT product_id, user_id FROM reviews WHERE id = ?',
            [reviewId]
        );

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const productId = reviews[0].product_id;

        // Check permission (owner or admin)
        if (reviews[0].user_id !== userId && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this review'
            });
        }

        // Delete review
        await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);

        // Update product rating and review count
        await updateProductRating(productId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('❌ Delete review error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

// Helper function to update product rating
async function updateProductRating(productId) {
    try {
        // Calculate average rating and count
        const [stats] = await db.query(`
            SELECT 
                COALESCE(AVG(rating), 0) as avg_rating,
                COUNT(*) as review_count
            FROM reviews 
            WHERE product_id = ?
        `, [productId]);

        const avgRating = parseFloat(stats[0].avg_rating).toFixed(1);
        const reviewCount = stats[0].review_count;

        // Update product
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

// Get, add, remove wishlist functions...
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT 
                p.*,
                c.name as category_name,
                w.created_at as added_at
            FROM wishlist w
            INNER JOIN products p ON w.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE w.user_id = ? AND p.is_active = 1
            ORDER BY w.created_at DESC
        `;

        const [products] = await db.query(query, [userId]);

        res.json({
            success: true,
            message: 'Wishlist retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving wishlist',
            error: error.message
        });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await db.query(
            'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, id]
        );

        res.json({
            success: true,
            message: 'Product added to wishlist'
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to wishlist',
            error: error.message
        });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await db.query(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, id]
        );

        res.json({
            success: true,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from wishlist',
            error: error.message
        });
    }
};