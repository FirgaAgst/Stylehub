const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const db = require('../config/database');

const userModel = new User(db);

// Protect routes - verify JWT token
exports.protect = catchAsyncErrors(async (req, res, next) => {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Get user from database
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Check if user is active
        if (!user.is_active) {
            return next(new ErrorHandler('User account is inactive', 403));
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
});

// Admin only middleware
exports.admin = catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admin only.', 403));
    }
    next();
});

// Optional auth - doesn't fail if no token
exports.optionalAuth = catchAsyncErrors(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await userModel.findById(decoded.id);
            
            if (user && user.status === 'active') {
                req.user = user;
            }
        } catch (error) {
            // Token invalid, continue without user
        }
    }

    next();
});