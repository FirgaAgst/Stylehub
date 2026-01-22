import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
        }
    };

    return (
        <header className="site-header">
            <div className="logo" onClick={() => navigate('/')}>
                Style <span className="accent">Hub</span>
            </div>

            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/products">Browse</Link>
                {isAuthenticated() && user?.role === 'seller' && (
                    <Link to="/upload">Upload</Link>
                )}
                {isAuthenticated() && user?.role === 'admin' && (
                    <Link to="/admin">Dashboard</Link>
                )}
            </nav>

            <form className="search" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Cari produk..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            <div className="header-icons">
                {isAuthenticated() ? (
                    <>
                        <div className="icon-btn" onClick={() => navigate('/wishlist')} title="Wishlist">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>

                        <div className="icon-btn" onClick={() => navigate('/cart')} title="Cart">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="badge">{getCartCount()}</span>
                            )}
                        </div>

                        <div className="icon-btn" onClick={() => navigate('/profile')} title="Profile">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>

                        <button onClick={logout} className="btn btn-ghost" style={{ marginLeft: '8px' }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <div className="icon-btn" onClick={() => navigate('/cart')} title="Cart">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="badge">{getCartCount()}</span>
                            )}
                        </div>

                        <button onClick={() => navigate('/login')} className="btn btn-primary">
                            Login
                        </button>
                    </>
                )}
            </div>

            <button className="mobile-menu-btn icon-btn">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </header>
    );
};

export default Header;