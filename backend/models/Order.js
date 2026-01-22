class Order {
  constructor(db) {
    this.db = db;
  }

  /**
   * Create new order
   */
  async create(orderData) {
    const {
      user_id, order_number, subtotal, shipping_cost, total,
      payment_method, shipping_name, shipping_phone,
      shipping_address, shipping_city, shipping_postal_code
    } = orderData;
    
    const [result] = await this.db.query(`
      INSERT INTO orders (
        user_id, order_number, subtotal, shipping_cost, total,
        payment_method, shipping_name, shipping_phone,
        shipping_address, shipping_city, shipping_postal_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user_id, order_number, subtotal, shipping_cost, total,
      payment_method, shipping_name, shipping_phone,
      shipping_address, shipping_city, shipping_postal_code
    ]);
    
    return result.insertId;
  }

  /**
   * Add order items
   */
  async addOrderItems(orderId, items) {
    const values = items.map(item => [
      orderId,
      item.product_id,
      item.product_name,
      item.product_price,
      item.quantity,
      item.subtotal
    ]);

    await this.db.query(`
      INSERT INTO order_items 
      (order_id, product_id, product_name, product_price, quantity, subtotal)
      VALUES ?
    `, [values]);
  }

  /**
   * Find order by ID
   */
  async findById(id, userId = null) {
    let query = `
      SELECT o.*, 
             u.name as user_name, 
             u.email as user_email,
             o.shipping_name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;
    const params = [id];
    
    if (userId) {
      query += ' AND o.user_id = ?';
      params.push(userId);
    }
    
    const [orders] = await this.db.query(query, params);
    
    if (orders.length > 0) {
      // Get order items
      const [items] = await this.db.query(`
        SELECT oi.*, p.image, p.slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [id]);
      
      orders[0].items = items;
    }
    
    return orders[0];
  }

  /**
   * Find all orders with filters
   */
  async findAll(filters = {}) {
    const { status, search, limit = 10, offset = 0 } = filters;
    
    let query = `
      SELECT o.*, 
             u.name as user_name, 
             u.email as user_email,
             o.shipping_name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (o.order_number LIKE ? OR o.shipping_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await this.db.query(query, params);
    return orders;
  }

  /**
   * Find user orders
   */
  async findByUser(userId, filters = {}) {
    const { status, limit = 10, offset = 0 } = filters;
    
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [orders] = await this.db.query(query, params);
    return orders;
  }

  /**
   * Update order status
   */
  async updateStatus(id, status) {
    let additionalFields = '';
    
    if (status === 'shipped') {
      additionalFields = ', shipped_at = NOW()';
    } else if (status === 'delivered') {
      additionalFields = ', delivered_at = NOW()';
    } else if (status === 'cancelled') {
      additionalFields = ', cancelled_at = NOW()';
    }
    
    const [result] = await this.db.query(
      `UPDATE orders SET status = ?, updated_at = NOW()${additionalFields} WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(id, status) {
    let additionalFields = '';
    
    if (status === 'paid') {
      additionalFields = ', paid_at = NOW()';
    }
    
    const [result] = await this.db.query(
      `UPDATE orders SET payment_status = ?, updated_at = NOW()${additionalFields} WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Cancel order
   */
  async cancel(id) {
    const [result] = await this.db.query(
      'UPDATE orders SET status = ?, cancelled_at = NOW() WHERE id = ?',
      ['cancelled', id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Count orders
   */
  async count(filters = {}) {
    const { status, search } = filters;
    
    let query = 'SELECT COUNT(*) as total FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (order_number LIKE ? OR shipping_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const [result] = await this.db.query(query, params);
    return result[0].total;
  }

  /**
   * Get user order statistics
   */
  async getUserStats(userId) {
    const [stats] = await this.db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total), 0) as total_spent,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders 
      WHERE user_id = ?
    `, [userId]);
    
    return stats[0];
  }

  /**
   * Get recent orders
   */
  async getRecent(limit = 5) {
    const [orders] = await this.db.query(`
      SELECT o.*, 
             u.name as user_name,
             o.shipping_name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC 
      LIMIT ?
    `, [limit]);
    return orders;
  }

  /**
   * Get sales statistics
   */
  async getSalesStats() {
    const [stats] = await this.db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total), 0) as total_revenue,
        COALESCE(AVG(total), 0) as average_order_value,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_orders,
        COUNT(CASE WHEN payment_status = 'unpaid' THEN 1 END) as unpaid_orders
      FROM orders
    `);
    
    return stats[0];
  }

  /**
   * Cart operations
   */
  async getCartItems(userId) {
    const [items] = await this.db.query(`
      SELECT c.*, p.name, p.price, p.image, p.stock, p.slug
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.is_active = 1
    `, [userId]);
    
    return items;
  }

  async addToCart(data) {
    const { user_id, product_id, quantity } = data;
    
    // Check if item already exists in cart
    const [existing] = await this.db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );

    if (existing.length > 0) {
      // Update quantity
      const [result] = await this.db.query(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, user_id, product_id]
      );
      return result.affectedRows > 0;
    } else {
      // Insert new item
      const [result] = await this.db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity]
      );
      return result.affectedRows > 0;
    }
  }

  async updateCartItem(id, quantity, userId) {
    const [result] = await this.db.query(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, id, userId]
    );
    return result.affectedRows > 0;
  }

  async removeFromCart(id, userId) {
    const [result] = await this.db.query(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  async clearCart(userId) {
    await this.db.query(
      'DELETE FROM cart WHERE user_id = ?',
      [userId]
    );
    // Selalu return true karena tujuannya adalah cart kosong (tidak peduli apakah ada data yang dihapus)
    return true;
  }
}

module.exports = Order;