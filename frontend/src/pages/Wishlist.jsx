import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import { productService, getImageUrl } from '../services/Api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [user, navigate]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await productService.getWishlist();
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await productService.removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('❌ Gagal menghapus dari wishlist');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      alert('✅ Produk berhasil ditambahkan ke keranjang!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Gagal menambahkan produk ke keranjang');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          <Heart style={{ display: 'inline', marginRight: '10px', color: '#c026d3' }} />
          Wishlist Saya
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          {wishlist.length} produk yang Anda sukai
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(192, 38, 211, 0.1)'
        }}>
          <Heart size={80} style={{ 
            color: '#c026d3', 
            opacity: 0.3,
            marginBottom: '20px'
          }} />
          <h2 style={{ 
            fontSize: '24px', 
            color: '#333',
            marginBottom: '15px'
          }}>
            Wishlist Anda Masih Kosong
          </h2>
          <p style={{ 
            color: '#666', 
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            Mulai tambahkan produk favorit Anda ke wishlist!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
            style={{
              padding: '12px 40px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Jelajahi Produk
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {wishlist.map((product) => {
            const discount = product.discount || 0;
            const discountedPrice = product.price - (product.price * discount / 100);

            return (
              <div 
                key={product.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(192, 38, 211, 0.1)',
                  position: 'relative'
                }}
                className="wishlist-item"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.querySelector('svg').style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.querySelector('svg').style.color = '#ef4444';
                  }}
                  title="Hapus dari Wishlist"
                >
                  <Trash2 size={18} style={{ color: '#ef4444', transition: 'color 0.3s ease' }} />
                </button>

                {/* Product Image */}
                <div 
                  style={{
                    width: '100%',
                    height: '280px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img 
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  {discount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#ef4444',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      -{discount}%
                    </span>
                  )}
                  {product.is_featured && (
                    <span style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Featured
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div style={{ padding: '16px' }}>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#c026d3',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    {product.category_name || 'Uncategorized'}
                  </p>

                  <h3 
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      minHeight: '48px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#c026d3'
                    }}>
                      Rp {discountedPrice.toLocaleString('id-ID')}
                    </span>
                    {discount > 0 && (
                      <span style={{
                        fontSize: '14px',
                        color: '#999',
                        textDecoration: 'line-through',
                        marginLeft: '8px'
                      }}>
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>

                  {/* Stock Info */}
                  <p style={{
                    fontSize: '13px',
                    color: product.stock > 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                  </p>

                  {/* Rating */}
                  {product.rating > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <span style={{ color: '#fbbf24', fontSize: '14px' }}>⭐ {product.rating}</span>
                      <span style={{ color: '#999', fontSize: '13px' }}>
                        ({product.reviews_count || 0} review)
                      </span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <ShoppingCart size={18} />
                    {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .wishlist-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(192, 38, 211, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;
