const mysql = require('mysql2/promise');
require('dotenv').config();

// Konfigurasi pool connection dengan error handling yang lebih baik
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stylehub',
    waitForConnections: true,
    connectionLimit: process.env.NODE_ENV === 'production' ? 20 : 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

const pool = mysql.createPool(poolConfig);

// Test connection dengan retry mechanism
const testConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log('✅ Database connected successfully');
            console.log(`📊 Database: ${process.env.DB_NAME}`);
            console.log(`🌐 Host: ${process.env.DB_HOST}`);
            connection.release();
            return true;
        } catch (err) {
            console.error(`❌ Database connection failed (attempt ${i + 1}/${retries}):`, err.message);
            if (i === retries - 1) {
                console.error('⚠️  Database connection failed after all retries!');
                if (process.env.NODE_ENV === 'production') {
                    console.error('⚠️  Server will continue but database operations will fail!');
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
            }
        }
    }
    return false;
};

// Jalankan test connection
testConnection();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('👋 SIGTERM signal received: closing database connections');
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('👋 SIGINT signal received: closing database connections');
    await pool.end();
    process.exit(0);
});

module.exports = pool;
