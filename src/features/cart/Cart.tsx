import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Badge } from "../../components/atoms";
import { useUIService } from "../../stores/ui";
import { useCart } from "./CartContext";
import { CartItem } from "./CartItem";

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { toast, confirm } = useUIService();

  const subtotal = useMemo(() => cart.total, [cart.total]);
  const shipping = useMemo(() => (subtotal > 0 ? 0 : 0), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const handleClearCart = () => {
    confirm.show({
      title: "Vaciar carrito",
      message:
        "¿Seguro que deseas eliminar todos los libros del carrito? No podrás recuperarlos después.",
      confirmText: "Vaciar",
      variant: "danger",
      onConfirm: async () => {
        clearCart();
        toast.info("Carrito vaciado");
      },
    });
  };

  const handleCheckout = () => {
    toast.info("Ahora completaremos tus datos de envío y pago");
    navigate("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Badge variant="secondary">Carrito</Badge>
            <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
            <p className="text-muted-foreground">
              Explora el catálogo y agrega libros para continuar con la compra.
            </p>
          </div>
          <Button onClick={() => navigate("/products")}>Ver libros</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Resumen de compra</p>
          <h2 className="text-3xl font-bold">Carrito de libros</h2>
        </div>
        <Button variant="outline" onClick={handleClearCart}>
          Vaciar carrito
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-4" padding="lg">
          {cart.items.map((item) => (
            <CartItem
              key={item.book.bookId ?? item.book.libro_id}
              item={item}
            />
          ))}
        </Card>

        <div className="space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-semibold">Bs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Envío</span>
              <span className="font-semibold">Bs. {shipping.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                Bs. {total.toFixed(2)}
              </span>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Proceder al pago
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
