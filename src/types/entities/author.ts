// ==================== AUTOR ====================

export interface Autor {
  autor_id: number;
  nombre: string;
  biografia: string;
  nacionalidad: string;
  fecha_nacimiento: Date | null;
  foto_url: string | null;
}

export interface CrearAutor {
  nombre: string;
  biografia: string;
  nacionalidad: string;
  fecha_nacimiento?: Date;
  foto_url?: string;
}

export interface ActualizarAutor extends Partial<CrearAutor> {
  autor_id: number;
}
