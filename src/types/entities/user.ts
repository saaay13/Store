// ==================== USUARIO ====================

export type TipoUsuario = 'cliente' | 'empleado' | 'admin' | 'proveedor';

export interface Usuario {
  usuario_id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  tipo_usuario: TipoUsuario;
  nombre_usuario: string | null; // Puede ser null si solo es cliente sin login
  password_hash: string | null; // Puede ser null si no usa sistema
}

export interface CrearUsuario {
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  tipo_usuario: TipoUsuario;
  nombre_usuario?: string; // Opcional para clientes sin login
  password_hash?: string; // Opcional si no usa sistema
}

export interface ActualizarUsuario extends Partial<CrearUsuario> {
  usuario_id: number;
}