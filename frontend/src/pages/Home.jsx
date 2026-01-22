import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/Api';
import ProductCard from '../commponents/ProductCart';
import LoadingSpinner from '../commponents/LoadingSpinner';

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/uploads';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await productService.getFeaturedProducts(6);
            setFeaturedProducts(response.data);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
                        <section className="hero-modern">
                            <div className="container">
                                <div className="hero-grid">
                                    <div className="hero-content-left">
                                        <h1>
                                            Discover Your <br />
                                            <span className="gradient-text">Unique Style</span>
                                        </h1>
                                        <p>
                                            Jelajahi ribuan fashion item dari seller terpercaya. 
                                            Temukan gaya yang cocok untuk Anda.
                                        </p>
                                        <div className="hero-buttons">
                                            <Link to="/products" className="btn btn-primary-gradient">
                                                Mulai Belanja
                                            </Link>


                                        </div>
                                    </div>
                                    <div className="hero-image-right">
                                        <div className="hero-image-wrapper">
                                            <img 
                                                src={`${IMAGE_URL}/aset_bro/amba.jpeg`}
                                                alt="Fashion Model" 
                                            />
                                            <div className="image-backdrop"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

            {/* Featured Products */}
            <section className="featured-products">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2>Produk Unggulan</h2>
                            <p className="section-subtitle">Pilihan terbaik minggu ini</p>
                        </div>
                        <Link to="/products" className="view-all">
                            Lihat Semua →
                        </Link>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2>Kategori Populer</h2>
                            <p className="section-subtitle">Belanja berdasarkan kategori</p>
                        </div>
                    </div>
                    <div className="category-grid">
                        <Link to="/products?category=men" className="category-card-modern">
                            <div className="category-icon">👔</div>
                            <h3>Pria</h3>
                            <p>Fashion untuk pria</p>
                        </Link>
                        <Link to="/products?category=women" className="category-card-modern">
                            <div className="category-icon">👗</div>
                            <h3>Wanita</h3>
                            <p>Fashion untuk wanita</p>
                        </Link>
                        <Link to="/products?category=accessories" className="category-card-modern">
                            <div className="category-icon">👜</div>
                            <h3>Aksesoris</h3>
                            <p>Pelengkap gaya</p>
                        </Link>
                        <Link to="/products?category=shoes" className="category-card-modern">
                            <div className="category-icon">👟</div>
                            <h3>Sepatu</h3>
                            <p>Alas kaki stylish</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🚚</div>
                            <h3>Gratis Ongkir</h3>
                            <p>Untuk pembelian di atas Rp 100.000</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3>Pembayaran Aman</h3>
                            <p>Transaksi terjamin 100% aman</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">↩️</div>
                            <h3>Easy Return</h3>
                            <p>Pengembalian mudah dalam 7 hari</p>
                        </div>
                        
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;