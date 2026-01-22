import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Trash2, Edit, Star, StarOff } from 'lucide-react';
import { adminService, getImageUrl } from '../services/Api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    old_price: '',
    category_id: '',
    stock: '',
    image: null
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await adminService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await adminService.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      await adminService.toggleFeaturedProduct(productId);
      alert(`✅ Produk ${currentStatus ? 'dihapus dari' : 'ditambahkan ke'} unggulan!`);
      loadProducts();
    } catch (error) {
      alert('❌ Gagal mengubah status unggulan');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    
    try {
      await adminService.deleteProduct(productId);
      alert('✅ Produk berhasil dihapus!');
      loadProducts();
    } catch (error) {
      alert('❌ Gagal menghapus produk');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, submitData);
        alert('✅ Produk berhasil diupdate!');
      } else {
        await adminService.createProduct(submitData);
        alert('✅ Produk berhasil ditambahkan!');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        old_price: '',
        category_id: '',
        stock: '',
        image: null
      });
      loadProducts();
    } catch (error) {
      alert('❌ Gagal menyimpan produk');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      old_price: product.old_price || '',
      category_id: product.category_id,
      stock: product.stock,
      image: null
    });
    setShowModal(true);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(search.toLowerCase())
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
            Kelola Produk
          </h1>
          <p style={{ color: '#a1a1a1' }}>Total: {products.length} produk</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              old_price: '',
              category_id: '',
              stock: '',
              image: null
            });
            setShowModal(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <Plus size={20} />
          Tambah Produk
        </button>
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
          placeholder="Cari produk..."
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

      {/* Products Table */}
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
                  Gambar
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Nama Produk
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Harga
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Stok
                </th>
                <th style={{ padding: '16px', textAlign: 'left', color: '#a1a1a1', fontWeight: '600' }}>
                  Status
                </th>
                <th style={{ padding: '16px', textAlign: 'center', color: '#a1a1a1', fontWeight: '600' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr 
                    key={product.id}
                    style={{
                      borderBottom: '1px solid rgba(192, 38, 211, 0.1)',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 38, 211, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px' }}>
                      <img 
                        src={getImageUrl(product.image)} 
                        alt={product.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '2px solid rgba(192, 38, 211, 0.2)'
                        }}
                      />
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ color: '#ffffff', fontWeight: '600', marginBottom: '4px' }}>
                          {product.name}
                        </p>
                        <p style={{ color: '#a1a1a1', fontSize: '14px' }}>
                          {product.category_name}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div>
                        <p style={{ color: '#c026d3', fontWeight: '700', fontSize: '16px' }}>
                          Rp {Number(product.price || 0).toLocaleString('id-ID')}
                        </p>
                        {product.old_price && (
                          <p style={{ 
                            color: '#6b7280', 
                            fontSize: '13px',
                            textDecoration: 'line-through'
                          }}>
                            Rp {Number(product.old_price).toLocaleString('id-ID')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: product.stock > 10 
                          ? 'rgba(34, 197, 94, 0.2)' 
                          : product.stock > 0 
                            ? 'rgba(234, 179, 8, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                        color: product.stock > 10 
                          ? '#22c55e' 
                          : product.stock > 0 
                            ? '#eab308'
                            : '#ef4444',
                        border: `1px solid ${
                          product.stock > 10 
                            ? '#22c55e' 
                            : product.stock > 0 
                              ? '#eab308'
                              : '#ef4444'
                        }`
                      }}>
                        {product.stock} unit
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {product.is_featured ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: '600',
                          background: 'rgba(234, 179, 8, 0.2)',
                          color: '#eab308',
                          border: '1px solid #eab308'
                        }}>
                          <Star size={14} fill="#eab308" />
                          Unggulan
                        </span>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '14px' }}>
                          -
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                          style={{
                            padding: '8px',
                            background: 'rgba(234, 179, 8, 0.2)',
                            border: '1px solid #eab308',
                            borderRadius: '8px',
                            color: '#eab308',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          title={product.is_featured ? 'Hapus dari unggulan' : 'Tandai unggulan'}
                        >
                          {product.is_featured ? <StarOff size={16} /> : <Star size={16} />}
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          style={{
                            padding: '8px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
                  <td colSpan="6" style={{ 
                    padding: '60px 20px', 
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <Package size={48} color="#4a4a4a" style={{ marginBottom: '16px' }} />
                    <p>Tidak ada produk ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
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
            maxWidth: '600px',
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
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
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
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                    Harga
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                    Harga Lama (Opsional)
                  </label>
                  <input
                    type="number"
                    value={formData.old_price}
                    onChange={(e) => setFormData({...formData, old_price: e.target.value})}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                    Kategori
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(192, 38, 211, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" style={{ background: '#1a1a1a', color: '#a1a1a1' }}>
                      Pilih Kategori
                    </option>
                    {categories.map(category => (
                      <option 
                        key={category.id} 
                        value={category.id}
                        style={{ background: '#1a1a1a', color: '#ffffff' }}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                    Stok
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#a1a1a1' }}>
                  Gambar Produk
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(107, 114, 128, 0.2)',
                    border: '1px solid #6b7280',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
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
                  {editingProduct ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
