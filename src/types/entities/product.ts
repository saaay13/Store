// ==================== PRODUCTO ====================

import type { Categoria } from './category';

export interface Producto {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  precio_compra_referencia: number;
  stock_actual: number;
  unidad_medida: string;
  codigo_barras: string;
  categoria_id: number;
  categoria?: Categoria; // Relación opcional para joins
}

export interface CrearProducto {
  nombre: string;
  descripcion: string;
  precio_venta: number;
  precio_compra_referencia: number;
  stock_actual: number;
  unidad_medida: string;
  codigo_barras: string;
  categoria_id: number;
}

export interface ActualizarProducto extends Partial<CrearProducto> {
  producto_id: number;
}