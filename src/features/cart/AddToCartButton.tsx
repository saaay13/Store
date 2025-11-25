import { useState } from 'react';
import { useCart } from './CartContext';
import { useUIService } from '../../stores/ui';
import type { Book } from '../../types';

interface AddToCartButtonProps {
  book: Book;
  quantity?: number;
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton = ({ book, quantity = 1, className = '', disabled = false }: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const { toast } = useUIService();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(book, quantity);
      toast.success('Libro agregado al carrito');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar al carrito');
    } finally {
      setTimeout(() => setIsAdding(false), 500); // Brief feedback
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAdding ? 'Agregando...' : disabled ? 'Sin Stock' : 'Agregar al Carrito'}
    </button>
  );
};
