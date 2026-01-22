import api from './Api';

const adminService = {
    // Dashboard
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

    // Category Management
    getAllCategories: async () => {
        const response = await api.get('/admin/categories');
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

export default adminService;