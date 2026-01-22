import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package, Truck, ShieldCheck } from 'lucide-react';
import { productService, getImageUrl } from '../services/Api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const inWishlist = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product, quantity);
      alert('✅ Produk berhasil ditambahkan ke keranjang!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Gagal menambahkan produk ke keranjang');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('❌ Gagal memperbarui wishlist');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2>Produk tidak ditemukan</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>
          Kembali ke Produk
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="back-btn mb-3"
        style={{
          padding: '10px 20px',
          background: 'rgba(192, 38, 211, 0.1)',
          border: '1px solid #c026d3',
          borderRadius: '8px',
          color: '#c026d3',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontWeight: '500'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#c026d3';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(192, 38, 211, 0.1)';
          e.currentTarget.style.color = '#c026d3';
        }}
      >
        ← Kembali
      </button>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px',
        marginBottom: '60px'
      }}>
        {/* Product Image */}
        <div style={{
          position: 'sticky',
          top: '100px',
          height: 'fit-content'
        }}>
          <div style={{ 
            width: '100%',
            aspectRatio: '1/1',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(192, 38, 211, 0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div style="text-align: center; padding: 60px 20px;">
                    <div style="width: 120px; height: 120px; margin: 0 auto 20px; background: rgba(192, 38, 211, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c026d3" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <p style="color: #a1a1a1; font-size: 16px; margin: 0;">${product.name}</p>
                  </div>
                `;
              }}
            />
          </div>

          {/* Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '20px'
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(192, 38, 211, 0.05)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(192, 38, 211, 0.1)'
            }}>
              <Package size={24} color="#c026d3" style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '12px', color: '#a1a1a1' }}>Kualitas Premium</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(192, 38, 211, 0.05)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(192, 38, 211, 0.1)'
            }}>
              <Truck size={24} color="#c026d3" style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '12px', color: '#a1a1a1' }}>Gratis Ongkir</div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(192, 38, 211, 0.05)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(192, 38, 211, 0.1)'
            }}>
              <ShieldCheck size={24} color="#c026d3" style={{ marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontSize: '12px', color: '#a1a1a1' }}>Garansi Asli</div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: 'rgba(192, 38, 211, 0.1)',
              color: '#c026d3',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid rgba(192, 38, 211, 0.2)'
            }}>
              {product.category_name || 'Fashion'}
            </span>
          </div>

          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            marginBottom: '16px',
            lineHeight: '1.2',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {product.name}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  fill={i < Math.floor(product.rating || 4.5) ? '#fbbf24' : 'none'}
                  color={i < Math.floor(product.rating || 4.5) ? '#fbbf24' : '#4a4a4a'}
                />
              ))}
            </div>
            <span style={{ color: '#fbbf24', fontWeight: '600' }}>
              {product.rating || '4.5'}
            </span>
            <span style={{ color: '#6b7280' }}>
              ({product.reviews_count || 0} reviews)
            </span>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#c026d3',
              marginBottom: '8px'
            }}>
              Rp {product.price?.toLocaleString('id-ID')}
            </div>
            {product.old_price && product.old_price > product.price && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '1.2rem',
                  color: '#6b7280',
                  textDecoration: 'line-through'
                }}>
                  Rp {product.old_price.toLocaleString('id-ID')}
                </span>
                <span style={{
                  padding: '4px 12px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Save {Math.round((1 - product.price / product.old_price) * 100)}%
                </span>
              </div>
            )}
          </div>

          <div style={{
            padding: '20px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#a1a1a1' }}>Stok:</span>
              <span style={{ 
                color: product.stock > 0 ? '#22c55e' : '#ef4444',
                fontWeight: '600'
              }}>
                {product.stock > 0 ? `${product.stock} unit tersedia` : 'Habis'}
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#ffffff'
            }}>
              Jumlah
            </label>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(192, 38, 211, 0.2)'
            }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(192, 38, 211, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#c026d3'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(192, 38, 211, 0.2)'}
              >
                -
              </button>
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '700',
                minWidth: '40px',
                textAlign: 'center',
                color: '#ffffff'
              }}>
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                style={{
                  width: '40px',
                  height: '40px',
                  background: quantity >= product.stock 
                    ? 'rgba(100,100,100,0.2)' 
                    : 'rgba(192, 38, 211, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '20px',
                  cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (quantity < product.stock) {
                    e.currentTarget.style.background = '#c026d3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (quantity < product.stock) {
                    e.currentTarget.style.background = 'rgba(192, 38, 211, 0.2)';
                  }
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <div style={{
            padding: '24px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            marginBottom: '32px',
            border: '1px solid rgba(192, 38, 211, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem',
              marginBottom: '12px',
              color: '#ffffff',
              fontWeight: '600'
            }}>
              Deskripsi Produk
            </h3>
            <p style={{ 
              color: '#a1a1a1',
              lineHeight: '1.8',
              marginBottom: '16px'
            }}>
              {product.description || 'Produk fashion berkualitas tinggi dengan desain modern dan material premium. Cocok untuk berbagai acara dan aktivitas sehari-hari.'}
            </p>
            <ul style={{ 
              color: '#a1a1a1',
              paddingLeft: '20px',
              lineHeight: '2'
            }}>
            </ul>
          </div>

          {/* Actions */}
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            position: 'sticky',
            bottom: '20px',
            background: 'rgba(26, 26, 26, 0.95)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(192, 38, 211, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              style={{
                padding: '16px',
                background: inWishlist 
                  ? 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)'
                  : 'rgba(192, 38, 211, 0.1)',
                border: inWishlist ? 'none' : '2px solid #c026d3',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '60px'
              }}
              title={inWishlist ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
              onMouseEnter={(e) => {
                if (!inWishlist) {
                  e.currentTarget.style.background = 'rgba(192, 38, 211, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!inWishlist) {
                  e.currentTarget.style.background = 'rgba(192, 38, 211, 0.1)';
                }
              }}
            >
              <Heart 
                size={24} 
                fill={inWishlist ? '#ffffff' : 'none'}
                stroke={inWishlist ? '#ffffff' : '#c026d3'}
              />
            </button>

            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              style={{
                flex: 1,
                padding: '16px 32px',
                background: product.stock === 0 
                  ? 'rgba(100,100,100,0.3)'
                  : 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: product.stock === 0 
                  ? 'none'
                  : '0 8px 20px rgba(192, 38, 211, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (product.stock > 0) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(192, 38, 211, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (product.stock > 0) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(192, 38, 211, 0.3)';
                }
              }}
            >
              <ShoppingCart size={20} />
              {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(192, 38, 211, 0.1)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ 
          fontSize: '1.8rem',
          marginBottom: '24px',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          Review Produk
        </h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {product.reviews.map(review => (
              <div 
                key={review.id} 
                style={{ 
                  padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(192, 38, 211, 0.1)'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <strong style={{ color: '#ffffff' }}>{review.user_name}</strong>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < review.rating ? '#fbbf24' : 'none'}
                        color={i < review.rating ? '#fbbf24' : '#4a4a4a'}
                      />
                    ))}
                  </div>
                </div>
                <p style={{ color: '#a1a1a1', marginBottom: '8px', lineHeight: '1.6' }}>
                  {review.comment}
                </p>
                <small style={{ color: '#6b7280' }}>
                  {new Date(review.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <Star size={48} color="#4a4a4a" style={{ marginBottom: '16px' }} />
            <p style={{ margin: 0 }}>Belum ada review untuk produk ini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;