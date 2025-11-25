// ==================== BOOK ====================

import type { Category } from "./category";
import type { Author } from "./author";

export type BookStatus =
  | "disponible"
  | "agotado"
  | "proximamente"
  | "descatalogado";
export type BookFormat = "Tapa dura" | "Tapa blanda" | "eBook" | "Audiolibro";
export type BookLanguage =
  | "Español"
  | "Inglés"
  | "Francés"
  | "Alemán"
  | "Italiano"
  | "Portugués";

export interface Book {
  bookId: number;
  isbn: string; // Identificador único del libro (texto mostrado sigue en español)
  title: string;
  subtitle: string | null;
  synopsis: string;

  // Relations
  authorId: number;
  publisherName: string; // Editorial como string simple
  categoryId: number;

  // Physical details
  publicationYear: number;
  language: string; // "Español", "Inglés", "Francés", etc.
  pageCount: number;
  format: string; // "Tapa dura", "Tapa blanda", "eBook", "Audiolibro"

  // Commercial
  price: number;
  stock: number;

  // Media and status
  coverUrl: string | null;
  status: BookStatus;

  // Optional relations
  author?: Author;
  category?: Category;

  // Legacy Spanish keys kept temporarily for UI compatibility
  libro_id?: number;
  titulo?: string;
  subtitulo?: string | null;
  sinopsis?: string;
  autor_id?: number;
  nombre_editorial?: string;
  año_publicacion?: number;
  idioma?: string;
  num_paginas?: number;
  formato?: string;
  precio_venta?: number;
  stock_actual?: number;
  portada_url?: string | null;
  estado?: BookStatus;
  autor?: Author;
  categoria?: Category;
}

export interface CreateBook {
  isbn: string;
  title: string;
  subtitle?: string;
  synopsis: string;
  authorId: number;
  publisherName: string;
  categoryId: number;
  publicationYear: number;
  language: string;
  pageCount: number;
  format: string;
  price: number;
  stock: number;
  coverUrl?: string;
  status: BookStatus;
}

export interface UpdateBook extends Partial<CreateBook> {
  bookId: number;
}
