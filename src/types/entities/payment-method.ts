// ==================== PAYMENT METHOD ====================

export interface PaymentMethod {
  paymentMethodId: number;
  name: string; // 'Efectivo', 'Tarjeta', 'QR', 'Transferencia', 'Fiado'
  description: string;

  // Legacy Spanish keys
  metodo_pago_id?: number;
  nombre?: string;
  descripcion?: string;
}

export interface CreatePaymentMethod {
  name: string;
  description: string;
}

export interface UpdatePaymentMethod extends Partial<CreatePaymentMethod> {
  paymentMethodId: number;
}
