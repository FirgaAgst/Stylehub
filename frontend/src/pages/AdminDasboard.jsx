import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp, Users, Clock, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/Api';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isMainDashboard = location.pathname === '/admin' || location.pathname === '/admin/';

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    if (isMainDashboard) {
      loadDashboardStats();
    }
  }, [user, navigate, isMainDashboard]);

  const loadDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isMainDashboard) {
    return (
      <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="loading-spinner">
          <div className="spinner-border" style={{ 
            width: '3rem', 
            height: '3rem',
            borderWidth: '4px',
            borderColor: '#c026d3',
            borderRightColor: 'transparent'
          }}></div>
          <p style={{ marginTop: '16px', color: '#a1a1a1' }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <Routes>
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/" element={
            <>
              {/* Dashboard Content */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#a1a1a1', fontSize: '1.1rem' }}>
            Selamat datang kembali, {user?.name}! 👋
          </p>
        </div>

        {/* Overview Stats with Enhanced Design */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Products Card */}
          <div className="stat-card-enhanced" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }} onClick={() => navigate('/admin/products')}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Package size={32} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                {stats?.overview?.total_products || 0}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
                Total Produk
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <ArrowUpRight size={16} />
                <span>Lihat Detail</span>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="stat-card-enhanced" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }} onClick={() => navigate('/admin/orders')}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ShoppingCart size={32} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                {stats?.overview?.total_orders || 0}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
                Total Pesanan
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <ArrowUpRight size={16} />
                <span>Lihat Detail</span>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="stat-card-enhanced" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <TrendingUp size={32} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Rp {((stats?.overview?.total_revenue || 0) / 1000000).toFixed(1)}M
              </div>
              <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
                Total Revenue
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <TrendingUp size={16} />
                <span>+12% dari bulan lalu</span>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="stat-card-enhanced" style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            padding: '28px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }} onClick={() => navigate('/admin/users')}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255,255,255,0.2)', 
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Users size={32} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                {stats?.overview?.total_users || 0}
              </div>
              <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
                Total Pengguna
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                <ArrowUpRight size={16} />
                <span>Lihat Detail</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders by Status */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          padding: '32px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(192, 38, 211, 0.1)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Clock size={24} color="#c026d3" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
              Status Pesanan
            </h3>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '16px' 
          }}>
            {stats?.orders_by_status?.map((status, index) => {
              const colors = [
                { bg: 'rgba(99, 102, 241, 0.1)', border: '#6366f1', text: '#818cf8' },
                { bg: 'rgba(236, 72, 153, 0.1)', border: '#ec4899', text: '#f472b6' },
                { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', text: '#4ade80' },
                { bg: 'rgba(251, 146, 60, 0.1)', border: '#fb923c', text: '#fdba74' },
              ];
              const color = colors[index % colors.length];
              
              return (
                <div 
                  key={status.status} 
                  style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    background: color.bg,
                    border: `2px solid ${color.border}`,
                    borderRadius: '16px',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    color: color.text,
                    marginBottom: '8px'
                  }}>
                    {status.count}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#a1a1a1', 
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {status.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          padding: '32px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(192, 38, 211, 0.1)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <ShoppingCart size={24} color="#c026d3" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
              Pesanan Terbaru
            </h3>
          </div>
          
          {stats?.recent_orders?.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr style={{ color: '#a1a1a1', fontSize: '0.875rem', textAlign: 'left' }}>
                    <th style={{ padding: '12px', fontWeight: '500' }}>Order Number</th>
                    <th style={{ padding: '12px', fontWeight: '500' }}>Customer</th>
                    <th style={{ padding: '12px', fontWeight: '500' }}>Total</th>
                    <th style={{ padding: '12px', fontWeight: '500' }}>Status</th>
                    <th style={{ padding: '12px', fontWeight: '500' }}>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_orders.map(order => (
                    <tr key={order.id} style={{ 
                      background: 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 38, 211, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      <td style={{ padding: '16px', borderRadius: '12px 0 0 12px', color: '#ffffff', fontWeight: '500' }}>
                        #{order.order_number}
                      </td>
                      <td style={{ padding: '16px', color: '#ffffff' }}>
                        {order.user_name}
                      </td>
                      <td style={{ padding: '16px', color: '#4ade80', fontWeight: '600' }}>
                        Rp {order.total.toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: order.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                          color: order.status === 'delivered' ? '#4ade80' : '#60a5fa',
                          border: `1px solid ${order.status === 'delivered' ? '#22c55e' : '#3b82f6'}`
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', borderRadius: '0 12px 12px 0', color: '#a1a1a1' }}>
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#a1a1a1',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px'
            }}>
              <ShoppingCart size={48} color="#4a4a4a" style={{ marginBottom: '16px' }} />
              <p>Belum ada pesanan</p>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          padding: '32px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(192, 38, 211, 0.1)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <TrendingUp size={24} color="#c026d3" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>
              Produk Terlaris
            </h3>
          </div>
          
          {stats?.top_products?.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {stats.top_products.map((product, index) => (
                <div key={product.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(192, 38, 211, 0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(192, 38, 211, 0.1)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  {/* Rank Badge */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: index === 0 ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' :
                                index === 1 ? 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)' :
                                index === 2 ? 'linear-gradient(135deg, #cd7f32 0%, #e5a872 100%)' :
                                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: index < 3 ? '#000' : '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    #{index + 1}
                  </div>
                  
                  {/* Product Image */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    background: 'rgba(192, 38, 211, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}>
                    <Package size={32} color="#c026d3" />
                  </div>
                  
                  {/* Product Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: '#4ade80',
                        background: 'rgba(74, 222, 128, 0.1)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}>
                        🔥 {product.total_sold} Terjual
                      </span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div style={{ 
                    textAlign: 'right',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
                    borderRadius: '12px'
                  }}>
                    <div style={{ 
                      fontWeight: '700', 
                      fontSize: '1.3rem',
                      color: '#ffffff'
                    }}>
                      Rp {(product.price / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#a1a1a1',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px'
            }}>
              <Package size={48} color="#4a4a4a" style={{ marginBottom: '16px' }} />
              <p>Belum ada data produk terlaris</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px',
          marginTop: '40px'
        }}>
          <button 
            style={{
              padding: '20px 28px',
              fontSize: '1.05rem',
              fontWeight: '600',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onClick={() => navigate('/admin/products')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
          >
            <Package size={20} />
            Kelola Produk
          </button>
          
          <button 
            style={{
              padding: '20px 28px',
              fontSize: '1.05rem',
              fontWeight: '600',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(240, 147, 251, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onClick={() => navigate('/admin/orders')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(240, 147, 251, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(240, 147, 251, 0.3)';
            }}
          >
            <ShoppingCart size={20} />
            Kelola Pesanan
          </button>
          
          <button 
            style={{
              padding: '20px 28px',
              fontSize: '1.05rem',
              fontWeight: '600',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(79, 172, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onClick={() => navigate('/admin/users')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(79, 172, 254, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 172, 254, 0.3)';
            }}
          >
            <Users size={20} />
            Kelola Pengguna
          </button>
        </div>
            </>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
