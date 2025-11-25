// ==================== VALIDATION ====================

export interface ErrorValidacion {
  field: string;
  message: string;
}

export interface ResultadoValidacion {
  isValid: boolean;
  errors: ErrorValidacion[];
}

export interface ReglasValidacion {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (valor: any) => string | null;
}

// ==================== TYPE VALIDATORS ====================

export interface ValidadorLibro {
  isbn: ReglasValidacion;
  title: ReglasValidacion;
  authorId: ReglasValidacion;
  publisherId: ReglasValidacion;
  price: ReglasValidacion;
  stock: ReglasValidacion;
  publicationYear: ReglasValidacion;
  pageCount: ReglasValidacion;
}

// Alias for compatibility
export type ValidadorProducto = ValidadorLibro;

export interface ValidadorUsuario {
  name: ReglasValidacion;
  email: ReglasValidacion;
  phone: ReglasValidacion;
  username?: ReglasValidacion;
}

export interface ValidadorVenta {
  customerId: ReglasValidacion;
  employeeId: ReglasValidacion;
  paymentMethodId: ReglasValidacion;
  details: ReglasValidacion;
}
