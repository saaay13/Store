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

export interface ValidadorProducto {
  nombre: ReglasValidacion;
  precio_venta: ReglasValidacion;
  stock_actual: ReglasValidacion;
  codigo_barras: ReglasValidacion;
}

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