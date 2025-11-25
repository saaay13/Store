// ==================== SEARCH FILTERS ====================

import type { BookFormat, BookLanguage, BookStatus } from "../entities/book";
import type { LiteraryGenre } from "../entities/category";

// Product (book) filter
export interface FiltroLibros {
  title?: string;
  isbn?: string;
  authorId?: number;
  publisherId?: number;
  categoryId?: number;
  genre?: LiteraryGenre;
  format?: BookFormat;
  language?: BookLanguage;
  status?: BookStatus;
  yearFrom?: number;
  yearTo?: number;
  priceMin?: number;
  priceMax?: number;
  stockMin?: number;
  stockMax?: number;
}

// Alias for compatibility
export type FiltroProductos = FiltroLibros;

export interface FiltroVentas {
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: number;
  employeeId?: number;
  paymentMethodId?: number;
  totalMin?: number;
  totalMax?: number;
}

export interface FiltroCompras {
  dateFrom?: Date;
  dateTo?: Date;
  supplierId?: number;
  employeeId?: number;
  totalMin?: number;
  totalMax?: number;
}
