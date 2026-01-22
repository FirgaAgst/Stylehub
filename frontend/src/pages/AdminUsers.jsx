import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, UserCheck, UserX, Trash2, Edit } from 'lucide-react';
import { adminService } from '../services/Api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    if (!window.confirm('Yakin ingin mengubah status user ini?')) return;
    
    try {
      await adminService.updateUserStatus(userId, !currentStatus);
      alert('✅ Status user berhasil diubah!');
      loadUsers();
    } catch (error) {
      alert('❌ Gagal mengubah status user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Yakin ingin menghapus user ini? Aksi ini tidak dapat dibatalkan!')) return;
    
    try {
      await adminService.deleteUser(userId);
      alert('✅ User berhasil dihapus!');
      loadUsers();
    } catch (error) {
      alert('❌ Gagal menghapus user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
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
            Kelola Pengguna
          </h1>
          <p style={{ color: '#a1a1a1' }}>Total: {users.length} pengguna</p>
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
          placeholder="Cari pengguna..."
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

      {/* Users Table */}
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
                  ID
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Nama
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Email
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Role
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Status
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Terdaftar
                </th>
                <th style={{ padding: '16px', textAlign: 'center', color: '#a1a1a1', fontWeight: '600' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    style={{
                      borderBottom: '1px solid rgba(192, 38, 211, 0.1)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 38, 211, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px', color: '#ffffff' }}>
                      #{user.id}
                    </td>
                    <td style={{ padding: '16px', color: '#ffffff', fontWeight: '500' }}>
                      {user.name}
                    </td>
                    <td style={{ padding: '16px', color: '#a1a1a1' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: user.role === 'admin' 
                          ? 'rgba(239, 68, 68, 0.2)' 
                          : 'rgba(59, 130, 246, 0.2)',
                        color: user.role === 'admin' ? '#ef4444' : '#3b82f6',
                        border: `1px solid ${user.role === 'admin' ? '#ef4444' : '#3b82f6'}`
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600',
                        background: user.is_active 
                          ? 'rgba(34, 197, 94, 0.2)' 
                          : 'rgba(107, 114, 128, 0.2)',
                        color: user.is_active ? '#22c55e' : '#6b7280',
                        border: `1px solid ${user.is_active ? '#22c55e' : '#6b7280'}`
                      }}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#a1a1a1' }}>
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.is_active)}
                          style={{
                            padding: '8px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ 
                    padding: '60px 20px', 
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <Users size={48} color="#4a4a4a" style={{ marginBottom: '16px' }} />
                    <p>Tidak ada pengguna ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
