import { useCart } from './CartContext';
import type { CartItem as CartItemType } from './types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { libro, quantity } = item;

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(libro.libro_id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(libro.libro_id);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex-1">
        <h3 className="font-semibold">{libro.titulo}</h3>
        <p className="text-gray-600">{libro.sinopsis}</p>
        <p className="text-sm text-gray-500">Precio: Bs. {libro.precio_venta}</p>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          -
        </button>
        <span className="px-3 py-1 border rounded">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          +
        </button>
        <button
          onClick={handleRemove}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
      <div className="ml-4 text-right">
        <p className="font-semibold">Bs. {(libro.precio_venta * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};