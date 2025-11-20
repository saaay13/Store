import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Producto } from '../../types/entities/product';
import type { Cart, CartItem } from './types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Producto, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const saveCart = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.product.precio_venta * item.quantity, 0);
  };

  const addToCart = (product: Producto, quantity: number = 1) => {
    const newItems = [...cart.items];
    const existingItem = newItems.find(item => item.product.producto_id === product.producto_id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      newItems.push({ product, quantity });
    }

    const newTotal = calculateTotal(newItems);
    saveCart({ items: newItems, total: newTotal });
  };

  const removeFromCart = (productId: number) => {
    const newItems = cart.items.filter(item => item.product.producto_id !== productId);
    const newTotal = calculateTotal(newItems);
    saveCart({ items: newItems, total: newTotal });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newItems = cart.items.map(item =>
      item.product.producto_id === productId ? { ...item, quantity } : item
    );
    const newTotal = calculateTotal(newItems);
    saveCart({ items: newItems, total: newTotal });
  };

  const clearCart = () => {
    saveCart({ items: [], total: 0 });
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};