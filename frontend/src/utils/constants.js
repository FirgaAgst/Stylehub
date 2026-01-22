export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5000/uploads';

export const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai',
    cancelled: 'Dibatalkan'
};

export const PAYMENT_STATUS = {
    UNPAID: 'unpaid',
    PAID: 'paid',
    REFUNDED: 'refunded'
};

export const PAYMENT_STATUS_LABELS = {
    unpaid: 'Belum Dibayar',
    paid: 'Sudah Dibayar',
    refunded: 'Dikembalikan'
};

export const PAYMENT_METHODS = [
    { value: 'bank_transfer', label: 'Transfer Bank' },
    { value: 'cod', label: 'COD (Bayar di Tempat)' },
    { value: 'e_wallet', label: 'E-Wallet' }
];