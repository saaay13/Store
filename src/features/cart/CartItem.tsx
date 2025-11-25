import { useCart } from './CartContext';
import type { CartItem as CartItemType } from './types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { book, quantity } = item;
  const bookId = book.bookId ?? book.libro_id;
  const price = book.price ?? book.precio_venta ?? 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (bookId !== undefined) {
      updateQuantity(bookId, newQuantity);
    }
  };

  const handleRemove = () => {
    if (bookId !== undefined) {
      removeFromCart(bookId);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex-1">
        <h3 className="font-semibold">{book.title ?? book.titulo}</h3>
        <p className="text-gray-600">{book.synopsis ?? book.sinopsis}</p>
        <p className="text-sm text-gray-500">Precio: Bs. {price}</p>
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
        <p className="font-semibold">Bs. {(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};
