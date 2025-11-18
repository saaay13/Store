// ==================== FILTROS PARA BÚSQUEDAS ====================

import type { Producto } from '../entities/product';
import type { Venta } from '../entities/sale';
import type { Compra } from '../entities/purchase';

export interface FiltroProductos {
  nombre?: string;
  categoria_id?: number;
  precio_min?: number;
  precio_max?: number;
  stock_min?: number;
  stock_max?: number;
}

export interface FiltroVentas {
  fecha_desde?: Date;
  fecha_hasta?: Date;
  cliente_id?: number;
  empleado_id?: number;
  metodo_pago_id?: number;
  total_min?: number;
  total_max?: number;
}

export interface FiltroCompras {
  fecha_desde?: Date;
  fecha_hasta?: Date;
  proveedor_id?: number;
  empleado_id?: number;
  total_min?: number;
  total_max?: number;
}