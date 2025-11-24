import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Libro } from '../../types';
import type { Cart, CartItem } from './types';

interface CartContextType {
  cart: Cart;
  addToCart: (libro: Libro, quantity?: number) => void;
  removeFromCart: (libroId: number) => void;
  updateQuantity: (libroId: number, quantity: number) => void;
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
    return items.reduce((total, item) => total + item.libro.precio_venta * item.quantity, 0);
  };

  const addToCart = (libro: Libro, quantity: number = 1) => {
    const newItems = [...cart.items];
    const existingItem = newItems.find(item => item.libro.libro_id === libro.libro_id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      newItems.push({ libro, quantity });
    }

    const newTotal = calculateTotal(newItems);
    saveCart({ items: newItems, total: newTotal });
  };

  const removeFromCart = (libroId: number) => {
    const newItems = cart.items.filter(item => item.libro.libro_id !== libroId);
    const newTotal = calculateTotal(newItems);
    saveCart({ items: newItems, total: newTotal });
  };

  const updateQuantity = (libroId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(libroId);
      return;
    }

    const newItems = cart.items.map(item =>
      item.libro.libro_id === libroId ? { ...item, quantity } : item
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