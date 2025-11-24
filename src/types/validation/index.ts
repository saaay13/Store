// ==================== VALIDACIÓN ====================

export interface ErrorValidacion {
  campo: string;
  mensaje: string;
}

export interface ResultadoValidacion {
  esValido: boolean;
  errores: ErrorValidacion[];
}

export interface ReglasValidacion {
  requerido?: boolean;
  minimo?: number;
  maximo?: number;
  patron?: RegExp;
  email?: boolean;
  personalizado?: (valor: any) => string | null;
}

// ==================== VALIDADORES POR TIPO ====================

export interface ValidadorLibro {
  isbn: ReglasValidacion;
  titulo: ReglasValidacion;
  autor_id: ReglasValidacion;
  editorial_id: ReglasValidacion;
  precio_venta: ReglasValidacion;
  stock_actual: ReglasValidacion;
  año_publicacion: ReglasValidacion;
  num_paginas: ReglasValidacion;
}

// Alias para compatibilidad
export type ValidadorProducto = ValidadorLibro;

export interface ValidadorUsuario {
  nombre: ReglasValidacion;
  email: ReglasValidacion;
  telefono: ReglasValidacion;
  nombre_usuario?: ReglasValidacion;
}

export interface ValidadorVenta {
  cliente_id: ReglasValidacion;
  empleado_id: ReglasValidacion;
  metodo_pago_id: ReglasValidacion;
  detalles: ReglasValidacion;
}