import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Package, Eye, Edit2, Lock } from 'lucide-react';
import { authService, orderService } from '../services/Api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Load profile first
      const profileResponse = await authService.getProfile();
      setProfile(profileResponse.data);
      setFormData({
        name: profileResponse.data.name || '',
        email: profileResponse.data.email || '',
        phone: profileResponse.data.phone || '',
        address: profileResponse.data.address || ''
      });

      // Load orders separately to avoid blocking profile data
      try {
        const ordersResponse = await orderService.getUserOrders();
        setOrders(ordersResponse.data || []);
      } catch (orderError) {
        console.log('No orders found or error loading orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('❌ Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(formData);
      alert('✅ Profil berhasil diperbarui!');
      setEditing(false);
      loadProfileData();
    } catch (error) {
      alert('❌ Gagal memperbarui profil');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#eab308',
      processing: '#3b82f6',
      shipped: '#9333ea',
      delivered: '#22c55e',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Menunggu',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '30px',
        border: '1px solid rgba(192, 38, 211, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(192, 38, 211, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ffffff',
            boxShadow: '0 10px 30px rgba(192, 38, 211, 0.3)'
          }}>
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#ffffff' }}>
              {profile?.name}
            </h1>
            <p style={{ color: '#a1a1a1', fontSize: '16px', marginBottom: '12px' }}>
              <Mail size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              {profile?.email}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{
                padding: '6px 16px',
                background: 'rgba(192, 38, 211, 0.2)',
                borderRadius: '20px',
                fontSize: '14px',
                color: '#c026d3',
                border: '1px solid rgba(192, 38, 211, 0.3)'
              }}>
                {profile?.role === 'admin' ? 'Admin' : 'Customer'}
              </span>
              <span style={{
                padding: '6px 16px',
                background: 'rgba(34, 197, 94, 0.2)',
                borderRadius: '20px',
                fontSize: '14px',
                color: '#22c55e',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Bergabung {formatDate(profile?.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '30px',
        borderBottom: '1px solid rgba(192, 38, 211, 0.2)',
        paddingBottom: '0'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '16px 32px',
            background: activeTab === 'profile' ? 'rgba(192, 38, 211, 0.1)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid #c026d3' : '3px solid transparent',
            color: activeTab === 'profile' ? '#c026d3' : '#a1a1a1',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <User size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          Data Diri
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '16px 32px',
            background: activeTab === 'orders' ? 'rgba(192, 38, 211, 0.1)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid #c026d3' : '3px solid transparent',
            color: activeTab === 'orders' ? '#c026d3' : '#a1a1a1',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <Package size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
          Pesanan Saya ({orders.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(192, 38, 211, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#ffffff' }}>Informasi Profil</h2>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                padding: '10px 20px',
                background: editing ? 'rgba(107, 114, 128, 0.2)' : 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                border: editing ? '1px solid #6b7280' : 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {editing ? (
                <>Batal</>
              ) : (
                <>
                  <Edit2 size={16} />
                  Edit Profil
                </>
              )}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1', fontSize: '14px' }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(192, 38, 211, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1', fontSize: '14px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(192, 38, 211, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1', fontSize: '14px' }}>
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(192, 38, 211, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1', fontSize: '14px' }}>
                    Alamat
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(192, 38, 211, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '14px',
                    background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(192, 38, 211, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <User size={20} color="#c026d3" />
                  <span style={{ color: '#a1a1a1', fontSize: '14px' }}>Nama Lengkap</span>
                </div>
                <p style={{ color: '#ffffff', fontSize: '18px', marginLeft: '32px' }}>
                  {profile?.name || '-'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(192, 38, 211, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Mail size={20} color="#c026d3" />
                  <span style={{ color: '#a1a1a1', fontSize: '14px' }}>Email</span>
                </div>
                <p style={{ color: '#ffffff', fontSize: '18px', marginLeft: '32px' }}>
                  {profile?.email || '-'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(192, 38, 211, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Phone size={20} color="#c026d3" />
                  <span style={{ color: '#a1a1a1', fontSize: '14px' }}>Nomor Telepon</span>
                </div>
                <p style={{ color: '#ffffff', fontSize: '18px', marginLeft: '32px' }}>
                  {profile?.phone || '-'}
                </p>
              </div>

              <div style={{
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(192, 38, 211, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <MapPin size={20} color="#c026d3" />
                  <span style={{ color: '#a1a1a1', fontSize: '14px' }}>Alamat</span>
                </div>
                <p style={{ color: '#ffffff', fontSize: '18px', marginLeft: '32px' }}>
                  {profile?.address || '-'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              borderRadius: '24px',
              padding: '60px',
              textAlign: 'center',
              border: '1px solid rgba(192, 38, 211, 0.2)'
            }}>
              <Package size={64} color="#6b7280" style={{ marginBottom: '20px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#ffffff' }}>
                Belum Ada Pesanan
              </h3>
              <p style={{ color: '#a1a1a1', marginBottom: '24px' }}>
                Anda belum memiliki riwayat pesanan
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
                  cursor: 'pointer'
                }}
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {orders.map(order => (
                <div
                  key={order.id}
                  style={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(192, 38, 211, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(192, 38, 211, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <p style={{ color: '#a1a1a1', fontSize: '14px', marginBottom: '4px' }}>
                        Order #{order.id}
                      </p>
                      <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                    <span style={{
                      padding: '6px 16px',
                      background: `${getStatusColor(order.status)}20`,
                      borderRadius: '20px',
                      fontSize: '14px',
                      color: getStatusColor(order.status),
                      border: `1px solid ${getStatusColor(order.status)}50`,
                      fontWeight: '600'
                    }}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(192, 38, 211, 0.1)'
                  }}>
                    <span style={{ color: '#a1a1a1', fontSize: '14px' }}>
                      {formatDate(order.created_at)}
                    </span>
                    <span style={{ color: '#c026d3', fontSize: '14px', fontWeight: '600' }}>
                      <Eye size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      Lihat Detail
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
