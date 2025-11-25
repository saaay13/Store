// ==================== AUTHOR ====================

export interface Author {
  authorId: number;
  name: string;
  biography: string;
  nationality: string;
  birthDate: Date | null;
  photoUrl: string | null;

  // Legacy Spanish keys for compatibility
  autor_id?: number;
  nombre?: string;
  biografia?: string;
  nacionalidad?: string;
  fecha_nacimiento?: Date | null;
  foto_url?: string | null;
}

export interface CreateAuthor {
  name: string;
  biography: string;
  nationality: string;
  birthDate?: Date;
  photoUrl?: string;
}

export interface UpdateAuthor extends Partial<CreateAuthor> {
  authorId: number;
}
