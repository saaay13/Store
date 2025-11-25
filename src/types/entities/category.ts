// ==================== CATEGORY ====================

export type LiteraryGenre =
  | "ficcion"
  | "no_ficcion"
  | "ciencia_ficcion"
  | "fantasia"
  | "romance"
  | "misterio"
  | "thriller"
  | "terror"
  | "biografia";

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  icon: string | null; // Icon name (UI keeps Spanish labels)
  imageUrl: string | null; // Image URL for the category
}

export interface CreateCategory {
  name: string;
  description: string;
  icon?: string;
  imageUrl?: string;
}

export interface UpdateCategory extends Partial<CreateCategory> {
  categoryId: number;
}
