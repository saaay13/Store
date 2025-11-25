import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../../types';
import type { Cart, CartItem } from './types';
import { useAuth } from '../auth';

interface CartContextType {
  cart: Cart;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  clearUserCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });

  // Get cart key for current user
  const getCartKey = () => {
    return user ? `cart_${user.usuario_id || user.userId}` : 'cart_guest';
  };

  useEffect(() => {
    // Load cart from localStorage for current user
    const cartKey = getCartKey();
    const storedCart = localStorage.getItem(cartKey);
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
    } else {
      // No cart for this user, start empty
      setCart({ items: [], total: 0 });
    }
  }, [user]); // Reload when user changes

  const saveCart = (newCart: Cart) => {
    setCart(newCart);
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(newCart));
  };

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
      const unitPrice = item.book.price ?? item.book.precio_venta ?? 0;
      return total + unitPrice * item.quantity;
    }, 0);
  };

  const addToCart = (book: Book, quantity: number = 1) => {
    const bookStock = book.stock ?? book.stock_actual ?? 0;
    const currentInCart = cart.items.find(
      (item) =>
        (item.book.bookId ?? item.book.libro_id) === (book.bookId ?? book.libro_id)
    )?.quantity ?? 0;

    // Validate stock availability
    if (currentInCart + quantity > bookStock) {
      throw new Error(`No hay suficiente stock disponible. Stock actual: ${bookStock}, en carrito: ${currentInCart}`);
    }

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

    // Find the item and validate stock
    const item = cart.items.find(
      (item) => (item.book.bookId ?? item.book.libro_id) === bookId
    );

    if (item) {
      const bookStock = item.book.stock ?? item.book.stock_actual ?? 0;
      if (quantity > bookStock) {
        throw new Error(`No hay suficiente stock disponible. Stock actual: ${bookStock}`);
      }
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

  // Clear cart when user logs out
  const clearUserCart = () => {
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
    setCart({ items: [], total: 0 });
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearUserCart
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
