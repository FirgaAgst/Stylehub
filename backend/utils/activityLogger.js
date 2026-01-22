const db = require('../config/database');

/**
 * Log user activity to database
 * @param {Object} params - Activity log parameters
 * @param {number} params.userId - User ID
 * @param {string} params.action - Action type (login, logout, register, view_product, etc.)
 * @param {string} params.description - Activity description
 * @param {Object} params.req - Express request object
 */
const logActivity = async ({ userId, action, description, req }) => {
    try {
        const ipAddress = req.ip || req.connection.remoteAddress || null;
        const userAgent = req.get('user-agent') || null;

        const query = `
            INSERT INTO activity_logs (user_id, action, description, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(query, [userId, action, description, ipAddress, userAgent]);
        
        console.log(`✅ Activity logged: ${action} by user ${userId}`);
    } catch (error) {
        console.error('❌ Error logging activity:', error.message);
        // Don't throw error to prevent breaking the main flow
    }
};

/**
 * Get user activity logs
 * @param {number} userId - User ID
 * @param {number} limit - Limit number of results
 */
const getUserActivityLogs = async (userId, limit = 50) => {
    try {
        const query = `
            SELECT 
                id,
                action,
                description,
                ip_address,
                user_agent,
                created_at
            FROM activity_logs
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        `;

        const [logs] = await db.execute(query, [userId, limit]);
        return logs;
    } catch (error) {
        console.error('❌ Error fetching activity logs:', error.message);
        throw error;
    }
};

/**
 * Get all activity logs (admin only)
 * @param {number} limit - Limit number of results
 */
const getAllActivityLogs = async (limit = 100) => {
    try {
        const query = `
            SELECT 
                al.id,
                al.user_id,
                u.name as user_name,
                u.email as user_email,
                al.action,
                al.description,
                al.ip_address,
                al.user_agent,
                al.created_at
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT ?
        `;

        const [logs] = await db.execute(query, [limit]);
        return logs;
    } catch (error) {
        console.error('❌ Error fetching all activity logs:', error.message);
        throw error;
    }
};

module.exports = {
    logActivity,
    getUserActivityLogs,
    getAllActivityLogs
};
