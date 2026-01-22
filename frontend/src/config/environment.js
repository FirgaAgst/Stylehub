// ====================================
// API Configuration Helper
// ====================================
// File ini membantu mengelola URL API berdasarkan environment

const ENV = {
    development: {
        API_URL: 'http://localhost:5000/api',
        IMAGE_URL: 'http://localhost:5000/uploads'
    },
    production: {
        API_URL: process.env.REACT_APP_API_URL,
        IMAGE_URL: process.env.REACT_APP_IMAGE_URL
    }
};

const currentEnv = process.env.NODE_ENV || 'development';

export const config = {
    API_URL: ENV[currentEnv].API_URL,
    IMAGE_URL: ENV[currentEnv].IMAGE_URL,
    IS_PRODUCTION: currentEnv === 'production',
    IS_DEVELOPMENT: currentEnv === 'development'
};

// Helper untuk logging (hanya di development)
export const log = (...args) => {
    if (config.IS_DEVELOPMENT) {
        console.log(...args);
    }
};

export const logError = (...args) => {
    if (config.IS_DEVELOPMENT) {
        console.error(...args);
    }
};

export default config;
