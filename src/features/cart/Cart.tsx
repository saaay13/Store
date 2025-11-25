import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { CartItem } from './CartItem';

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      <div className="bg-white rounded-lg shadow-md">
        {cart.items.map((item) => (
          <CartItem key={item.book.bookId ?? item.book.libro_id} item={item} />
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Vaciar Carrito
        </button>
        <div className="text-right">
          <p className="text-lg font-semibold">Total: Bs. {cart.total.toFixed(2)}</p>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-2 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
};
