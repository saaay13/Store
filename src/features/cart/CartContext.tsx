import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../../types';
import type { Cart, CartItem } from './types';

interface CartContextType {
  cart: Cart;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
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
      try {
    const parsedCart = JSON.parse(storedCart);
        // Ensure items is always an array
        if (parsedCart && Array.isArray(parsedCart.items)) {
          const normalizedItems: CartItem[] = parsedCart.items.map((item: any) => ({
            book: item.book ?? item.libro,
            quantity: item.quantity ?? 1,
          }));
          setCart({ items: normalizedItems, total: parsedCart.total ?? 0 });
        } else {
          // Reset to default if invalid
          setCart({ items: [], total: 0 });
        }
      } catch (error) {
        // Reset to default if parsing fails
        setCart({ items: [], total: 0 });
      }
    }
  }, []);

  const saveCart = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      const unitPrice = item.book.price ?? item.book.precio_venta ?? 0;
      return total + unitPrice * item.quantity;
    }, 0);
  };

  const addToCart = (book: Book, quantity: number = 1) => {
    const newItems = [...cart.items];
    const existingItem = newItems.find(
      (item) =>
        (item.book.bookId ?? item.book.libro_id) === (book.bookId ?? book.libro_id)
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      newItems.push({ book, quantity });
    }

    const newTotal = calculateTotal(newItems);
    saveCart({ items: newItems, total: newTotal });
  };

  const removeFromCart = (bookId: number) => {
    const newItems = cart.items.filter(
      (item) => (item.book.bookId ?? item.book.libro_id) !== bookId
    );
    const newTotal = calculateTotal(newItems);
    saveCart({ items: newItems, total: newTotal });
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    const newItems = cart.items.map((item) =>
      (item.book.bookId ?? item.book.libro_id) === bookId
        ? { ...item, quantity }
        : item
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
