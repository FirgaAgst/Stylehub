import api from './Api';

const productService = {
    // Get all products
    getAllProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    // Get featured products
    getFeaturedProducts: async (limit = 5) => {
        const response = await api.get(`/products/featured?limit=${limit}`);
        return response.data;
    },

    // Get single product
    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Get products by category
    getProductsByCategory: async (slug, params = {}) => {
        const response = await api.get(`/products/category/${slug}`, { params });
        return response.data;
    },

    // Get categories
    getCategories: async () => {
        const response = await api.get('/products/categories');
        return response.data;
    },

    // Create review
    createReview: async (productId, reviewData) => {
        const response = await api.post(`/products/${productId}/reviews`, reviewData);
        return response.data;
    },

    // Wishlist operations
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

export default productService;