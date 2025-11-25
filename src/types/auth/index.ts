// ==================== AUTENTICACIÓN ====================

import type { Usuario } from '../entities/user';

export interface CredencialesLogin {
  nombre_usuario: string;
  password: string;
}

export interface TokenUsuario {
  usuario: Usuario;
  token: string;
  expira_en: Date;
}

export interface SesionUsuario {
  usuario: Usuario;
  token: string;
  expira_en: Date;
  ultima_actividad: Date;
}

export interface CambioPassword {
  password_actual: string;
  password_nueva: string;
  confirmar_password: string;
}