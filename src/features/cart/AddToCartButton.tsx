import { useState } from 'react';
import { useCart } from './CartContext';
import type { Producto } from '../../types/entities/product';

interface AddToCartButtonProps {
  product: Producto;
  quantity?: number;
  className?: string;
}

export const AddToCartButton = ({ product, quantity = 1, className = '' }: AddToCartButtonProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 500); // Brief feedback
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${className}`}
    >
      {isAdding ? 'Agregando...' : 'Agregar al Carrito'}
    </button>
  );
};