// ==================== CHECKOUT ====================

import type { CartItem } from "../../features/cart/types";
import type { PaymentMethod } from "../entities/payment-method";

export interface ShippingInfo {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  notas?: string;
}

export interface PaymentInfo {
  metodo_pago_id: number;
  metodo_pago?: PaymentMethod;
  paymentMethodId?: number;
  // Para tarjeta de crédito/débito
  numero_tarjeta?: string;
  fecha_expiracion?: string;
  cvv?: string;
  nombre_tarjeta?: string;
}

export interface CheckoutData {
  shipping: ShippingInfo;
  payment: PaymentInfo;
  cartItems: CartItem[];
  total: number;
  cliente_id?: number; // Si está autenticado
}

export type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';
