class Review {
  constructor(db) {
    this.db = db;
  }

  /**
   * Create new review
   */
  async create(reviewData) {
    const {
      product_id,
      user_id,
      order_id,
      order_item_id,
      rating,
      comment
    } = reviewData;
    
    const [result] = await this.db.query(`
      INSERT INTO reviews (
        product_id, user_id, order_id, rating, comment, is_verified_purchase
      ) VALUES (?, ?, ?, ?, ?, 1)
    `, [product_id, user_id, order_id, rating, comment]);
    
    // Update order_item to mark as reviewed
    if (order_item_id) {
      await this.db.query(`
        UPDATE order_items 
        SET is_reviewed = 1, review_id = ?
        WHERE id = ?
      `, [result.insertId, order_item_id]);
    }
    
    return result.insertId;
  }

  /**
   * Get reviews for a product
   */
  async getProductReviews(productId, filters = {}) {
    const { limit = 10, offset = 0 } = filters;
    
    const [reviews] = await this.db.query(`
      SELECT 
        r.*,
        u.name as user_name,
        u.avatar as user_avatar,
        o.order_number
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN orders o ON r.order_id = o.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [productId, parseInt(limit), parseInt(offset)]);
    
    return reviews;
  }

  /**
   * Get review by ID
   */
  async findById(id) {
    const [reviews] = await this.db.query(`
      SELECT 
        r.*,
        u.name as user_name,
        u.avatar as user_avatar,
        p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.id = ?
    `, [id]);
    
    return reviews[0];
  }

  /**
   * Update review
   */
  async update(id, reviewData) {
    const { rating, comment } = reviewData;
    
    await this.db.query(`
      UPDATE reviews 
      SET rating = ?, comment = ?, updated_at = NOW()
      WHERE id = ?
    `, [rating, comment, id]);
  }

  /**
   * Delete review
   */
  async delete(id) {
    // Get review details before deletion
    const review = await this.findById(id);
    
    if (review) {
      // Remove review_id from order_items
      await this.db.query(`
        UPDATE order_items 
        SET is_reviewed = 0, review_id = NULL
        WHERE review_id = ?
      `, [id]);
      
      // Delete the review
      await this.db.query('DELETE FROM reviews WHERE id = ?', [id]);
    }
  }

  /**
   * Check if user can review an order item
   */
  async canReview(userId, orderId, productId) {
    const [orders] = await this.db.query(`
      SELECT o.id, o.status, oi.id as order_item_id, oi.is_reviewed
      FROM orders o
      INNER JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ? 
        AND o.user_id = ? 
        AND oi.product_id = ?
        AND o.status = 'delivered'
    `, [orderId, userId, productId]);
    
    if (orders.length === 0) {
      return { canReview: false, reason: 'Order not found or not delivered' };
    }
    
    if (orders[0].is_reviewed) {
      return { canReview: false, reason: 'Item already reviewed' };
    }
    
    return { 
      canReview: true, 
      orderItemId: orders[0].order_item_id 
    };
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(userId, filters = {}) {
    const { limit = 10, offset = 0 } = filters;
    
    const [reviews] = await this.db.query(`
      SELECT 
        r.*,
        p.name as product_name,
        p.slug as product_slug,
        p.image as product_image,
        o.order_number
      FROM reviews r
      INNER JOIN products p ON r.product_id = p.id
      LEFT JOIN orders o ON r.order_id = o.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, parseInt(limit), parseInt(offset)]);
    
    return reviews;
  }

  /**
   * Get review statistics for a product
   */
  async getProductStats(productId) {
    const [stats] = await this.db.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM reviews
      WHERE product_id = ?
    `, [productId]);
    
    return stats[0];
  }

  /**
   * Check if item is already reviewed
   */
  async isItemReviewed(orderItemId) {
    const [items] = await this.db.query(`
      SELECT is_reviewed, review_id
      FROM order_items
      WHERE id = ?
    `, [orderItemId]);
    
    return items[0];
  }
}

module.exports = Review;
