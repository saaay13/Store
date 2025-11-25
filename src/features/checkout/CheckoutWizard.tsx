import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { Button, Card, Input, Textarea, Radio } from '../../components/atoms';
import type { CheckoutStep, CheckoutData, ShippingInfo, PaymentInfo } from '../../types/operations/checkout';

const CheckoutWizard = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [checkoutData, setCheckoutData] = useState<Partial<CheckoutData>>({
    cartItems: cart.items,
    total: cart.total
  });

  const updateCheckoutData = (data: Partial<CheckoutData>) => {
    setCheckoutData(prev => ({ ...prev, ...data }));
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
    nextStep();
  };

  const handlePaymentSubmit = (payment: PaymentInfo) => {
    updateCheckoutData({ payment });
    nextStep();
  };

  const handleConfirmOrder = async () => {
    // Aquí iría la lógica para procesar la venta
    // Por ahora, simulamos
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simular API call
    clearCart();
    nextStep();
  };

  const steps = [
    { key: 'shipping', label: 'Envío' },
    { key: 'payment', label: 'Pago' },
    { key: 'review', label: 'Revisar' },
    { key: 'confirmation', label: 'Confirmación' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  if (cart.items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center">
          <h2 className="text-2xl font-bold mb-4">Carrito Vacío</h2>
          <p className="text-gray-600 mb-4">No hay productos en el carrito para proceder al pago.</p>
          <Button onClick={() => navigate('/products')}>Ir a Productos</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Paso {currentStepIndex + 1} de {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={step.key}
              className={`text-xs ${
                index <= currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
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
        {currentStep === 'review' && (
          <ReviewStep
            data={checkoutData as CheckoutData}
            onSubmit={handleConfirmOrder}
            onBack={prevStep}
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

const ShippingStep = ({ initialData, onSubmit, onBack }: {
  initialData?: ShippingInfo;
  onSubmit: (data: ShippingInfo) => void;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState<ShippingInfo>(initialData || {
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    notas: ''
  });

  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono es requerido';
    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.direccion.trim()) newErrors.direccion = 'Dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'Ciudad es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Información de Envío</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <Input
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              variant={errors.nombre ? 'error' : undefined}
              placeholder="Ingresa tu nombre completo"
              required
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <Input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              variant={errors.telefono ? 'error' : undefined}
              placeholder="Ingresa tu número de teléfono"
              required
            />
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            variant={errors.email ? 'error' : undefined}
            placeholder="Ingresa tu correo electrónico"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dirección completa *
          </label>
          <Input
            value={formData.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            variant={errors.direccion ? 'error' : undefined}
            placeholder="Ingresa tu dirección completa"
            required
          />
          {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad *
          </label>
          <Input
            value={formData.ciudad}
            onChange={(e) => handleChange('ciudad', e.target.value)}
            variant={errors.ciudad ? 'error' : undefined}
            placeholder="Ingresa tu ciudad"
            required
          />
          {errors.ciudad && <p className="text-red-500 text-sm mt-1">{errors.ciudad}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales (opcional)
          </label>
          <Textarea
            value={formData.notas || ''}
            onChange={(e) => handleChange('notas', e.target.value)}
            placeholder="Instrucciones especiales de entrega..."
          />
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="secondary" onClick={onBack}>
            Volver al Carrito
          </Button>
          <Button type="submit">
            Continuar al Pago
          </Button>
        </div>
      </form>
    </div>
  );
};

const PaymentStep = ({ initialData, onSubmit, onBack }: {
  initialData?: PaymentInfo;
  onSubmit: (data: PaymentInfo) => void;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState<PaymentInfo>(initialData || {
    metodo_pago_id: 1,
    numero_tarjeta: '',
    fecha_expiracion: '',
    cvv: '',
    nombre_tarjeta: ''
  });

  const [errors, setErrors] = useState<Partial<PaymentInfo>>({});

  const paymentMethods = [
    { id: 1, name: 'Efectivo', description: 'Pago en efectivo al momento de la entrega' },
    { id: 2, name: 'Tarjeta de Crédito/Débito', description: 'Visa, Mastercard, etc.' },
    { id: 3, name: 'Transferencia Bancaria', description: 'Pago por transferencia' },
    { id: 4, name: 'QR', description: 'Pago mediante código QR' },
    { id: 5, name: 'Fiado', description: 'Pago posterior acordado' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentInfo> = {};

    if (formData.metodo_pago_id === 2) {
      // Validar campos de tarjeta
      if (!formData.numero_tarjeta?.trim()) newErrors.numero_tarjeta = 'Número de tarjeta requerido';
      if (!formData.fecha_expiracion?.trim()) newErrors.fecha_expiracion = 'Fecha de expiración requerida';
      if (!formData.cvv?.trim()) newErrors.cvv = 'CVV requerido';
      if (!formData.nombre_tarjeta?.trim()) newErrors.nombre_tarjeta = 'Nombre en tarjeta requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleMethodChange = (metodo_pago_id: number) => {
    setFormData(prev => ({ ...prev, metodo_pago_id }));
    setErrors({});
  };

  const handleCardChange = (field: keyof PaymentInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Método de Pago</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selecciona un método de pago *
          </label>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-start">
              <Radio
                id={`payment-${method.id}`}
                name="payment-method"
                checked={formData.metodo_pago_id === method.id}
                onChange={() => handleMethodChange(method.id)}
                className="mt-1"
              />
              <div className="ml-3">
                <label
                  htmlFor={`payment-${method.id}`}
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {method.name}
                </label>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Card Details */}
        {formData.metodo_pago_id === 2 && (
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Detalles de la Tarjeta</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de tarjeta *
              </label>
              <Input
                value={formData.numero_tarjeta || ''}
                onChange={(e) => handleCardChange('numero_tarjeta', e.target.value)}
                variant={errors.numero_tarjeta ? 'error' : undefined}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
              {errors.numero_tarjeta && <p className="text-red-500 text-sm mt-1">{errors.numero_tarjeta}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de expiración *
                </label>
                <Input
                  value={formData.fecha_expiracion || ''}
                  onChange={(e) => handleCardChange('fecha_expiracion', e.target.value)}
                  variant={errors.fecha_expiracion ? 'error' : undefined}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
                {errors.fecha_expiracion && <p className="text-red-500 text-sm mt-1">{errors.fecha_expiracion}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <Input
                  value={formData.cvv || ''}
                  onChange={(e) => handleCardChange('cvv', e.target.value)}
                  variant={errors.cvv ? 'error' : undefined}
                  placeholder="123"
                  maxLength={4}
                  required
                />
                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre en la tarjeta *
              </label>
              <Input
                value={formData.nombre_tarjeta || ''}
                onChange={(e) => handleCardChange('nombre_tarjeta', e.target.value)}
                variant={errors.nombre_tarjeta ? 'error' : undefined}
                placeholder="Como aparece en la tarjeta"
                required
              />
              {errors.nombre_tarjeta && <p className="text-red-500 text-sm mt-1">{errors.nombre_tarjeta}</p>}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="secondary" onClick={onBack}>
            Atrás
          </Button>
          <Button type="submit">
            Continuar a Revisión
          </Button>
        </div>
      </form>
    </div>
  );
};

const ReviewStep = ({ data, onSubmit, onBack }: {
  data: CheckoutData;
  onSubmit: () => void;
  onBack: () => void;
}) => {
  const paymentMethods = [
    { id: 1, name: 'Efectivo' },
    { id: 2, name: 'Tarjeta de Crédito/Débito' },
    { id: 3, name: 'Transferencia Bancaria' },
    { id: 4, name: 'QR' },
    { id: 5, name: 'Fiado' }
  ];

  const selectedPaymentMethod = paymentMethods.find(m => m.id === data.payment.metodo_pago_id);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Revisar Pedido</h2>

      <div className="space-y-6">
        {/* Shipping Information */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Información de Envío</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Nombre:</span> {data.shipping.nombre}
            </div>
            <div>
              <span className="font-medium">Teléfono:</span> {data.shipping.telefono}
            </div>
            <div>
              <span className="font-medium">Email:</span> {data.shipping.email}
            </div>
            <div>
              <span className="font-medium">Ciudad:</span> {data.shipping.ciudad}
            </div>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Dirección:</span> {data.shipping.direccion}
          </div>
          {data.shipping.notas && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Notas:</span> {data.shipping.notas}
            </div>
          )}
        </div>

        {/* Payment Information */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Método de Pago</h3>
          <div className="text-sm">
            <span className="font-medium">Método:</span> {selectedPaymentMethod?.name}
          </div>
          {data.payment.metodo_pago_id === 2 && (
            <div className="mt-2 text-sm">
              <div><span className="font-medium">Tarjeta:</span> **** **** **** {data.payment.numero_tarjeta?.slice(-4)}</div>
              <div><span className="font-medium">Nombre:</span> {data.payment.nombre_tarjeta}</div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Libros</h3>
          <div className="space-y-3">
            {data.cartItems.map((item) => (
              <div key={item.libro.libro_id} className="flex justify-between items-center text-sm">
                <div className="flex-1">
                  <span className="font-medium">{item.libro.titulo}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">Bs. {(item.libro.precio_venta * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between items-center font-semibold">
            <span>Total:</span>
            <span>Bs. {data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onBack}>
          Atrás
        </Button>
        <Button onClick={onSubmit}>
          Confirmar Pedido
        </Button>
      </div>
    </div>
  );
};

const ConfirmationStep = ({ onContinue }: any) => (
  <div className="text-center">
    <h2 className="text-xl font-semibold mb-4">¡Pedido Confirmado!</h2>
    <p className="text-gray-600 mb-4">Tu pedido ha sido procesado exitosamente.</p>
    <Button onClick={onContinue}>Continuar Comprando</Button>
  </div>
);

export default CheckoutWizard;