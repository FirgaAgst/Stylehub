import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000/uploads';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 seconds timeout
});

// Request interceptor - add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', error.response?.data || error.message);
        }
        
        return Promise.reject(error);
    }
);

// Helper function untuk image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_URL}/${imagePath}`;
};

// ========================================
// AUTH SERVICE
// ========================================
export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await api.put('/auth/change-password', passwordData);
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.role === 'admin';
    }
};

// ========================================
// PRODUCT SERVICE
// ========================================
export const productService = {
    getAllProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    getFeaturedProducts: async (limit = 5) => {
        const response = await api.get(`/products/featured?limit=${limit}`);
        return response.data;
    },

    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    getProductsByCategory: async (slug, params = {}) => {
        const response = await api.get(`/products/category/${slug}`, { params });
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/products/categories');
        return response.data;
    },

    createReview: async (productId, reviewData) => {
        const response = await api.post(`/products/${productId}/reviews`, reviewData);
        return response.data;
    },

    updateReview: async (reviewId, reviewData) => {
        const response = await api.put(`/products/reviews/${reviewId}`, reviewData);
        return response.data;
    },

    deleteReview: async (reviewId) => {
        const response = await api.delete(`/products/reviews/${reviewId}`);
        return response.data;
    },

    getWishlist: async () => {
        const response = await api.get('/products/wishlist/me');
        return response.data;
    },

    addToWishlist: async (productId) => {
        const response = await api.post(`/products/${productId}/wishlist`);
        return response.data;
    },

    removeFromWishlist: async (productId) => {
        const response = await api.delete(`/products/${productId}/wishlist`);
        return response.data;
    }
};

// ========================================
// ORDER SERVICE
// ========================================
export const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    getUserOrders: async (params = {}) => {
        const response = await api.get('/orders', { params });
        return response.data;
    },

    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    getOrderStats: async () => {
        const response = await api.get('/orders/stats');
        return response.data;
    },

    cancelOrder: async (id) => {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
    },

    getCart: async () => {
        const response = await api.get('/orders/cart');
        return response.data;
    },

    addToCart: async (productId, quantity) => {
        const response = await api.post('/orders/cart', { product_id: productId, quantity });
        return response.data;
    },

    updateCartItem: async (itemId, quantity) => {
        const response = await api.put(`/orders/cart/${itemId}`, { quantity });
        return response.data;
    },

    removeFromCart: async (itemId) => {
        const response = await api.delete(`/orders/cart/${itemId}`);
        return response.data;
    },

    clearCart: async () => {
        const response = await api.delete('/orders/cart');
        return response.data;
    },

    // Review functions
    createReview: async (reviewData) => {
        const response = await api.post('/orders/reviews', reviewData);
        return response.data;
    },

    getOrderWithReviews: async (orderId) => {
        const response = await api.get(`/orders/${orderId}/reviews`);
        return response.data;
    }
};

// ========================================
// ADMIN SERVICE
// ========================================
export const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    // Product Management
    getAllProducts: async (params = {}) => {
        const response = await api.get('/admin/products', { params });
        return response.data;
    },

    createProduct: async (formData) => {
        const response = await api.post('/admin/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    updateProduct: async (id, formData) => {
        const response = await api.put(`/admin/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    },

    toggleFeatured: async (id) => {
        const response = await api.patch(`/admin/products/${id}/featured`);
        return response.data;
    },

    toggleFeaturedProduct: async (id) => {
        const response = await api.patch(`/admin/products/${id}/featured`);
        return response.data;
    },

    // Order Management
    getAllOrders: async (params = {}) => {
        const response = await api.get('/admin/orders', { params });
        return response.data;
    },

    getOrder: async (id) => {
        const response = await api.get(`/admin/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/admin/orders/${id}/status`, { status });
        return response.data;
    },

    updatePaymentStatus: async (id, status) => {
        const response = await api.put(`/admin/orders/${id}/payment`, { status });
        return response.data;
    },

    deleteOrder: async (id) => {
        const response = await api.delete(`/admin/orders/${id}`);
        return response.data;
    },

    // User Management
    getAllUsers: async (params = {}) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    getUser: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    updateUserStatus: async (id, status) => {
        const response = await api.patch(`/admin/users/${id}/status`, { status });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    // Category Management
    getAllCategories: async () => {
        const response = await api.get('/admin/categories');
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/admin/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/admin/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    }
};

export default api;