// ==================== CATEGORIA / GÉNERO LITERARIO ====================

export type GeneroLiterario =
  | 'ficcion'
  | 'no_ficcion'
  | 'ciencia_ficcion'
  | 'fantasia'
  | 'romance'
  | 'misterio'
  | 'thriller'
  | 'terror'
  | 'biografia'
  | 'autobiografia'
  | 'historia'
  | 'filosofia'
  | 'poesia'
  | 'teatro'
  | 'infantil'
  | 'juvenil'
  | 'autoayuda'
  | 'negocios'
  | 'ciencia'
  | 'tecnologia'
  | 'arte'
  | 'cocina'
  | 'viajes'
  | 'otros';

export interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion: string;
  genero: GeneroLiterario;
  icono: string | null; // Icono o emoji para la categoría
  imagen_url: string | null; // URL de imagen representativa
}

export interface CrearCategoria {
  nombre: string;
  descripcion: string;
  genero: GeneroLiterario;
  icono?: string;
  imagen_url?: string;
}

export interface ActualizarCategoria extends Partial<CrearCategoria> {
  categoria_id: number;
}