const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const { generateToken } = require('../utils/jwt');
const { logActivity, getUserActivityLogs } = require('../utils/activityLogger');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const userModel = new User(db);

// Register User
exports.register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }

    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
        return next(new ErrorHandler('Email already registered', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    });

    const user = await userModel.findById(userId);

    // Generate token
    const token = generateToken(user.id);

    // Log activity
    await logActivity({
        userId: user.id,
        action: 'register',
        description: `User ${user.name} registered with email ${user.email}`,
        req
    });

    res.status(201).json({
        success: true,
        token,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Login User
exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    // Find user with password
    const user = await userModel.findByEmail(email);

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    // Generate token
    const token = generateToken(user.id);

    // Log activity
    await logActivity({
        userId: user.id,
        action: 'login',
        description: `User ${user.name} logged in`,
        req
    });

    res.status(200).json({
        success: true,
        token,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

// Get Current User Profile
exports.getProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    // Check if email is already taken by another user
    if (email) {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser && existingUser.id !== req.user.id) {
            return next(new ErrorHandler('Email already in use', 400));
        }
    }

    const updated = await userModel.update(req.user.id, updateData);

    if (!updated) {
        return next(new ErrorHandler('Failed to update profile', 400));
    }

    const user = await userModel.findById(req.user.id);

    // Log activity
    await logActivity({
        userId: user.id,
        action: 'update_profile',
        description: `User ${user.name} updated their profile`,
        req
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// Change Password
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(new ErrorHandler('Please provide current and new password', 400));
    }

    // Get user with password
    const user = await userModel.findByEmail(req.user.email);

    // Check current password
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler('Current password is incorrect', 401));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const updated = await userModel.updatePassword(req.user.id, hashedPassword);

    if (!updated) {
        return next(new ErrorHandler('Failed to update password', 400));
    }

    // Log activity
    await logActivity({
        userId: req.user.id,
        action: 'change_password',
        description: `User ${req.user.name} changed their password`,
        req
    });

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
});

// Logout (optional - for token blacklist)
exports.logout = catchAsyncErrors(async (req, res, next) => {
    // Log activity if user is authenticated
    if (req.user) {
        await logActivity({
            userId: req.user.id,
            action: 'logout',
            description: `User ${req.user.name} logged out`,
            req
        });
    }
    
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Get user activity logs
exports.getMyActivityLogs = catchAsyncErrors(async (req, res, next) => {
    const { limit = 50 } = req.query;
    
    const logs = await getUserActivityLogs(req.user.id, parseInt(limit));
    
    res.status(200).json({
        success: true,
        data: logs
    });
});