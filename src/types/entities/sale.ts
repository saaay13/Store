// ==================== VENTA ====================

import type { Usuario } from './user';
import type { MetodoPago } from './payment-method';
import type { Producto } from './product';

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
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto?: Producto; // Relación opcional
}

export interface CrearVenta {
  cliente_id: number;
  empleado_id: number;
  metodo_pago_id: number;
  detalles: CrearDetalleVenta[];
}

export interface CrearDetalleVenta {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

export type EstadoVenta = 'pendiente' | 'completada' | 'cancelada';