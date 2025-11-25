// ==================== EDITORIAL ====================

export interface Editorial {
  editorial_id: number;
  nombre: string;
  pais: string;
  sitio_web: string | null;
  descripcion: string;
}

export interface CrearEditorial {
  nombre: string;
  pais: string;
  sitio_web?: string;
  descripcion: string;
}

export interface ActualizarEditorial extends Partial<CrearEditorial> {
  editorial_id: number;
}
