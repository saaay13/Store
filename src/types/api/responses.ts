// ==================== RESPUESTAS DE API ====================

export interface RespuestaAPI<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ListaPaginada<T> {
  items: T[];
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
}