import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Trash2, DollarSign, Package } from 'lucide-react';
import { adminService } from '../services/Api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await adminService.getAllOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      alert('✅ Status pesanan berhasil diupdate!');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        const response = await adminService.getOrder(orderId);
        setSelectedOrder(response.data);
      }
    } catch (error) {
      alert('❌ Gagal mengupdate status pesanan');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await adminService.updatePaymentStatus(orderId, newStatus);
      alert('✅ Status pembayaran berhasil diupdate!');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        const response = await adminService.getOrder(orderId);
        setSelectedOrder(response.data);
      }
    } catch (error) {
      alert('❌ Gagal mengupdate status pembayaran');
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await adminService.getOrder(orderId);
      setSelectedOrder(response.data);
    } catch (error) {
      alert('❌ Gagal memuat detail pesanan');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Yakin ingin menghapus pesanan ini?')) return;
    
    try {
      await adminService.deleteOrder(orderId);
      alert('✅ Pesanan berhasil dihapus!');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      alert('❌ Gagal menghapus pesanan');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '#eab308' },
      processing: { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '#3b82f6' },
      shipped: { bg: 'rgba(147, 51, 234, 0.2)', color: '#9333ea', border: '#9333ea' },
      delivered: { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '#22c55e' },
      cancelled: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '#ef4444' }
    };
    return colors[status] || colors.pending;
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' 
      ? { bg: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '#22c55e' }
      : { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '#ef4444' };
  };

  const filteredOrders = orders.filter(order =>
    order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
    order.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px', color: '#a1a1a1' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            marginBottom: '8px',
            color: '#ffffff'
          }}>
            Kelola Pesanan
          </h1>
          <p style={{ color: '#a1a1a1' }}>Total: {orders.length} pesanan</p>
        </div>
      </div>

      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: '24px'
      }}>
        <Search 
          size={20} 
          color="#a1a1a1"
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
        <input
          type="text"
          placeholder="Cari pesanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 48px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(192, 38, 211, 0.2)',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '16px'
          }}
        />
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderRadius: '24px',
        border: '1px solid rgba(192, 38, 211, 0.2)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                background: 'rgba(192, 38, 211, 0.1)',
                borderBottom: '1px solid rgba(192, 38, 211, 0.2)'
              }}>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  No. Pesanan
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Pelanggan
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Total
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Status Pesanan
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Pembayaran
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Tanggal
                </th>
                <th style={{ padding: '16px', textAlign: 'center', color: '#a1a1a1', fontWeight: '600' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusColor = getStatusColor(order.status);
                  const paymentColor = getPaymentStatusColor(order.payment_status);
                  
                  return (
                    <tr 
                      key={order.id}
                      style={{
                        borderBottom: '1px solid rgba(192, 38, 211, 0.1)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 38, 211, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px', color: '#ffffff', fontWeight: '600' }}>
                        {order.order_number}
                      </td>
                      <td style={{ padding: '16px', color: '#a1a1a1' }}>
                        {order.customer_name || order.shipping_name}
                      </td>
                      <td style={{ padding: '16px', color: '#c026d3', fontWeight: '700' }}>
                        Rp {Number(order.total || 0).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: statusColor.bg,
                          color: statusColor.color,
                          border: `1px solid ${statusColor.border}`
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: paymentColor.bg,
                          color: paymentColor.color,
                          border: `1px solid ${paymentColor.border}`
                        }}>
                          {order.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#a1a1a1' }}>
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ 
                          display: 'flex', 
                          gap: '8px',
                          justifyContent: 'center'
                        }}>
                          <button
                            onClick={() => handleViewDetails(order.id)}
                            style={{
                              padding: '8px',
                              background: 'rgba(59, 130, 246, 0.2)',
                              border: '1px solid #3b82f6',
                              borderRadius: '8px',
                              color: '#3b82f6',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            style={{
                              padding: '8px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid #ef4444',
                              borderRadius: '8px',
                              color: '#ef4444',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ 
                    padding: '60px 20px', 
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <ShoppingBag size={48} color="#4a4a4a" style={{ marginBottom: '16px' }} />
                    <p>Tidak ada pesanan ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(192, 38, 211, 0.2)',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(192, 38, 211, 0.2)'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '8px'
              }}>
                Detail Pesanan
              </h2>
              <p style={{ color: '#a1a1a1' }}>{selectedOrder.order_number}</p>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* Customer Info */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '12px' }}>
                  Informasi Pelanggan
                </h3>
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(192, 38, 211, 0.1)'
                }}>
                  <p style={{ color: '#ffffff', marginBottom: '8px' }}>
                    <strong>Nama:</strong> {selectedOrder.customer_name || selectedOrder.shipping_name}
                  </p>
                  <p style={{ color: '#ffffff', marginBottom: '8px' }}>
                    <strong>Email:</strong> {selectedOrder.user_email}
                  </p>
                  <p style={{ color: '#ffffff', marginBottom: '8px' }}>
                    <strong>Telepon:</strong> {selectedOrder.shipping_phone}
                  </p>
                  <p style={{ color: '#ffffff' }}>
                    <strong>Alamat:</strong> {selectedOrder.shipping_address}, {selectedOrder.shipping_city} {selectedOrder.shipping_postal_code}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '12px' }}>
                  Item Pesanan
                </h3>
                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                  <div 
                    key={index}
                    style={{ 
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                      border: '1px solid rgba(192, 38, 211, 0.1)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ color: '#ffffff', fontWeight: '600', marginBottom: '4px' }}>
                        {item.product_name}
                      </p>
                      <p style={{ color: '#a1a1a1', fontSize: '14px' }}>
                        Qty: {item.quantity} × Rp {Number(item.product_price || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <p style={{ color: '#c026d3', fontWeight: '700' }}>
                      Rp {Number(item.subtotal || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Status Updates */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '12px' }}>
                  Update Status
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                    Status Pesanan
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#2a2a2a',
                      border: '2px solid #c026d3',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending" style={{ background: '#ffffff', color: '#000000', padding: '8px' }}>Pending</option>
                    <option value="processing" style={{ background: '#ffffff', color: '#000000', padding: '8px' }}>Processing</option>
                    <option value="shipped" style={{ background: '#ffffff', color: '#000000', padding: '8px' }}>Shipped</option>
                    <option value="delivered" style={{ background: '#ffffff', color: '#000000', padding: '8px' }}>Delivered</option>
                    <option value="cancelled" style={{ background: '#ffffff', color: '#000000', padding: '8px' }}>Cancelled</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                    Status Pembayaran
                  </label>
                  <select
                    value={selectedOrder.payment_status}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#2a2a2a',
                      border: '2px solid #c026d3',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="unpaid" style={{ background: '#ffffff', color: '#000000', padding: '8px' }}>Belum Bayar</option>
                    <option value="paid" style={{ background: '#ffffff', color: '#000000', padding: '8px' }}>Lunas</option>
                  </select>
                </div>
              </div>

              {/* Total */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(192, 38, 211, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(192, 38, 211, 0.3)',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <p style={{ color: '#a1a1a1', fontSize: '14px' }}>
                    Subtotal
                  </p>
                  <p style={{ color: '#ffffff', fontSize: '16px' }}>
                    Rp {Number(selectedOrder.subtotal || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(192, 38, 211, 0.2)'
                }}>
                  <p style={{ color: '#a1a1a1', fontSize: '14px' }}>
                    Biaya Pengiriman
                  </p>
                  <p style={{ color: '#ffffff', fontSize: '16px' }}>
                    Rp {Number(selectedOrder.shipping_cost || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
                    Total Pembayaran
                  </p>
                  <p style={{ color: '#c026d3', fontSize: '24px', fontWeight: '700' }}>
                    Rp {Number(selectedOrder.total || 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
