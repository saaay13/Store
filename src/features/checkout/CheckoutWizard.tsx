import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { Button, Card, Input, Textarea, Radio, Badge } from '../../components/atoms';
import { LocationFormField } from '../../components/molecules';
import { useUIService } from '../../stores/ui';
import type { CheckoutStep, CheckoutData, ShippingInfo, PaymentInfo } from '../../types/operations/checkout';

type ShippingFormErrors = Partial<Record<keyof ShippingInfo, string>>;

const CheckoutWizard = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { toast, confirm } = useUIService();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutData, setCheckoutData] = useState<Partial<CheckoutData>>({
    cartItems: cart.items,
    total: cart.total,
  });

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep === 'shipping') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('review');
    else if (currentStep === 'review') setCurrentStep('confirmation');
  };

  const prevStep = () => {
    if (currentStep === 'payment') setCurrentStep('shipping');
    else if (currentStep === 'review') setCurrentStep('payment');
    else if (currentStep === 'confirmation') setCurrentStep('review');
  };

  const handleShippingSubmit = (shipping: ShippingInfo) => {
    updateCheckoutData({ shipping });
    toast.success('Dirección de envío guardada');
    nextStep();
  };

  const handlePaymentSubmit = (payment: PaymentInfo) => {
    updateCheckoutData({ payment });
    toast.info('Método de pago listo');
    nextStep();
  };

  const handleConfirmOrder = () => {
    const total = checkoutData.total ?? 0;
    confirm.show({
      title: 'Confirmar pedido',
      message: `Confirmas la compra por Bs. ${total.toFixed(2)}?`,
      confirmText: 'Confirmar pedido',
      variant: 'info',
      onConfirm: async () => {
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1200));
        clearCart();
        toast.success('Pedido confirmado 🎉');
        setIsSubmitting(false);
        nextStep();
      },
    });
  };

  const steps = [
    { key: 'shipping', label: 'Envío' },
    { key: 'payment', label: 'Pago' },
    { key: 'review', label: 'Revisar' },
    { key: 'confirmation', label: 'Confirmación' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  if (cart.items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Badge variant="secondary">Checkout</Badge>
            <h2 className="text-2xl font-bold">No hay productos</h2>
            <p className="text-muted-foreground">
              Agrega libros al carrito para continuar con tu compra.
            </p>
          </div>
          <Button onClick={() => navigate('/products')}>Ir a productos</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Proceso de compra</p>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
          <Badge variant="primary">{Math.round(progressPercentage)}% completado</Badge>
        </div>
        <div className="w-full bg-muted h-2 rounded-full">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((step, index) => (
            <span key={step.key} className={index <= currentStepIndex ? 'text-primary font-semibold' : ''}>
              {step.label}
            </span>
          ))}
        </div>
      </header>

      <Card className="p-6">
        {currentStep === 'shipping' && (
          <ShippingStep
            initialData={checkoutData.shipping}
            onSubmit={handleShippingSubmit}
            onBack={() => navigate('/cart')}
          />
        )}
        {currentStep === 'payment' && (
          <PaymentStep
            initialData={checkoutData.payment}
            onSubmit={handlePaymentSubmit}
            onBack={prevStep}
          />
        )}
        {currentStep === 'review' && checkoutData.shipping && checkoutData.payment && checkoutData.cartItems && (
          <ReviewStep
            data={checkoutData as CheckoutData}
            onSubmit={handleConfirmOrder}
            onBack={prevStep}
            isSubmitting={isSubmitting}
          />
        )}
        {currentStep === 'confirmation' && (
          <ConfirmationStep
            data={checkoutData as CheckoutData}
            onContinue={() => navigate('/products')}
          />
        )}
      </Card>
    </div>
  );
};

