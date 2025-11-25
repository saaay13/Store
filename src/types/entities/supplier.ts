// ==================== SUPPLIER ====================

export interface Supplier {
  supplierId: number;
  name: string;
  phone: string;
  address: string;
  email: string;

  // Legacy Spanish keys
  proveedor_id?: number;
  nombre?: string;
  telefono?: string;
  direccion?: string;
}

export interface CreateSupplier {
  name: string;
  phone: string;
  address: string;
  email: string;
}

export interface UpdateSupplier extends Partial<CreateSupplier> {
  supplierId: number;
}
