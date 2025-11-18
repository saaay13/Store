// ==================== METODO DE PAGO ====================

export interface MetodoPago {
  metodo_pago_id: number;
  nombre: string; // 'Efectivo', 'Tarjeta', 'QR', 'Transferencia', 'Fiado'
  descripcion: string;
}

export interface CrearMetodoPago {
  nombre: string;
  descripcion: string;
}

export interface ActualizarMetodoPago extends Partial<CrearMetodoPago> {
  metodo_pago_id: number;
}