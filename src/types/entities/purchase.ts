// ==================== COMPRA ====================

import type { Proveedor } from './supplier';
import type { Usuario } from './user';
import type { Producto } from './product';

export interface Compra {
  compra_id: number;
  fecha_hora: Date;
  total: number;
  proveedor_id: number;
  empleado_id: number;
  proveedor?: Proveedor; // Relación opcional
  empleado?: Usuario; // Relación opcional
  detalles?: DetalleCompra[]; // Relación opcional
}

export interface DetalleCompra {
  detalle_compra_id: number;
  compra_id: number;
  producto_id: number;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
  producto?: Producto; // Relación opcional
}

export interface CrearCompra {
  proveedor_id: number;
  empleado_id: number;
  detalles: CrearDetalleCompra[];
}

export interface CrearDetalleCompra {
  producto_id: number;
  cantidad: number;
  costo_unitario: number;
}

export type EstadoCompra = 'pendiente' | 'recibida' | 'cancelada';