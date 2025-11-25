// ==================== SALE ====================

import type { User } from "./user";
import type { PaymentMethod } from "./payment-method";
import type { Book } from "./book";

export interface Sale {
  saleId: number;
  datetime: Date;
  total: number;
  customerId: number;
  employeeId: number;
  paymentMethodId: number;
  customer?: User; // optional relation
  employee?: User; // optional relation
  paymentMethod?: PaymentMethod; // optional relation
  details?: SaleDetail[]; // optional relation
  detalles?: SaleDetail[]; // legacy compatibility

  // Legacy Spanish keys
  venta_id?: number;
  fecha_hora?: Date;
  cliente_id?: number;
  empleado_id?: number;
  metodo_pago_id?: number;
}

export interface SaleDetail {
  saleDetailId: number;
  saleId: number;
  bookId: number; // ID del libro vendido
  productId: number; // Alias para compatibilidad (mismo que bookId)
  quantity: number;
  unitPrice: number;
  subtotal: number;
  book?: Book; // optional relation
  product?: Book; // alias for compatibility

  // Legacy Spanish keys
  detalle_venta_id?: number;
  venta_id?: number;
  libro_id?: number;
  producto_id?: number;
  cantidad?: number;
  precio_unitario?: number;
  subtotal_legacy?: number;
}

export interface CreateSale {
  customerId: number;
  employeeId: number;
  paymentMethodId: number;
  details: CreateSaleDetail[];
}

export interface CreateSaleDetail {
  bookId?: number; // Preferir este
  productId?: number; // Alias para compatibilidad
  quantity: number;
  unitPrice: number;
}

export type SaleStatus = "pendiente" | "completada" | "cancelada";
