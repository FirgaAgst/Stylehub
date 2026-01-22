import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, XCircle, ArrowLeft, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService, getImageUrl } from '../services/Api';
import adminService from '../services/adminService';

const OrderDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '', productId: null, orderItemId: null });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrderDetail();
  }, [id, user]);

  const loadOrderDetail = async () => {
    try {
      const response = await orderService.getOrderWithReviews(id);
      setOrder(response.data);
      setNewStatus(response.data.status);
      setNewPaymentStatus(response.data.payment_status);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('❌ Gagal memuat detail pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!window.confirm('Yakin ingin mengubah status pesanan?')) return;
    
    try {
      await adminService.updateOrderStatus(id, { status: newStatus });
      alert('✅ Status pesanan berhasil diperbarui!');
      loadOrderDetail();
    } catch (error) {
      alert('❌ Gagal memperbarui status pesanan');
    }
  };

  const handleUpdatePaymentStatus = async () => {
    if (!window.confirm('Yakin ingin mengubah status pembayaran?')) return;
    
    try {
      await adminService.updatePaymentStatus(id, { payment_status: newPaymentStatus });
      alert('✅ Status pembayaran berhasil diperbarui!');
      loadOrderDetail();
    } catch (error) {
      alert('❌ Gagal memperbarui status pembayaran');
    }
  };

  const handleOpenReviewModal = (item) => {
    setReviewData({
      rating: 5,
      comment: '',
      productId: item.product_id,
      orderItemId: item.id,
      productName: item.product_name,
      productImage: item.image
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewData.comment.trim()) {
      alert('❌ Mohon isi komentar Anda');
      return;
    }

    setSubmittingReview(true);
    try {
      await orderService.createReview({
        orderId: id,
        orderItemId: reviewData.orderItemId,
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      
      alert('✅ Review berhasil dikirim!');
      setShowReviewModal(false);
      loadOrderDetail(); // Reload to update review status
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || '❌ Gagal mengirim review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Package size={48} color="#f59e0b" />,
      processing: <Package size={48} color="#3b82f6" />,
      shipped: <Truck size={48} color="#8b5cf6" />,
      delivered: <CheckCircle size={48} color="#10b981" />,
      cancelled: <XCircle size={48} color="#ef4444" />
    };
    return icons[status] || icons.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Menunggu Pembayaran',
      processing: 'Sedang Diproses',
      shipped: 'Dalam Pengiriman',
      delivered: 'Pesanan Selesai',
      cancelled: 'Dibatalkan'
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="spinner mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <h2>Pesanan tidak ditemukan</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/orders')}>
          Kembali ke Pesanan
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <button 
        onClick={() => navigate('/orders')} 
        style={{
          padding: '10px 20px',
          background: 'rgba(192, 38, 211, 0.1)',
          border: '1px solid #c026d3',
          borderRadius: '12px',
          color: '#c026d3',
          cursor: 'pointer',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '600'
        }}
      >
        <ArrowLeft size={18} />
        Kembali ke Pesanan
      </button>

      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '30px', 
        color: '#ffffff',
        fontWeight: '700'
      }}>
        Detail Pesanan
      </h1>
      
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid rgba(192, 38, 211, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '16px' }}>
          {getStatusIcon(order.status)}
        </div>
        <h2 style={{ 
          fontSize: '24px',
          marginBottom: '8px',
          color: '#ffffff',
          fontWeight: '700'
        }}>
          {getStatusText(order.status)}
        </h2>
        <div style={{ 
          color: '#a1a1a1',
          fontSize: '16px',
          marginBottom: '8px'
        }}>
          {order.order_number}
        </div>
        <div style={{ 
          color: '#a1a1a1',
          fontSize: '14px'
        }}>
          {new Date(order.created_at).toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Left Column */}
        <div>
          {/* Order Items */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(192, 38, 211, 0.2)'
          }}>
            <h3 style={{ 
              fontSize: '20px',
              marginBottom: '20px',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Item Pesanan
            </h3>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div 
                  key={item.id || index} 
                  style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    padding: '16px',
                    marginBottom: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(192, 38, 211, 0.1)',
                    alignItems: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', width: '100%', alignItems: 'center' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'rgba(192, 38, 211, 0.1)',
                      flexShrink: 0
                    }}>
                      {item.image ? (
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.product_name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 32px;">📦</div>';
                          }}
                        />
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          fontSize: '32px'
                        }}>📦</div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600',
                        marginBottom: '6px',
                        color: '#ffffff',
                        fontSize: '16px'
                      }}>
                        {item.product_name}
                      </div>
                      <div style={{ 
                        fontSize: '14px',
                        color: '#a1a1a1',
                        marginBottom: '4px'
                      }}>
                        {item.quantity} × Rp {parseInt(item.product_price).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div style={{ 
                      fontWeight: '700',
                      color: '#c026d3',
                      fontSize: '18px',
                      textAlign: 'right'
                    }}>
                      Rp {(parseInt(item.quantity) * parseInt(item.product_price)).toLocaleString('id-ID')}
                    </div>
                  </div>
                  
                  {/* Review Button - Only show for delivered orders and not yet reviewed */}
                  {order.status === 'delivered' && !item.is_reviewed && user?.role !== 'admin' && (
                    <button
                      onClick={() => handleOpenReviewModal(item)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      ⭐ Beri Rating & Komentar
                    </button>
                  )}
                  
                  {/* Already Reviewed Badge */}
                  {item.is_reviewed && (
                    <div style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '10px',
                      color: '#22c55e',
                      fontSize: '13px',
                      fontWeight: '600',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}>
                      ✅ Sudah Direview
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#a1a1a1' }}>
                Tidak ada item pesanan
              </div>
            )}
          </div>

          {/* Shipping Info */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(192, 38, 211, 0.2)'
          }}>
            <h3 style={{ 
              fontSize: '20px',
              marginBottom: '20px',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Informasi Pelanggan
            </h3>
            <div style={{ 
              fontSize: '15px',
              lineHeight: '2',
              color: '#e5e7eb'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#a1a1a1', display: 'inline-block', width: '100px' }}>Nama:</span>
                <strong style={{ color: '#ffffff' }}>{order.shipping_name}</strong>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#a1a1a1', display: 'inline-block', width: '100px' }}>Telepon:</span>
                <strong style={{ color: '#ffffff' }}>{order.shipping_phone}</strong>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#a1a1a1', display: 'inline-block', width: '100px' }}>Alamat:</span>
                <strong style={{ color: '#ffffff' }}>{order.shipping_address}</strong>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: '#a1a1a1', display: 'inline-block', width: '100px' }}>Kota:</span>
                <strong style={{ color: '#ffffff' }}>{order.shipping_city}</strong>
              </div>
              <div>
                <span style={{ color: '#a1a1a1', display: 'inline-block', width: '100px' }}>Kode Pos:</span>
                <strong style={{ color: '#ffffff' }}>{order.shipping_postal_code}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Order Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(192, 38, 211, 0.2)'
          }}>
            <h3 style={{ 
              fontSize: '20px',
              marginBottom: '20px',
              color: '#ffffff',
              fontWeight: '700'
            }}>
              Ringkasan Pesanan
            </h3>
            
            <div style={{ fontSize: '15px' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                color: '#e5e7eb'
              }}>
                <span>Subtotal</span>
                <span>Rp {parseInt(order.subtotal).toLocaleString('id-ID')}</span>
              </div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(192, 38, 211, 0.2)',
                color: '#e5e7eb'
              }}>
                <span>Ongkos Kirim</span>
                <span>Rp {parseInt(order.shipping_cost).toLocaleString('id-ID')}</span>
              </div>
              
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '20px'
              }}>
                <span style={{ color: '#ffffff' }}>Total</span>
                <span style={{
                  background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Rp {parseInt(order.total).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div style={{ 
              paddingTop: '20px',
              borderTop: '1px solid rgba(192, 38, 211, 0.2)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#a1a1a1', marginBottom: '8px' }}>
                Metode Pembayaran
              </div>
              <div style={{ 
                fontWeight: '600',
                textTransform: 'capitalize',
                color: '#ffffff',
                fontSize: '16px'
              }}>
                {order.payment_method === 'transfer' && '🏦 Transfer Bank'}
                {order.payment_method === 'cod' && '💵 Bayar di Tempat (COD)'}
                {order.payment_method === 'ewallet' && '📱 E-Wallet'}
                {!['transfer', 'cod', 'ewallet'].includes(order.payment_method) && order.payment_method}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '14px', color: '#a1a1a1', marginBottom: '8px' }}>
                Status Pembayaran
              </div>
              <span style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '700',
                backgroundColor: order.payment_status === 'paid' ? '#22c55e' : '#eab308',
                color: '#ffffff',
                textTransform: 'capitalize',
                display: 'inline-block'
              }}>
                {order.payment_status === 'paid' ? '✅ Sudah Dibayar' : '⏳ Belum Dibayar'}
              </span>
            </div>

            {/* Payment Button - Only show if unpaid and not COD */}
            {order.payment_status === 'unpaid' && order.payment_method !== 'cod' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                style={{
                  width: '100%',
                  padding: '16px',
                  marginTop: '20px',
                  background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(192, 38, 211, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 32px rgba(192, 38, 211, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 24px rgba(192, 38, 211, 0.4)';
                }}
              >
                💳 Bayar Sekarang
              </button>
            )}
          </div>

          {/* Update Status (Admin Only) */}
          {user?.role === 'admin' && (
            <div style={{
              background: 'linear-gradient(135deg, #2a1a2a 0%, #3a2a3a 100%)',
              borderRadius: '20px',
              padding: '24px',
              border: '2px solid rgba(192, 38, 211, 0.4)',
              boxShadow: '0 8px 32px rgba(192, 38, 211, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '18px',
                marginBottom: '20px',
                color: '#ffffff',
                fontWeight: '700',
                textAlign: 'center',
                borderBottom: '2px solid rgba(192, 38, 211, 0.3)',
                paddingBottom: '12px'
              }}>
                ⚙️ Update Status
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '10px',
                  color: '#c026d3',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  📦 Status Pesanan
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1a1a',
                    border: '2px solid rgba(192, 38, 211, 0.4)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    marginBottom: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pending" style={{ background: '#1a1a1a', padding: '10px' }}>⏳ Pending</option>
                  <option value="processing" style={{ background: '#1a1a1a', padding: '10px' }}>🔄 Processing</option>
                  <option value="shipped" style={{ background: '#1a1a1a', padding: '10px' }}>🚚 Shipped</option>
                  <option value="delivered" style={{ background: '#1a1a1a', padding: '10px' }}>✅ Delivered</option>
                  <option value="cancelled" style={{ background: '#1a1a1a', padding: '10px' }}>❌ Cancelled</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  disabled={newStatus === order.status}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: newStatus === order.status 
                      ? 'rgba(107, 114, 128, 0.3)' 
                      : 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                    border: newStatus === order.status ? '2px solid #4b5563' : 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: newStatus === order.status ? 'not-allowed' : 'pointer',
                    opacity: newStatus === order.status ? 0.5 : 1,
                    boxShadow: newStatus !== order.status ? '0 4px 20px rgba(192, 38, 211, 0.4)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {newStatus === order.status ? '✓ Status Sudah Sama' : '🔄 Update Status Pesanan'}
                </button>
              </div>

              <div style={{
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(192, 38, 211, 0.3), transparent)',
                marginBottom: '20px'
              }} />

              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '10px',
                  color: '#22c55e',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  💳 Status Pembayaran
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#1a1a1a',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    marginBottom: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <option value="unpaid" style={{ background: '#1a1a1a', padding: '10px' }}>⏳ Belum Bayar (Unpaid)</option>
                  <option value="paid" style={{ background: '#1a1a1a', padding: '10px' }}>✅ Sudah Bayar (Paid)</option>
                </select>
                <button
                  onClick={handleUpdatePaymentStatus}
                  disabled={newPaymentStatus === order.payment_status}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: newPaymentStatus === order.payment_status 
                      ? 'rgba(107, 114, 128, 0.3)' 
                      : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: newPaymentStatus === order.payment_status ? '2px solid #4b5563' : 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: newPaymentStatus === order.payment_status ? 'not-allowed' : 'pointer',
                    opacity: newPaymentStatus === order.payment_status ? 0.5 : 1,
                    boxShadow: newPaymentStatus !== order.payment_status ? '0 4px 20px rgba(34, 197, 94, 0.4)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {newPaymentStatus === order.payment_status ? '✓ Status Sudah Sama' : '💳 Update Status Pembayaran'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div 
          onClick={() => setShowPaymentModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '2px solid rgba(192, 38, 211, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(192, 38, 211, 0.3)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>

            {/* Transfer Bank Content */}
            {order.payment_method === 'transfer' && (
              <>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  💳 Transfer Bank
                </h2>

                <div style={{
                  background: 'rgba(192, 38, 211, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid rgba(192, 38, 211, 0.3)'
                }}>
                  <p style={{ 
                    color: '#a1a1a1', 
                    fontSize: '14px', 
                    marginBottom: '8px'
                  }}>
                    Total Pembayaran
                  </p>
                  <p style={{ 
                    color: '#c026d3', 
                    fontSize: '28px',
                    fontWeight: '700',
                    fontFamily: 'monospace'
                  }}>
                    Rp {parseInt(order.total).toLocaleString('id-ID')}
                  </p>
                </div>

                <p style={{ 
                  color: '#a1a1a1', 
                  fontSize: '14px', 
                  marginBottom: '16px'
                }}>
                  Silakan transfer ke salah satu rekening berikut:
                </p>

                <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                  {/* BCA */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(192, 38, 211, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.5)';
                    e.currentTarget.style.background = 'rgba(192, 38, 211, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: '#0066b2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        color: '#ffffff',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        BCA
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#a1a1a1', fontSize: '13px', marginBottom: '6px' }}>
                          Bank Central Asia
                        </div>
                        <div style={{ 
                          color: '#ffffff', 
                          fontSize: '20px',
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          letterSpacing: '2px',
                          marginBottom: '4px'
                        }}>
                          7890123456
                        </div>
                        <div style={{ color: '#c026d3', fontSize: '13px', fontWeight: '600' }}>
                          a.n. StyleHub Indonesia
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mandiri */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(192, 38, 211, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.5)';
                    e.currentTarget.style.background = 'rgba(192, 38, 211, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: '#003d79',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        color: '#ffffff',
                        fontSize: '12px',
                        flexShrink: 0
                      }}>
                        MANDIRI
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#a1a1a1', fontSize: '13px', marginBottom: '6px' }}>
                          Bank Mandiri
                        </div>
                        <div style={{ 
                          color: '#ffffff', 
                          fontSize: '20px',
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          letterSpacing: '2px',
                          marginBottom: '4px'
                        }}>
                          1380012345678
                        </div>
                        <div style={{ color: '#c026d3', fontSize: '13px', fontWeight: '600' }}>
                          a.n. StyleHub Indonesia
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BNI */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(192, 38, 211, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.5)';
                    e.currentTarget.style.background = 'rgba(192, 38, 211, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: '#f47920',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        color: '#ffffff',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        BNI
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#a1a1a1', fontSize: '13px', marginBottom: '6px' }}>
                          Bank Negara Indonesia
                        </div>
                        <div style={{ 
                          color: '#ffffff', 
                          fontSize: '20px',
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          letterSpacing: '2px',
                          marginBottom: '4px'
                        }}>
                          0234567890
                        </div>
                        <div style={{ color: '#c026d3', fontSize: '13px', fontWeight: '600' }}>
                          a.n. StyleHub Indonesia
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BRI */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(192, 38, 211, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.5)';
                    e.currentTarget.style.background = 'rgba(192, 38, 211, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(192, 38, 211, 0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: '#0052a5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        color: '#ffffff',
                        fontSize: '16px',
                        flexShrink: 0
                      }}>
                        BRI
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#a1a1a1', fontSize: '13px', marginBottom: '6px' }}>
                          Bank Rakyat Indonesia
                        </div>
                        <div style={{ 
                          color: '#ffffff', 
                          fontSize: '20px',
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          letterSpacing: '2px',
                          marginBottom: '4px'
                        }}>
                          456701234567890
                        </div>
                        <div style={{ color: '#c026d3', fontSize: '13px', fontWeight: '600' }}>
                          a.n. StyleHub Indonesia
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  background: 'rgba(234, 179, 8, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  fontSize: '13px',
                  color: '#fbbf24',
                  lineHeight: '1.6'
                }}>
                  <strong>⚠️ Penting:</strong> Setelah melakukan transfer, simpan bukti pembayaran. Pesanan akan diverifikasi dalam 1x24 jam.
                </div>
              </>
            )}

            {/* E-Wallet QRIS Content */}
            {order.payment_method === 'ewallet' && (
              <>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  📱 Pembayaran E-Wallet
                </h2>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <p style={{ 
                    color: '#a1a1a1', 
                    fontSize: '14px', 
                    marginBottom: '8px'
                  }}>
                    Total Pembayaran
                  </p>
                  <p style={{ 
                    color: '#10b981', 
                    fontSize: '28px',
                    fontWeight: '700',
                    fontFamily: 'monospace'
                  }}>
                    Rp {parseInt(order.total).toLocaleString('id-ID')}
                  </p>
                </div>

                <p style={{ 
                  color: '#a1a1a1', 
                  fontSize: '14px', 
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  Scan QR Code dengan aplikasi:
                </p>
                <div style={{ 
                  color: '#10b981', 
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  GoPay • OVO • Dana • ShopeePay • LinkAja
                </div>

                {/* QRIS Code Display */}
                <div style={{
                  background: '#ffffff',
                  padding: '32px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  marginBottom: '24px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    width: '260px',
                    height: '260px',
                    margin: '0 auto',
                    background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px',
                    border: '4px solid #10b981',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '80px',
                    position: 'relative'
                  }}>

                  </div>
                  <div style={{ 
                    marginTop: '20px',
                    fontSize: '15px',
                    color: '#666',
                    fontWeight: '600'
                  }}>
                    Scan untuk Bayar
                  </div>
                  <div style={{ 
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#999',
                    fontFamily: 'monospace'
                  }}>
                    Order ID: {order.order_number}
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px'
                }}>

                </div>

                <div style={{
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '13px',
                  color: '#10b981',
                  lineHeight: '1.6',
                  textAlign: 'center'
                }}>
                  ℹ️ Pembayaran akan otomatis terverifikasi setelah berhasil
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div 
          onClick={() => setShowReviewModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '2px solid rgba(192, 38, 211, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowReviewModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                fontSize: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(192, 38, 211, 0.3)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              ✕
            </button>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              ⭐ Beri Rating & Komentar
            </h2>

            {/* Product Info */}
            <div style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              background: 'rgba(192, 38, 211, 0.1)',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid rgba(192, 38, 211, 0.2)',
              alignItems: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'rgba(192, 38, 211, 0.2)',
                flexShrink: 0
              }}>
                {reviewData.productImage ? (
                  <img 
                    src={getImageUrl(reviewData.productImage)} 
                    alt={reviewData.productName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '24px'
                  }}>📦</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600',
                  color: '#ffffff',
                  fontSize: '16px',
                  marginBottom: '4px'
                }}>
                  {reviewData.productName}
                </div>
                <div style={{ 
                  fontSize: '13px',
                  color: '#a1a1a1'
                }}>
                  Bagikan pengalaman Anda
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Rating Produk
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(192, 38, 211, 0.2)'
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <Star
                      size={36}
                      fill={star <= reviewData.rating ? '#fbbf24' : 'none'}
                      stroke={star <= reviewData.rating ? '#fbbf24' : '#6b7280'}
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>
              <div style={{
                textAlign: 'center',
                marginTop: '12px',
                color: '#fbbf24',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {reviewData.rating === 1 && 'Sangat Buruk'}
                {reviewData.rating === 2 && 'Buruk'}
                {reviewData.rating === 3 && 'Cukup'}
                {reviewData.rating === 4 && 'Bagus'}
                {reviewData.rating === 5 && 'Sangat Bagus'}
              </div>
            </div>

            {/* Comment Section */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                marginBottom: '12px'
              }}>
                Komentar
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                rows={6}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#1a1a1a',
                  border: '2px solid rgba(192, 38, 211, 0.3)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#c026d3';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(192, 38, 211, 0.3)';
                }}
              />
              <div style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#a1a1a1',
                textAlign: 'right'
              }}>
                {reviewData.comment.length} / 500 karakter
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowReviewModal(false)}
                disabled={submittingReview}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: submittingReview ? 'not-allowed' : 'pointer',
                  opacity: submittingReview ? 0.5 : 1,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!submittingReview) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview || !reviewData.comment.trim()}
                style={{
                  flex: 2,
                  padding: '16px',
                  background: submittingReview || !reviewData.comment.trim()
                    ? 'rgba(192, 38, 211, 0.3)'
                    : 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: submittingReview || !reviewData.comment.trim() ? 'not-allowed' : 'pointer',
                  opacity: submittingReview || !reviewData.comment.trim() ? 0.5 : 1,
                  boxShadow: submittingReview || !reviewData.comment.trim() 
                    ? 'none' 
                    : '0 4px 20px rgba(192, 38, 211, 0.4)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!submittingReview && reviewData.comment.trim()) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 24px rgba(192, 38, 211, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = submittingReview || !reviewData.comment.trim() 
                    ? 'none' 
                    : '0 4px 20px rgba(192, 38, 211, 0.4)';
                }}
              >
                {submittingReview ? (
                  <>
                    <div className="spinner" style={{ 
                      width: '16px', 
                      height: '16px',
                      borderWidth: '2px' 
                    }}></div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    ✨ Kirim Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;