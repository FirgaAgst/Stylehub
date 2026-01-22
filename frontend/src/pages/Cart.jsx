import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../services/Api';
import LoadingSpinner from '../commponents/LoadingSpinner';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, loading, updateCartItem, removeFromCart, getCartTotal, getCartCount, loadCart } = useCart();

    useEffect(() => {
        loadCart();
    }, []);

    const shippingCost = 15000;
    const subtotal = getCartTotal();
    const total = subtotal + shippingCost;

    const handleCheckout = () => {
        if (!user) {
            navigate('/login', { state: { from: '/checkout' } });
            return;
        }
        navigate('/checkout');
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (cart.length === 0) {
        return (
            <div className="container" style={{ paddingTop: '120px' }}>
                <div className="empty-cart">
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
                    <h2>Keranjang Belanja Kosong</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                        Belum ada produk di keranjang Anda
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        Mulai Belanja
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <h1 style={{ color: 'var(--text-primary)', marginBottom: '30px' }}>Keranjang Belanja</h1>

            <div className="cart-container">
                {/* Cart Items */}
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img 
                                src={getImageUrl(item.image)} 
                                alt={item.name}
                                className="cart-item-image"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                }}
                            />
                            
                            <div style={{ flex: 1 }}>
                                <h3 className="cart-item-name">{item.name}</h3>
                                <p className="cart-item-price">
                                    Rp {item.price.toLocaleString('id-ID')}
                                </p>
                            </div>

                            <div className="quantity-control">
                                <button 
                                    className="qty-btn"
                                    onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={loading}
                                >
                                    -
                                </button>
                                <span className="qty-display">{item.quantity}</span>
                                <button 
                                    className="qty-btn"
                                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                    disabled={loading}
                                >
                                    +
                                </button>
                            </div>

                            <div className="cart-item-total">
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </div>

                            <button 
                                className="remove-btn"
                                onClick={() => removeFromCart(item.id)}
                                disabled={loading}
                                title="Hapus dari keranjang"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="cart-summary">
                    <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Ringkasan Belanja</h3>
                    
                    <div className="summary-row">
                        <span>Subtotal ({getCartCount()} item)</span>
                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    
                    <div className="summary-row">
                        <span>Ongkos Kirim</span>
                        <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="summary-total">
                        <span>Total</span>
                        <span>Rp {total.toLocaleString('id-ID')}</span>
                    </div>

                    <button 
                        className="btn btn-primary-gradient"
                        style={{ width: '100%', marginTop: '20px' }}
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {user ? 'Lanjut ke Pembayaran' : 'Login untuk Checkout'}
                    </button>

                    <button 
                        className="btn btn-outline-light"
                        style={{ width: '100%', marginTop: '12px' }}
                        onClick={() => navigate('/products')}
                    >
                        Lanjut Belanja
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;