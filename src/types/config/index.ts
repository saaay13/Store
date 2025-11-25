// ==================== CONFIGURACIÓN ====================

export interface ConfiguracionTienda {
  nombre_tienda: string;
  direccion: string;
  telefono: string;
  email: string;
  moneda: string;
  iva_porcentaje: number;
  stock_minimo_alerta: number;
}

export interface ConfiguracionSistema {
  pagina_default: number;
  elementos_por_pagina: number;
  zona_horaria: string;
  idioma: string;
}

export interface ConfiguracionImpresion {
  ancho_ticket: number;
  alto_ticket: number;
  fuente_ticket: string;
  mostrar_logo: boolean;
  mensaje_pie: string;
}

export interface ConfiguracionBackup {
  frecuencia_backup: 'diario' | 'semanal' | 'mensual';
  retencion_backup_dias: number;
  ruta_backup: string;
  incluir_imagenes: boolean;
}