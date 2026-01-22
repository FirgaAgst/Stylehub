import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './commponents/PrivateRoute';

// Pages
import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Order from './pages/Order';
import OrderDetail from './pages/OrderDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDasboard';

// Components
import Header from './commponents/Header';
import Footer from './commponents/Footer';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="app">
                        <Header />
                        <main className="main-content" style={{ marginTop: 'var(--header-height)' }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Product />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                <Route path="/cart" element={
                                    <PrivateRoute>
                                        <Cart />
                                    </PrivateRoute>
                                } />
                                <Route path="/checkout" element={
                                    <PrivateRoute>
                                        <Checkout />
                                    </PrivateRoute>
                                } />
                                <Route path="/orders" element={
                                    <PrivateRoute>
                                        <Order />
                                    </PrivateRoute>
                                } />
                                <Route path="/orders/:id" element={
                                    <PrivateRoute>
                                        <OrderDetail />
                                    </PrivateRoute>
                                } />

                                <Route path="/admin/*" element={
                                    <PrivateRoute adminOnly>
                                        <AdminDashboard />
                                    </PrivateRoute>
                                } />

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;