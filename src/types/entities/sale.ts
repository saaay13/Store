// ==================== VENTA ====================

import type { Usuario } from './user';
import type { MetodoPago } from './payment-method';
import type { Libro } from './book';

export interface Venta {
  venta_id: number;
  fecha_hora: Date;
  total: number;
  cliente_id: number;
  empleado_id: number;
  metodo_pago_id: number;
  cliente?: Usuario; // Relación opcional
  empleado?: Usuario; // Relación opcional
  metodo_pago?: MetodoPago; // Relación opcional
  detalles?: DetalleVenta[]; // Relación opcional
}

export interface DetalleVenta {
  detalle_venta_id: number;
  venta_id: number;
  libro_id: number; // ID del libro vendido
  producto_id: number; // Alias para compatibilidad (mismo que libro_id)
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  libro?: Libro; // Relación opcional
  producto?: Libro; // Alias para compatibilidad
}

export interface CrearVenta {
  cliente_id: number;
  empleado_id: number;
  metodo_pago_id: number;
  detalles: CrearDetalleVenta[];
}

export interface CrearDetalleVenta {
  libro_id?: number; // Preferir este
  producto_id?: number; // Alias para compatibilidad
  cantidad: number;
  precio_unitario: number;
}

export type EstadoVenta = 'pendiente' | 'completada' | 'cancelada';