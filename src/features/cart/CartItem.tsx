import { useMemo } from 'react';
import { Badge, Button, Input } from '../../components/atoms';
import { useUIService } from '../../stores/ui';
import { useCart } from './CartContext';
import type { CartItem as CartItemType } from './types';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { toast, confirm } = useUIService();
  const { book, quantity } = item;

  const bookId = book.bookId ?? book.libro_id;
  const price = useMemo(() => book.price ?? book.precio_venta ?? 0, [book.price, book.precio_venta]);
  const title = book.title ?? book.titulo ?? 'Libro';
  const cover = book.coverUrl ?? book.portada_url;

  const handleQuantityChange = (value: number) => {
    if (!bookId) return;
    const safeValue = Math.max(1, value);
    updateQuantity(bookId, safeValue);
    toast.info('Cantidad actualizada');
  };

  const handleRemove = () => {
    if (!bookId) return;
    confirm.delete(title, async () => {
      removeFromCart(bookId);
      toast.success('Libro eliminado del carrito');
    });
  };

  return (
    <div className="flex gap-4 items-start border border-border rounded-lg p-4">
      <div className="h-20 w-16 rounded-md bg-muted overflow-hidden flex items-center justify-center">
        {cover ? (
          <img src={cover} alt={title} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground text-center px-2">Sin portada</span>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold leading-tight">{title}</h3>
            {book.author?.name && (
              <p className="text-sm text-muted-foreground">{book.author.name}</p>
            )}
            <Badge variant="secondary" size="sm" className="mt-1">
              Bs. {price.toFixed(2)}
            </Badge>
          </div>
          <Button variant="outline" size="sm" onClick={handleRemove}>
            Eliminar
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="w-16 text-center"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Stock disponible: {book.stock ?? book.stock_actual ?? '—'}
          </p>
        </div>
      </div>

      <div className="text-right min-w-[120px]">
        <p className="text-sm text-muted-foreground">Total</p>
        <p className="text-xl font-bold">Bs. {(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};
