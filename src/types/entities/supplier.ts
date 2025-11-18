// ==================== PROVEEDOR ====================

export interface Proveedor {
  proveedor_id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
}

export interface CrearProveedor {
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
}

export interface ActualizarProveedor extends Partial<CrearProveedor> {
  proveedor_id: number;
}