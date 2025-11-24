// ==================== COMPRA ====================

import type { Proveedor } from './supplier';
import type { Usuario } from './user';
import type { Libro } from './book';

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
  libro_id: number; // ID del libro comprado
  producto_id: number; // Alias para compatibilidad (mismo que libro_id)
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
  libro?: Libro; // Relación opcional
  producto?: Libro; // Alias para compatibilidad
}

export interface CrearCompra {
  proveedor_id: number;
  empleado_id: number;
  detalles: CrearDetalleCompra[];
}

export interface CrearDetalleCompra {
  libro_id?: number; // Preferir este
  producto_id?: number; // Alias para compatibilidad
  cantidad: number;
  costo_unitario: number;
}

export type EstadoCompra = 'pendiente' | 'recibida' | 'cancelada';