const ShippingStep = ({
  initialData,
  onSubmit,
  onBack,
}: {
  initialData?: ShippingInfo;
  onSubmit: (data: ShippingInfo) => void;
  onBack: () => void;
}) => {
  const { toast } = useUIService();
  const [formData, setFormData] = useState<ShippingInfo>(
    initialData || {
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      ciudad: '',
      ubicacion: undefined,
      notas: '',
    }
  );

  const [errors, setErrors] = useState<ShippingFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ShippingFormErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono es requerido';
    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.direccion.trim()) newErrors.direccion = 'Dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'Ciudad es requerida';
    if (!formData.ubicacion) newErrors.ubicacion = 'Selecciona tu ubicacion en el mapa';

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error('Revisa los campos marcados');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLocationChange = (coords: [number, number]) => {
    setFormData((prev) => ({ ...prev, ubicacion: coords }));
    if (errors.ubicacion) {
      setErrors((prev) => ({ ...prev, ubicacion: undefined }));
    }
  };


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Información de envío</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Nombre completo *"
            error={errors.nombre}
            input={
              <Input
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                variant={errors.nombre ? 'error' : 'default'}
                placeholder="Ingresa tu nombre completo"
                required
              />
            }
          />
          <Field
            label="Teléfono *"
            error={errors.telefono}
            input={
              <Input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                variant={errors.telefono ? 'error' : 'default'}
                placeholder="+591 70000000"
                required
              />
            }
          />
        </div>

        <Field
          label="Email *"
          error={errors.email}
          input={
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              variant={errors.email ? 'error' : 'default'}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          }
        />

        <Field
          label="Dirección completa *"
          error={errors.direccion}
          input={
            <Input
              value={formData.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              variant={errors.direccion ? 'error' : 'default'}
              placeholder="Calle, número, referencia"
              required
            />
          }
        />

        <Field
          label="Ciudad *"
          error={errors.ciudad}
          input={
            <Input
              value={formData.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              variant={errors.ciudad ? 'error' : 'default'}
              placeholder="Ciudad o localidad"
              required
            />
          }
        />

        <LocationFormField
          label="Ubicacion en el mapa *"
          name="shipping-location"
          value={formData.ubicacion}
          onChange={handleLocationChange}
          error={errors.ubicacion}
          helperText="Marca el punto de entrega o usa tu ubicacion actual."
          required
          mapHeight="300px"
          showManualInput
          className="pt-2"
        />

        <Field
          label="Notas adicionales (opcional)"
          input={
            <Textarea
              value={formData.notas || ''}
              onChange={(e) => handleChange('notas', e.target.value)}
              placeholder="Instrucciones especiales de entrega..."
            />
          }
        />

        <div className="flex justify-between pt-6">
          <Button type="button" variant="secondary" onClick={onBack}>
            Volver al carrito
          </Button>
          <Button type="submit">Continuar al pago</Button>
        </div>
      </form>
    </div>
  );
};

