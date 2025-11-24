// ==================== LIBRO ====================

import type { Categoria } from './category';
import type { Autor } from './author';

export type EstadoLibro = 'disponible' | 'agotado' | 'proximamente' | 'descatalogado';

export interface Libro {
  libro_id: number;
  isbn: string; // Identificador único del libro
  titulo: string;
  subtitulo: string | null;
  sinopsis: string;

  // Relaciones
  autor_id: number;
  nombre_editorial: string; // Editorial como string simple
  categoria_id: number;

  // Detalles físicos
  año_publicacion: number;
  idioma: string; // "Español", "Inglés", "Francés", etc.
  num_paginas: number;
  formato: string; // "Tapa dura", "Tapa blanda", "eBook", "Audiolibro"

  // Comercial
  precio_venta: number;
  stock_actual: number;

  // Media y estado
  portada_url: string | null;
  estado: EstadoLibro;

  // Relaciones opcionales para joins
  autor?: Autor;
  categoria?: Categoria;
}

export interface CrearLibro {
  isbn: string;
  titulo: string;
  subtitulo?: string;
  sinopsis: string;
  autor_id: number;
  nombre_editorial: string;
  categoria_id: number;
  año_publicacion: number;
  idioma: string;
  num_paginas: number;
  formato: string;
  precio_venta: number;
  stock_actual: number;
  portada_url?: string;
  estado: EstadoLibro;
}

export interface ActualizarLibro extends Partial<CrearLibro> {
  libro_id: number;
}
