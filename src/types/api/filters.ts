// ==================== FILTROS PARA BÚSQUEDAS ====================

import type { FormatoLibro, IdiomaLibro, EstadoLibro } from '../entities/book';
import type { GeneroLiterario } from '../entities/category';

// Filtro para productos (libros)
export interface FiltroLibros {
  titulo?: string;
  isbn?: string;
  autor_id?: number;
  editorial_id?: number;
  categoria_id?: number;
  genero?: GeneroLiterario;
  formato?: FormatoLibro;
  idioma?: IdiomaLibro;
  estado?: EstadoLibro;
  año_desde?: number;
  año_hasta?: number;
  precio_min?: number;
  precio_max?: number;
  stock_min?: number;
  stock_max?: number;
}

// Alias para compatibilidad
export type FiltroProductos = FiltroLibros;

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