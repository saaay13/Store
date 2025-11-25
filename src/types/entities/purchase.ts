// ==================== PURCHASE ====================

import type { Supplier } from "./supplier";
import type { User } from "./user";
import type { Book } from "./book";

export interface Purchase {
  purchaseId: number;
  datetime: Date;
  total: number;
  supplierId: number;
  employeeId: number;
  supplier?: Supplier; // optional relation
  employee?: User; // optional relation
  details?: PurchaseDetail[]; // optional relation

  // Legacy Spanish keys
  compra_id?: number;
  fecha_hora?: Date;
  proveedor_id?: number;
  empleado_id?: number;
}

export interface PurchaseDetail {
  purchaseDetailId: number;
  purchaseId: number;
  bookId: number; // ID del libro comprado
  productId: number; // Alias para compatibilidad (mismo que bookId)
  quantity: number;
  unitCost: number;
  subtotal: number;
  book?: Book; // optional relation
  product?: Book; // alias for compatibility

  // Legacy Spanish keys
  detalle_compra_id?: number;
  compra_id?: number;
  libro_id?: number;
  producto_id?: number;
  cantidad?: number;
  costo_unitario?: number;
}

export interface CreatePurchase {
  supplierId: number;
  employeeId: number;
  details: CreatePurchaseDetail[];
}

export interface CreatePurchaseDetail {
  bookId?: number; // Preferir este
  productId?: number; // Alias para compatibilidad
  quantity: number;
  unitCost: number;
}

export type PurchaseStatus = "pendiente" | "recibida" | "cancelada";
