// ==================== REPORTES ====================

import type { Libro } from "../entities/book";
import type { Categoria } from "../entities/category";
import type { MetodoPago } from "../entities/payment-method";

export interface ReporteVentas {
  total_ventas: number;
  total_ingresos: number;
  productos_mas_vendidos: Array<{
    producto: Libro;
    cantidad_total: number;
    ingresos_totales: number;
  }>;
  ventas_por_metodo_pago: Array<{
    metodo_pago: MetodoPago;
    cantidad_ventas: number;
    total: number;
  }>;
  ventas_por_periodo: Array<{
    fecha: string;
    cantidad_ventas: number;
    total: number;
  }>;
}

export interface ReporteInventario {
  productos_bajo_stock: Libro[];
  valor_total_inventario: number;
  productos_por_categoria: Array<{
    categoria: Categoria;
    cantidad_productos: number;
    valor_total: number;
  }>;
}
