import { useState } from 'react';
import { useCart } from './CartContext';
import type { Libro } from '../../types';

interface AddToCartButtonProps {
  libro: Libro;
  quantity?: number;
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton = ({ libro, quantity = 1, className = '', disabled = false }: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(libro, quantity);
    setTimeout(() => setIsAdding(false), 500); // Brief feedback
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