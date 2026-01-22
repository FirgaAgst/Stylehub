const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Register validation rules
exports.registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Login validation rules
exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Product validation rules
exports.productValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
    body('description')
        .optional({ checkFalsy: true })
        .trim(),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category_id')
        .notEmpty().withMessage('Category is required')
        .isInt({ min: 1 }).withMessage('Category ID must be a valid integer'),
    body('stock')
        .notEmpty().withMessage('Stock is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('old_price')
        .optional({ checkFalsy: true })
        .isFloat({ min: 0 }).withMessage('Old price must be a positive number')
];

// Review validation rules
exports.reviewValidation = [
    body('rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 10 }).withMessage('Comment must be at least 10 characters')
];

// Order validation rules
exports.orderValidation = [
    body('subtotal')
        .notEmpty().withMessage('Subtotal is required')
        .isFloat({ min: 0 }).withMessage('Subtotal must be a positive number'),
    body('shipping_cost')
        .notEmpty().withMessage('Shipping cost is required')
        .isFloat({ min: 0 }).withMessage('Shipping cost must be a positive number'),
    body('total')
        .notEmpty().withMessage('Total is required')
        .isFloat({ min: 0 }).withMessage('Total must be a positive number'),
    body('payment_method')
        .trim()
        .notEmpty().withMessage('Payment method is required'),
    body('shipping_name')
        .trim()
        .notEmpty().withMessage('Shipping name is required'),
    body('shipping_phone')
        .trim()
        .notEmpty().withMessage('Shipping phone is required'),
    body('shipping_address')
        .trim()
        .notEmpty().withMessage('Shipping address is required'),
    body('shipping_city')
        .trim()
        .notEmpty().withMessage('Shipping city is required'),
    body('shipping_postal_code')
        .trim()
        .notEmpty().withMessage('Postal code is required')
];