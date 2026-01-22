const bcrypt = require('bcryptjs');

class User {
  constructor(db) {
    this.db = db;
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const [users] = await this.db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users[0];
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    const [users] = await this.db.query(
      'SELECT id, name, email, role, phone, address, city, postal_code, avatar, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
    return users[0];
  }

  /**
   * Create new user
   */
  async create(userData) {
    const { name, email, password, role = 'user' } = userData;
    
    const [result] = await this.db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    
    return result.insertId;
  }

  /**
   * Update user
   */
  async update(id, userData) {
    const fields = [];
    const values = [];

    const allowedFields = ['name', 'email', 'phone', 'address', 'city', 'postal_code', 'avatar'];

    allowedFields.forEach(key => {
      if (userData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await this.db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Find all users with filters
   */
  async findAll(filters = {}) {
    const { search, role, limit = 10, offset = 0 } = filters;
    
    let query = 'SELECT id, name, email, role, phone, city, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [users] = await this.db.query(query, params);
    return users;
  }

  /**
   * Count users
   */
  async count(filters = {}) {
    const { search, role } = filters;
    
    let query = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    const [result] = await this.db.query(query, params);
    return result[0].total;
  }

  /**
   * Update user status
   */
  async updateStatus(id, status) {
    const [result] = await this.db.query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [status === 'active' ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update password
   */
  async updatePassword(id, hashedPassword) {
    const [result] = await this.db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Wishlist operations
   */
  async addToWishlist(userId, productId) {
    try {
      const [result] = await this.db.query(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
        [userId, productId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return false;
      }
      throw error;
    }
  }

  async removeFromWishlist(userId, productId) {
    const [result] = await this.db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result.affectedRows > 0;
  }

  async getWishlist(userId) {
    const [items] = await this.db.query(`
      SELECT p.*, w.created_at as added_at
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ? AND p.is_active = 1
      ORDER BY w.created_at DESC
    `, [userId]);
    return items;
  }

  /**
   * Review operations
   */
  async addReview(reviewData) {
    const { product_id, user_id, order_id, rating, comment, is_verified_purchase } = reviewData;
    
    const [result] = await this.db.query(`
      INSERT INTO reviews (product_id, user_id, order_id, rating, comment, is_verified_purchase)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [product_id, user_id, order_id, rating, comment, is_verified_purchase || false]);
    
    return result.insertId;
  }

  async getProductReviews(productId) {
    const [reviews] = await this.db.query(`
      SELECT r.*, u.name as user_name, u.avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [productId]);
    return reviews;
  }
}

module.exports = User;