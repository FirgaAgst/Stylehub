import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { Package, MapPin, Phone, CreditCard, Truck } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    shipping_name: user?.name || '',
    shipping_phone: user?.phone || '',
    shipping_address: user?.address || '',
    shipping_city: user?.city || '',
    shipping_postal_code: user?.postal_code || '',
    payment_method: 'transfer'
  });

  const [loading, setLoading] = useState(false);

  // Calculate totals with safety checks
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + (price * quantity);
  }, 0);
  
  const shippingCost = 15000;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!cart || cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        payment_method: formData.payment_method,
        shipping_name: formData.shipping_name,
        shipping_phone: formData.shipping_phone,
        shipping_address: formData.shipping_address,
        shipping_city: formData.shipping_city,
        shipping_postal_code: formData.shipping_postal_code
      };

      const response = await orderService.createOrder(orderData);
      
      clearCart();
      alert('✅ Pesanan berhasil dibuat!\nNomor pesanan: ' + orderData.order_number);
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('❌ ' + (error.response?.data?.message || 'Gagal membuat pesanan'));
    } finally {
      setLoading(false);
    }
  };

  if (!user || !cart || cart.length === 0) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Checkout
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '32px'
      }}>
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid rgba(192, 38, 211, 0.2)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <MapPin size={24} color="#c026d3" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
              Informasi Pengiriman
            </h3>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '8px',
              color: '#a1a1a1',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Nama Lengkap *
            </label>
            <input
              type="text"
              name="shipping_name"
              value={formData.shipping_name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(192, 38, 211, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '8px',
              color: '#a1a1a1',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <Phone size={16} style={{ display: 'inline', marginRight: '6px' }} />
              No. Telepon *
            </label>
            <input
              type="tel"
              name="shipping_phone"
              value={formData.shipping_phone}
              onChange={handleChange}
              placeholder="08123456789"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(192, 38, 211, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block',
              marginBottom: '8px',
              color: '#a1a1a1',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Alamat Lengkap *
            </label>
            <textarea
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              rows="3"
              placeholder="Jl. Contoh No. 123, RT 01/RW 02"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(192, 38, 211, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                color: '#a1a1a1',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Kota *
              </label>
              <input
                type="text"
                name="shipping_city"
                value={formData.shipping_city}
                onChange={handleChange}
                placeholder="Jakarta"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(192, 38, 211, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                color: '#a1a1a1',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Kode Pos *
              </label>
              <input
                type="text"
                name="shipping_postal_code"
                value={formData.shipping_postal_code}
                onChange={handleChange}
                placeholder="12345"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(192, 38, 211, 0.2)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid rgba(192, 38, 211, 0.2)',
            paddingTop: '24px',
            marginTop: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <CreditCard size={24} color="#c026d3" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                Metode Pembayaran
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {/* Transfer Bank */}
              <label 
                style={{
                  position: 'relative',
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (formData.payment_method !== 'transfer') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="transfer"
                  checked={formData.payment_method === 'transfer'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 20px',
                  background: formData.payment_method === 'transfer' 
                    ? 'linear-gradient(135deg, rgba(192, 38, 211, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%)' 
                    : 'rgba(255,255,255,0.04)',
                  border: formData.payment_method === 'transfer'
                    ? '2px solid #c026d3'
                    : '2px solid rgba(192, 38, 211, 0.2)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: formData.payment_method === 'transfer'
                    ? '0 8px 24px rgba(192, 38, 211, 0.3)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: formData.payment_method === 'transfer'
                      ? 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)'
                      : 'rgba(192, 38, 211, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    transition: 'all 0.3s ease'
                  }}>
                    <CreditCard size={24} color={formData.payment_method === 'transfer' ? '#ffffff' : '#c026d3'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: '#ffffff', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      Transfer Bank
                    </div>
                    <div style={{ 
                      color: formData.payment_method === 'transfer' ? '#e9d5ff' : '#a1a1a1', 
                      fontSize: '13px' 
                    }}>
                      BCA, Mandiri, BNI
                    </div>
                  </div>
                  {formData.payment_method === 'transfer' && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '12px'
                    }}>
                      <span style={{ color: '#ffffff', fontSize: '14px' }}>✓</span>
                    </div>
                  )}
                </div>
              </label>

              {/* COD */}
              <label 
                style={{
                  position: 'relative',
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (formData.payment_method !== 'cod') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={formData.payment_method === 'cod'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 20px',
                  background: formData.payment_method === 'cod' 
                    ? 'linear-gradient(135deg, rgba(192, 38, 211, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%)' 
                    : 'rgba(255,255,255,0.04)',
                  border: formData.payment_method === 'cod'
                    ? '2px solid #c026d3'
                    : '2px solid rgba(192, 38, 211, 0.2)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: formData.payment_method === 'cod'
                    ? '0 8px 24px rgba(192, 38, 211, 0.3)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: formData.payment_method === 'cod'
                      ? 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)'
                      : 'rgba(192, 38, 211, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    fontSize: '24px',
                    transition: 'all 0.3s ease'
                  }}>
                    💵
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: '#ffffff', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      Cash on Delivery (COD)
                    </div>
                    <div style={{ 
                      color: formData.payment_method === 'cod' ? '#e9d5ff' : '#a1a1a1', 
                      fontSize: '13px' 
                    }}>
                      Bayar saat barang tiba
                    </div>
                  </div>
                  {formData.payment_method === 'cod' && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '12px'
                    }}>
                      <span style={{ color: '#ffffff', fontSize: '14px' }}>✓</span>
                    </div>
                  )}
                </div>
              </label>

              {/* E-Wallet */}
              <label 
                style={{
                  position: 'relative',
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (formData.payment_method !== 'ewallet') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="ewallet"
                  checked={formData.payment_method === 'ewallet'}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '18px 20px',
                  background: formData.payment_method === 'ewallet' 
                    ? 'linear-gradient(135deg, rgba(192, 38, 211, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%)' 
                    : 'rgba(255,255,255,0.04)',
                  border: formData.payment_method === 'ewallet'
                    ? '2px solid #c026d3'
                    : '2px solid rgba(192, 38, 211, 0.2)',
                  borderRadius: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: formData.payment_method === 'ewallet'
                    ? '0 8px 24px rgba(192, 38, 211, 0.3)'
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: formData.payment_method === 'ewallet'
                      ? 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)'
                      : 'rgba(192, 38, 211, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    fontSize: '24px',
                    transition: 'all 0.3s ease'
                  }}>
                    📱
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      color: '#ffffff', 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '4px'
                    }}>
                      E-Wallet
                    </div>
                    <div style={{ 
                      color: formData.payment_method === 'ewallet' ? '#e9d5ff' : '#a1a1a1', 
                      fontSize: '13px' 
                    }}>
                      GoPay, OVO, Dana, ShopeePay
                    </div>
                  </div>
                  {formData.payment_method === 'ewallet' && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '12px'
                    }}>
                      <span style={{ color: '#ffffff', fontSize: '14px' }}>✓</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: '32px',
              background: loading 
                ? 'rgba(100,100,100,0.3)'
                : 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading 
                ? 'none'
                : '0 8px 20px rgba(192, 38, 211, 0.3)'
            }}
          >
            {loading ? '⏳ Memproses...' : '✅ Buat Pesanan'}
          </button>
        </form>

        {/* Order Summary */}
        <div style={{
          position: 'sticky',
          top: '100px',
          height: 'fit-content'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid rgba(192, 38, 211, 0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Package size={24} color="#c026d3" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                Ringkasan Pesanan
              </h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {cart.map((item, index) => {
                const itemPrice = Number(item.price) || 0;
                const itemQuantity = Number(item.quantity) || 0;
                const itemTotal = itemPrice * itemQuantity;
                
                return (
                  <div 
                    key={`${item.id || index}-${item.size || ''}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(192, 38, 211, 0.1)'
                    }}
                  >
                    <span style={{ color: '#a1a1a1', fontSize: '14px' }}>
                      {item.name || 'Product'} × {itemQuantity}
                    </span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      Rp {itemTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ 
              borderTop: '2px solid rgba(192, 38, 211, 0.2)',
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <span style={{ color: '#a1a1a1' }}>Subtotal</span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <span style={{ color: '#a1a1a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={16} />
                  Ongkos Kirim
                </span>
                <span style={{ color: '#ffffff', fontWeight: '600' }}>
                  Rp {shippingCost.toLocaleString('id-ID')}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                background: 'rgba(192, 38, 211, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(192, 38, 211, 0.3)'
              }}>
                <span style={{ 
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#ffffff'
                }}>
                  Total
                </span>
                <span style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#c026d3'
                }}>
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;