import { UPLOAD_URL } from './constants';

// Format currency to IDR
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format datetime
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Get image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${UPLOAD_URL}/products/${imagePath}`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Get order status badge class
export const getOrderStatusClass = (status) => {
    const statusClasses = {
        pending: 'badge-warning',
        processing: 'badge-info',
        shipped: 'badge-primary',
        delivered: 'badge-success',
        cancelled: 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
};

// Get payment status badge class
export const getPaymentStatusClass = (status) => {
    const statusClasses = {
        unpaid: 'badge-warning',
        paid: 'badge-success',
        refunded: 'badge-danger'
    };
    return statusClasses[status] || 'badge-secondary';
};

// Calculate discount percentage
export const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

// Validate email
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Validate phone number (Indonesia)
export const isValidPhone = (phone) => {
    const re = /^(\+62|62|0)[0-9]{9,12}$/;
    return re.test(phone);
};

// Handle API errors
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error
        return error.response.data.message || 'Terjadi kesalahan pada server';
    } else if (error.request) {
        // Request made but no response
        return 'Tidak dapat terhubung ke server';
    } else {
        // Something else happened
        return error.message || 'Terjadi kesalahan';
    }
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Generate slug from string
export const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};