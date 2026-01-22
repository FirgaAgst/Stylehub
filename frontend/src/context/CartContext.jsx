import React, { createContext, useState, useContext, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Load cart from server or localStorage
    useEffect(() => {
        loadCart();
    }, [isAuthenticated]);

    const loadCart = async () => {
        if (isAuthenticated()) {
            try {
                const response = await orderService.getCart();
                setCart(response.data || []);
            } catch (error) {
                console.error('Error loading cart:', error);
                // Load from localStorage as fallback
                const localCart = localStorage.getItem('cart');
                if (localCart) {
                    setCart(JSON.parse(localCart));
                }
            }
        } else {
            // Load from localStorage for guest users
            const localCart = localStorage.getItem('cart');
            if (localCart) {
                setCart(JSON.parse(localCart));
            }
        }
    };

    const addToCart = async (product, quantity = 1) => {
        setLoading(true);
        try {
            if (isAuthenticated()) {
                await orderService.addToCart(product.id, quantity);
                await loadCart();
            } else {
                // Add to localStorage
                const existingItem = cart.find(item => item.product_id === product.id);
                let newCart;
                
                if (existingItem) {
                    newCart = cart.map(item =>
                        item.product_id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    newCart = [...cart, {
                        id: Date.now(),
                        product_id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        slug: product.slug,
                        quantity
                    }];
                }
                
                setCart(newCart);
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
            return { success: true, message: 'Product added to cart' };
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (itemId, quantity) => {
        setLoading(true);
        try {
            if (isAuthenticated()) {
                await orderService.updateCartItem(itemId, quantity);
                await loadCart();
            } else {
                const newCart = cart.map(item =>
                    item.id === itemId ? { ...item, quantity } : item
                );
                setCart(newCart);
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        setLoading(true);
        try {
            if (isAuthenticated()) {
                await orderService.removeFromCart(itemId);
                await loadCart();
            } else {
                const newCart = cart.filter(item => item.id !== itemId);
                setCart(newCart);
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        try {
            if (isAuthenticated()) {
                await orderService.clearCart();
            }
            setCart([]);
            localStorage.removeItem('cart');
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        loadCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;