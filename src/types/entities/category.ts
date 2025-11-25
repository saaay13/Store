// ==================== CATEGORIA ====================

export interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion: string;
  icono: string | null; // Icono Lucide para la categoría
  imagen_url: string | null; // URL de imagen representativa
}

export interface CrearCategoria {
  nombre: string;
  descripcion: string;
  icono?: string;
  imagen_url?: string;
}

export interface ActualizarCategoria extends Partial<CrearCategoria> {
  categoria_id: number;
}