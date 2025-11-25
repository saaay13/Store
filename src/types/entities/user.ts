// ==================== USUARIO ====================

export type Rol = "cliente" | "empleado" | "admin" | "proveedor";

export interface Usuario {
  usuario_id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  tipo_usuario: Rol;
  nombre_usuario: string | null;
  password_hash: string | null;
}

export interface CrearUsuario {
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  tipo_usuario: Rol;
  nombre_usuario?: string;
  password_hash?: string;
}

export interface ActualizarUsuario extends Partial<CrearUsuario> {
  usuario_id: number;
}
