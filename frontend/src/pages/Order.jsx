import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/Api';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await orderService.getUserOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      processing: { bg: '#dbeafe', text: '#1e40af' },
      shipped: { bg: '#e0e7ff', text: '#3730a3' },
      delivered: { bg: '#d1fae5', text: '#065f46' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || colors.pending;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Yakin ingin membatalkan pesanan ini?')) return;

    try {
      await orderService.cancelOrder(orderId);
      alert('Pesanan berhasil dibatalkan');
      loadOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal membatalkan pesanan');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <h1 style={{ 
        fontSize: '36px', 
        marginBottom: '30px', 
        color: '#ffffff',
        fontWeight: '700'
      }}>
        Pesanan Saya
      </h1>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '30px',
        borderBottom: '2px solid rgba(192, 38, 211, 0.2)',
        paddingBottom: '0',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setFilter('all')}
          style={{
            padding: '12px 24px',
            background: filter === 'all' ? 'rgba(192, 38, 211, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: filter === 'all' ? '3px solid #c026d3' : '3px solid transparent',
            color: filter === 'all' ? '#c026d3' : '#a1a1a1',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Semua
        </button>
        <button 
          onClick={() => setFilter('pending')}
          style={{
            padding: '12px 24px',
            background: filter === 'pending' ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: filter === 'pending' ? '3px solid #eab308' : '3px solid transparent',
            color: filter === 'pending' ? '#eab308' : '#a1a1a1',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Menunggu
        </button>
        <button 
          onClick={() => setFilter('processing')}
          style={{
            padding: '12px 24px',
            background: filter === 'processing' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: filter === 'processing' ? '3px solid #3b82f6' : '3px solid transparent',
            color: filter === 'processing' ? '#3b82f6' : '#a1a1a1',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Diproses
        </button>
        <button 
          onClick={() => setFilter('shipped')}
          style={{
            padding: '12px 24px',
            background: filter === 'shipped' ? 'rgba(147, 51, 234, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: filter === 'shipped' ? '3px solid #9333ea' : '3px solid transparent',
            color: filter === 'shipped' ? '#9333ea' : '#a1a1a1',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Dikirim
        </button>
        <button 
          onClick={() => setFilter('delivered')}
          style={{
            padding: '12px 24px',
            background: filter === 'delivered' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
            border: 'none',
            borderBottom: filter === 'delivered' ? '3px solid #22c55e' : '3px solid transparent',
            color: filter === 'delivered' ? '#22c55e' : '#a1a1a1',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Selesai
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(192, 38, 211, 0.2)'
        }}>
          <Package size={64} color="#6b7280" style={{ opacity: 0.5 }} />
          <h3 style={{ marginTop: '20px', fontSize: '24px', color: '#ffffff' }}>Belum ada pesanan</h3>
          <p style={{ color: '#a1a1a1', marginTop: '8px', marginBottom: '24px' }}>
            Mulai belanja dan buat pesanan pertama Anda
          </p>
          <button 
            onClick={() => navigate('/products')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(192, 38, 211, 0.3)'
            }}
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => {
            const statusColors = {
              pending: { bg: '#eab308', text: '#000000' },
              processing: { bg: '#3b82f6', text: '#ffffff' },
              shipped: { bg: '#9333ea', text: '#ffffff' },
              delivered: { bg: '#22c55e', text: '#ffffff' },
              cancelled: { bg: '#ef4444', text: '#ffffff' }
            };
            const statusColor = statusColors[order.status] || statusColors.pending;
            const statusLabels = {
              pending: 'Pending',
              processing: 'Processing',
              shipped: 'Shipped',
              delivered: 'Delivered',
              cancelled: 'Cancelled'
            };
            
            return (
              <div 
                key={order.id} 
                style={{ 
                  padding: '24px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                  borderRadius: '20px',
                  border: '1px solid rgba(192, 38, 211, 0.2)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ 
                      fontWeight: '700', 
                      fontSize: '18px',
                      color: '#ffffff',
                      marginBottom: '6px'
                    }}>
                      {order.order_number}
                    </div>
                    <div style={{ fontSize: '14px', color: '#a1a1a1' }}>
                      {new Date(order.created_at).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <span style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '700',
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                    textTransform: 'capitalize',
                    boxShadow: `0 4px 15px ${statusColor.bg}40`
                  }}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                {/* Order Items */}
                <div style={{ 
                  borderTop: '1px solid rgba(192, 38, 211, 0.2)', 
                  paddingTop: '20px', 
                  marginBottom: '20px' 
                }}>
                  {order.items && order.items.map(item => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      gap: '16px', 
                      marginBottom: '16px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      border: '1px solid rgba(192, 38, 211, 0.1)'
                    }}>
                      <div style={{ fontSize: '32px' }}>📦</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                          {item.product_name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#a1a1a1' }}>
                          {item.quantity} x Rp {item.product_price.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div style={{ 
                        fontWeight: '700',
                        color: '#c026d3',
                        fontSize: '16px'
                      }}>
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '20px', 
                  borderTop: '1px solid rgba(192, 38, 211, 0.2)' 
                }}>
                  <div>
                    <div style={{ fontSize: '14px', color: '#a1a1a1', marginBottom: '6px' }}>
                      Total Pembayaran
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Rp {order.total.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        style={{
                          padding: '12px 24px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid #ef4444',
                          borderRadius: '12px',
                          color: '#ef4444',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Batalkan
                      </button>
                    )}
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(192, 38, 211, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;