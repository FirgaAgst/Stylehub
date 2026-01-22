import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/Api';
import ProductCard from '../commponents/ProductCart';
import CategoryFilter from '../commponents/CategoryFilter';
import LoadingSpinner from '../commponents/LoadingSpinner';

const Product = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({});
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, search, currentPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            
            const params = {
                page: currentPage,
                limit: 12
            };

            if (search) params.search = search;
            if (selectedCategory) params.category = selectedCategory;

            const response = await productService.getAllProducts(params);

            if (response.success) {
                setProducts(response.data || []);
                setPagination(response.pagination || {});
            } else {
                throw new Error(response.message || 'Failed to load products');
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Error fetching products:', error);
            }
            const errorMessage = error.response?.data?.message || error.message || 'Gagal memuat produk';
            setError(errorMessage);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        
        if (category) {
            searchParams.set('category', category);
        } else {
            searchParams.delete('category');
        }
        setSearchParams(searchParams);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        
        if (search) {
            searchParams.set('search', search);
        } else {
            searchParams.delete('search');
        }
        setSearchParams(searchParams);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        console.log('🔄 Resetting filters');
        setSelectedCategory(null);
        setCurrentPage(1);
        setSearchParams({});
    };

    return (
        <div className="product-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="container">
                <div className="page-header">
                    <div>
                        <h1 style={{ color: '#ffffff' }}>Produk Kami</h1>
                        {pagination.total > 0 && (
                            <p style={{ color: '#a1a1a1', fontSize: '0.95rem', marginTop: '8px' }}>
                                Menampilkan {products.length} dari {pagination.total} produk
                            </p>
                        )}
                    </div>
                    
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                            🔍 Cari
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="alert alert-danger" style={{ 
                        marginBottom: '20px',
                        padding: '16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444'
                    }}>
                        <strong>Error:</strong> {error}
                        <button 
                            onClick={fetchProducts}
                            style={{ 
                                marginLeft: '16px',
                                padding: '4px 12px',
                                background: 'transparent',
                                border: '1px solid #ef4444',
                                borderRadius: '4px',
                                color: '#ef4444',
                                cursor: 'pointer'
                            }}
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                <div className="product-content">
                    {/* Sidebar Filter */}
                    <aside className="sidebar">
                        <CategoryFilter
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                        
                        {(search || selectedCategory) && (
                            <button 
                                onClick={handleReset}
                                className="btn btn-secondary"
                                style={{ width: '100%', marginTop: '16px' }}
                            >
                                Reset Filter
                            </button>
                        )}
                    </aside>

                    {/* Products Section */}
                    <section className="products-section">
                        {loading ? (
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                minHeight: '400px'
                            }}>
                                <LoadingSpinner />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <div className="products-grid">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="pagination" style={{ marginTop: '40px' }}>
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="btn btn-secondary"
                                        >
                                            ← Previous
                                        </button>
                                        
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`btn ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                                                style={{
                                                    minWidth: '40px',
                                                    background: currentPage === page ? '#c026d3' : 'transparent'
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === pagination.totalPages}
                                            className="btn btn-secondary"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-products" style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                background: 'rgba(30, 30, 30, 0.5)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
                                <h3 style={{ color: '#ffffff', marginBottom: '12px' }}>
                                    {search || selectedCategory 
                                        ? 'Tidak ada produk yang sesuai' 
                                        : 'Belum ada produk'}
                                </h3>
                                <p style={{ color: '#a1a1a1', marginBottom: '24px' }}>
                                    {search && `Pencarian: "${search}"`}
                                    {selectedCategory && ` | Kategori: ${selectedCategory}`}
                                </p>
                                {(search || selectedCategory) && (
                                    <button 
                                        onClick={handleReset}
                                        className="btn btn-primary"
                                    >
                                        Lihat Semua Produk
                                    </button>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Product;