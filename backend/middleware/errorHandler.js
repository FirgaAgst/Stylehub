const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // MySQL duplicate key error
    if (err.code === 'ER_DUP_ENTRY') {
        const message = 'Duplicate field value entered';
        err = new ErrorHandler(message, 400);
    }

    // MySQL foreign key error
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        const message = 'Referenced record not found';
        err = new ErrorHandler(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        err = new ErrorHandler(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        err = new ErrorHandler(message, 401);
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            err = new ErrorHandler('File size too large', 400);
        } else {
            err = new ErrorHandler('File upload error', 400);
        }
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};