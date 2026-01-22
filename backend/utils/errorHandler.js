// Custom Error Handler Class
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        
        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;