const PaymentStep = ({
  initialData,
  onSubmit,
  onBack,
}: {
  initialData?: PaymentInfo;
  onSubmit: (data: PaymentInfo) => void;
  onBack: () => void;
}) => {
  const { toast } = useUIService();
  const [formData, setFormData] = useState<PaymentInfo>(
    initialData || {
      metodo_pago_id: 1,
      numero_tarjeta: '',
      fecha_expiracion: '',
      cvv: '',
      nombre_tarjeta: '',
    }
  );

  const [errors, setErrors] = useState<Partial<PaymentInfo>>({});

  const paymentMethods = [
    { id: 1, name: 'Efectivo', description: 'Pago en efectivo al momento de la entrega' },
    { id: 2, name: 'Tarjeta de Crédito/Débito', description: 'Visa, Mastercard, etc.' },
    { id: 3, name: 'Transferencia Bancaria', description: 'Pago por transferencia' },
    { id: 4, name: 'QR', description: 'Pago mediante código QR' },
    { id: 5, name: 'Fiado', description: 'Pago posterior acordado' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentInfo> = {};

    if (formData.metodo_pago_id === 2) {
      if (!formData.numero_tarjeta?.trim()) newErrors.numero_tarjeta = 'Número de tarjeta requerido';
      if (!formData.fecha_expiracion?.trim()) newErrors.fecha_expiracion = 'Fecha de expiración requerida';
      if (!formData.cvv?.trim()) newErrors.cvv = 'CVV requerido';
      if (!formData.nombre_tarjeta?.trim()) newErrors.nombre_tarjeta = 'Nombre en tarjeta requerido';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      toast.error('Completa los datos de la tarjeta');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleMethodChange = (metodo_pago_id: number) => {
    setFormData((prev) => ({ ...prev, metodo_pago_id }));
    setErrors({});
  };

  const handleCardChange = (field: keyof PaymentInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Método de pago</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-muted-foreground">
            Selecciona un método de pago *
          </label>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <Radio
                id={`payment-${method.id}`}
                name="payment-method"
                checked={formData.metodo_pago_id === method.id}
                onChange={() => handleMethodChange(method.id)}
                className="mt-1"
              />
              <div>
                <label
                  htmlFor={`payment-${method.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {method.name}
                </label>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        {formData.metodo_pago_id === 2 && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium text-foreground">Detalles de la tarjeta</h3>
            <Field
              label="Número de tarjeta *"
              error={errors.numero_tarjeta}
              input={
                <Input
                  value={formData.numero_tarjeta || ''}
                  onChange={(e) => handleCardChange('numero_tarjeta', e.target.value)}
                  variant={errors.numero_tarjeta ? 'error' : 'default'}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Fecha de expiración *"
                error={errors.fecha_expiracion}
                input={
                  <Input
                    value={formData.fecha_expiracion || ''}
                    onChange={(e) => handleCardChange('fecha_expiracion', e.target.value)}
                    variant={errors.fecha_expiracion ? 'error' : 'default'}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                }
              />
              <Field
                label="CVV *"
                error={errors.cvv}
                input={
                  <Input
                    value={formData.cvv || ''}
                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                    variant={errors.cvv ? 'error' : 'default'}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                }
              />
            </div>

            <Field
              label="Nombre en la tarjeta *"
              error={errors.nombre_tarjeta}
              input={
                <Input
                  value={formData.nombre_tarjeta || ''}
                  onChange={(e) => handleCardChange('nombre_tarjeta', e.target.value)}
                  variant={errors.nombre_tarjeta ? 'error' : 'default'}
                  placeholder="Como aparece en la tarjeta"
                  required
                />
              }
            />
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="secondary" onClick={onBack}>
            Atrás
          </Button>
          <Button type="submit">Continuar a revisión</Button>
        </div>
      </form>
    </div>
  );
};

const ReviewStep = ({
  data,
  onSubmit,
  onBack,
  isSubmitting,
}: {
  data: CheckoutData;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}) => {
  const paymentMethods = [
    { id: 1, name: 'Efectivo' },
    { id: 2, name: 'Tarjeta de Crédito/Débito' },
    { id: 3, name: 'Transferencia Bancaria' },
    { id: 4, name: 'QR' },
    { id: 5, name: 'Fiado' },
  ];

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === data.payment.metodo_pago_id);
  const total = useMemo(() => data.total ?? 0, [data.total]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Revisar pedido</h2>

      <div className="space-y-6">
        <Card className="border border-border p-4">
          <h3 className="text-lg font-medium mb-3">Informaci?n de env?o</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nombre:</span> {data.shipping.nombre}
            </div>
            <div>
              <span className="font-medium">Tel?fono:</span> {data.shipping.telefono}
            </div>
            <div>
              <span className="font-medium">Email:</span> {data.shipping.email}
            </div>
            <div>
              <span className="font-medium">Ciudad:</span> {data.shipping.ciudad}
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Direcci?n:</span> {data.shipping.direccion}
          </div>
          {data.shipping.ubicacion && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Ubicacion:</span>{' '}
              {`${data.shipping.ubicacion[0].toFixed(5)}, ${data.shipping.ubicacion[1].toFixed(5)}`}
            </div>
          )}
          {data.shipping.notas && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Notas:</span> {data.shipping.notas}
            </div>
          )}
        </Card>

        <Card className="border border-border p-4">
          <h3 className="text-lg font-medium mb-3">Método de pago</h3>
          <div className="text-sm">
            <span className="font-medium">Método:</span> {selectedPaymentMethod?.name}
          </div>
          {data.payment.metodo_pago_id === 2 && (
            <div className="mt-2 text-sm">
              <div>
                <span className="font-medium">Tarjeta:</span> **** **** ****{' '}
                {data.payment.numero_tarjeta?.slice(-4)}
              </div>
              <div>
                <span className="font-medium">Nombre:</span> {data.payment.nombre_tarjeta}
              </div>
            </div>
          )}
        </Card>

        <Card className="border border-border p-4">
          <h3 className="text-lg font-medium mb-3">Libros</h3>
          <div className="space-y-3">
            {data.cartItems.map((item) => (
              <div
                key={item.book.bookId ?? item.book.libro_id}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex-1">
                  <span className="font-medium">{item.book.title ?? item.book.titulo}</span>
                  <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">
                  Bs. {((item.book.price ?? item.book.precio_venta ?? 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between items-center font-semibold">
            <span>Total:</span>
            <span>Bs. {total.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      <div className="flex justify-between mt-2">
        <Button variant="secondary" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onSubmit} isLoading={isSubmitting}>
          Confirmar pedido
        </Button>
      </div>
    </div>
  );
};

const ConfirmationStep = ({ data, onContinue }: { data: CheckoutData; onContinue: () => void }) => (
  <div className="text-center space-y-4">
    <h2 className="text-2xl font-semibold">¡Pedido confirmado!</h2>
    <p className="text-muted-foreground">
      Gracias por tu compra. Enviaremos la confirmación a {data.shipping?.email ?? 'tu correo'}.
    </p>
    <div className="bg-muted rounded-lg p-4 inline-block">
      <p className="font-semibold">Total pagado: Bs. {(data.total ?? 0).toFixed(2)}</p>
      <p className="text-sm text-muted-foreground">Seguiremos informándote por email.</p>
    </div>
    <Button onClick={onContinue}>Volver a la tienda</Button>
  </div>
);

const Field = ({
  label,
  error,
  input,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-muted-foreground">{label}</label>
    {input}
    {error && <p className="text-error text-sm">{error}</p>}
  </div>
);

export default CheckoutWizard;
