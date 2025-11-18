// ==================== CATEGORIA ====================

export interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion: string;
}

export interface CrearCategoria {
  nombre: string;
  descripcion: string;
}

export interface ActualizarCategoria extends Partial<CrearCategoria> {
  categoria_id: number;
}