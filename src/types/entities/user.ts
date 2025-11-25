// ==================== USER ====================

export type Role = "cliente" | "empleado" | "admin" | "proveedor";

export interface User {
  userId: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  userType: Role;
  username: string | null;
  passwordHash: string | null;

  // Legacy Spanish keys
  usuario_id?: number;
  nombre?: string;
  telefono?: string;
  direccion?: string;
  tipo_usuario?: Role;
  nombre_usuario?: string | null;
  password_hash?: string | null;
}

export interface CreateUser {
  name: string;
  phone: string;
  address: string;
  email: string;
  userType: Role;
  username?: string;
  passwordHash?: string;
}

export interface UpdateUser extends Partial<CreateUser> {
  userId: number;
}

// Alias for backward compatibility
export type Usuario = User;
