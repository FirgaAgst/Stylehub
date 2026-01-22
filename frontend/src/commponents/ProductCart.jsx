import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { getImageUrl } from '../services/Api';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = async () => {
        try {
            await addToCart(product, 1);
            alert('Produk berhasil ditambahkan ke keranjang!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Gagal menambahkan ke keranjang');
        }
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
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

    const discount = product.discount || 0;
    const discountedPrice = product.price - (product.price * discount / 100);

    return (
        <div className="product-card">
            <Link to={`/products/${product.id}`} className="product-image">
                <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                    }}
                />
                {discount > 0 && (
                    <span className="discount-badge">-{discount}%</span>
                )}
                {product.is_featured && (
                    <span className="featured-badge">Featured</span>
                )}
                
                {/* Wishlist Button */}
                <button 
                    className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                    title={inWishlist ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                >
                    <Heart 
                        size={20} 
                        fill={inWishlist ? '#c026d3' : 'none'}
                        stroke={inWishlist ? '#c026d3' : '#666'}
                    />
                </button>
            </Link>

            <div className="product-info">
                <p className="product-category">{product.category_name || 'Uncategorized'}</p>
                <Link to={`/products/${product.id}`}>
                    <h3 className="product-name">{product.name}</h3>
                </Link>
                
                <div className="product-price">
                    <span className="current-price">
                        Rp {discountedPrice.toLocaleString('id-ID')}
                    </span>
                    {discount > 0 && (
                        <span className="old-price">
                            Rp {product.price.toLocaleString('id-ID')}
                        </span>
                    )}
                </div>

                <p className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                    {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                </p>

                {product.rating && (
                    <div className="product-rating">
                        <span className="stars">⭐ {product.rating}</span>
                        <span className="count">({product.reviews_count || 0})</span>
                    </div>
                )}

                <button 
                    className="btn btn-primary btn-add-cart"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? 'Habis' : 'Tambah ke Keranjang'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;