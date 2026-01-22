class Product {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all products with filters
   */
  async findAll(filters = {}) {
    const { search, category, status, limit = 10, offset = 0 } = filters;
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (status !== undefined) {
      query += ' AND p.is_active = ?';
      params.push(status === 'active' ? 1 : 0);
    } else {
      query += ' AND p.is_active = 1';
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await this.db.query(query, params);
    return products;
  }

  /**
   * Find product by ID
   */
  async findById(id) {
    const [products] = await this.db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    return products[0];
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug) {
    const [products] = await this.db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `, [slug]);
    return products[0];
  }

  /**
   * Create new product
   */
  async create(productData) {
    const {
      name, slug, description, category_id, price, old_price,
      stock, image, images, is_featured = false, is_active = true
    } = productData;

    const [result] = await this.db.query(`
      INSERT INTO products (
        name, slug, description, category_id, price, old_price,
        stock, image, images, is_featured, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, slug, description, category_id, price, old_price || null,
      stock, image, images ? JSON.stringify(images) : null, 
      is_featured, is_active
    ]);

    return result.insertId;
  }

  /**
   * Update product
   */
  async update(id, productData) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'name', 'slug', 'description', 'category_id', 'price', 
      'old_price', 'stock', 'image', 'images', 'is_featured', 'is_active'
    ];

    allowedFields.forEach(key => {
      if (productData[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'images' && productData[key]) {
          values.push(JSON.stringify(productData[key]));
        } else {
          values.push(productData[key]);
        }
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await this.db.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  /**
   * Delete product (soft delete)
   */
  async delete(id) {
    const [result] = await this.db.query(
      'UPDATE products SET is_active = 0 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Count products
   */
  async count(filters = {}) {
    const { search, category, status } = filters;
    
    let query = `
      SELECT COUNT(*) as total 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (status !== undefined) {
      query += ' AND p.is_active = ?';
      params.push(status === 'active' ? 1 : 0);
    } else {
      query += ' AND p.is_active = 1';
    }

    const [result] = await this.db.query(query, params);
    return result[0].total;
  }

  /**
   * Get featured products
   */
  async getFeatured(limit = 5) {
    const [products] = await this.db.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = 1 AND p.is_active = 1
      ORDER BY p.created_at DESC 
      LIMIT ?
    `, [limit]);
    return products;
  }

  /**
   * Get categories
   */
  async getCategories() {
    const [categories] = await this.db.query(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.name
    `);
    return categories;
  }

  /**
   * Update product rating
   */
  async updateRating(productId) {
    await this.db.query(`
      UPDATE products p
      SET 
        p.rating = (SELECT COALESCE(AVG(r.rating), 0) FROM reviews r WHERE r.product_id = p.id),
        p.reviews_count = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id)
      WHERE p.id = ?
    `, [productId]);
  }

  /**
   * Get top selling products
   */
  async getTopSelling(limit = 5) {
    const [rows] = await this.db.query(`
      SELECT 
        p.*,
        c.name as category_name,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'cancelled'
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT ?
    `, [parseInt(limit)]);
    return rows;
  }
}

module.exports = Product;