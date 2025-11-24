// ==================== EXPORTACIONES ORGANIZADAS ====================

// Entidades del dominio
export type {
  Usuario,
  TipoUsuario,
  CrearUsuario,
  ActualizarUsuario,
} from './entities/user';

export type {
  Categoria,
  CrearCategoria,
  ActualizarCategoria,
  GeneroLiterario,
} from './entities/category';

export type {
  Autor,
  CrearAutor,
  ActualizarAutor,
} from './entities/author';

export type {
  Libro,
  CrearLibro,
  ActualizarLibro,
  EstadoLibro,
} from './entities/book';

export type {
  Proveedor,
  CrearProveedor,
  ActualizarProveedor,
} from './entities/supplier';

export type {
  MetodoPago,
  CrearMetodoPago,
  ActualizarMetodoPago,
} from './entities/payment-method';

export type {
  Venta,
  DetalleVenta,
  CrearVenta,
  CrearDetalleVenta,
  EstadoVenta,
} from './entities/sale';

export type {
  Compra,
  DetalleCompra,
  CrearCompra,
  CrearDetalleCompra,
  EstadoCompra,
} from './entities/purchase';

// Operaciones CRUD
export type * from './operations/create';
export type * from './operations/update';

// API
export type {
  RespuestaAPI,
  ListaPaginada,
} from './api/responses';

export type {
  FiltroLibros,
  FiltroVentas,
  FiltroCompras,
} from './api/filters';

export type {
  OpcionesPaginacion,
  InfoPaginacion,
} from './api/pagination';

// Reportes
export type {
  ReporteVentas,
  ReporteInventario,
} from './reports';

// Autenticación
export type {
  CredencialesLogin,
  TokenUsuario,
  SesionUsuario,
  CambioPassword,
} from './auth';

// Validación
export type {
  ErrorValidacion,
  ResultadoValidacion,
  ReglasValidacion,
  ValidadorLibro,
  ValidadorUsuario,
  ValidadorVenta,
} from './validation';

// Configuración
export type {
  ConfiguracionTienda,
  ConfiguracionSistema,
  ConfiguracionImpresion,
  ConfiguracionBackup,
} from './config';