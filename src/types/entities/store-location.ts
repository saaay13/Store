// ==================== STORE LOCATION ====================

export interface StoreLocation {
  locationId: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
  description?: string;
  isPrimary: boolean;

  // Legacy Spanish keys for compatibility
  sucursal_id?: number;
  nombre?: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  latitud?: number;
  longitud?: number;
  horarios?: string;
  descripcion?: string;
  es_principal?: boolean;
}

export interface CreateStoreLocation {
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
  description?: string;
  isPrimary?: boolean;
}

export interface UpdateStoreLocation extends Partial<CreateStoreLocation> {
  locationId: number;
}
