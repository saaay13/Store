// ==================== PAGINACIÓN ====================

export interface OpcionesPaginacion {
  pagina?: number;
  limite?: number;
  ordenar_por?: string;
  orden?: 'asc' | 'desc';
}

export interface InfoPaginacion {
  pagina_actual: number;
  total_paginas: number;
  total_items: number;
  items_por_pagina: number;
  tiene_siguiente: boolean;
  tiene_anterior: boolean;
}