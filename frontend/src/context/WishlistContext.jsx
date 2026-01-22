import React, { createContext, useState, useContext, useEffect } from 'react';
import { productService } from '../services/Api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load wishlist when user logs in
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlist([]);
      setWishlistIds(new Set());
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await productService.getWishlist();
      const items = response.data || [];
      setWishlist(items);
      setWishlistIds(new Set(items.map(item => item.id)));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      await productService.addToWishlist(product.id);
      setWishlist(prev => [...prev, product]);
      setWishlistIds(prev => new Set([...prev, product.id]));
      return { success: true, message: 'Produk ditambahkan ke wishlist' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) {
      throw new Error('Please login to remove items from wishlist');
    }

    try {
      await productService.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId));
      setWishlistIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      return { success: true, message: 'Produk dihapus dari wishlist' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      throw new Error('Please login to use wishlist');
    }

    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    setWishlistIds(new Set());
  };

  const value = {
    wishlist,
    wishlistIds,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    loadWishlist,
    wishlistCount: wishlist.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
