import api from './Api';

const orderService = {
    // Create order
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Get user orders
    getUserOrders: async (params = {}) => {
        const response = await api.get('/orders/my-orders', { params });
        return response.data;
    },

    // Get single order
    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Get order statistics
    getOrderStats: async () => {
        const response = await api.get('/orders/stats');
        return response.data;
    },

    // Cancel order
    cancelOrder: async (id) => {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
    },

    // Cart operations
    getCart: async () => {
        const response = await api.get('/orders/cart/items');
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
    }
};

export default orderService;