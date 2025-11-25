// ==================== ORGANIZED EXPORTS ====================

// Domain entities
export type {
  User,
  Usuario,
  Role,
  CreateUser,
  UpdateUser,
} from "./entities/user";

export type {
  Category,
  CreateCategory,
  UpdateCategory,
  LiteraryGenre,
} from "./entities/category";

export type { Author, CreateAuthor, UpdateAuthor } from "./entities/author";

export type {
  Book,
  CreateBook,
  UpdateBook,
  BookStatus,
} from "./entities/book";

export type {
  Supplier,
  CreateSupplier,
  UpdateSupplier,
} from "./entities/supplier";

export type {
  PaymentMethod,
  CreatePaymentMethod,
  UpdatePaymentMethod,
} from "./entities/payment-method";

export type {
  Sale,
  SaleDetail,
  CreateSale,
  CreateSaleDetail,
  SaleStatus,
} from "./entities/sale";

export type {
  Purchase,
  PurchaseDetail,
  CreatePurchase,
  CreatePurchaseDetail,
  PurchaseStatus,
} from "./entities/purchase";

export type {
  StoreLocation,
  CreateStoreLocation,
  UpdateStoreLocation,
} from "./entities/store-location";

// CRUD operations
export type * from "./operations/create";
export type * from "./operations/update";

// API
export type { RespuestaAPI, ListaPaginada } from "./api/responses";

export type { FiltroLibros, FiltroVentas, FiltroCompras } from "./api/filters";

export type { OpcionesPaginacion, InfoPaginacion } from "./api/pagination";

// Reports
export type { SalesReport, InventoryReport } from "./reports";

// Authentication
export type {
  CredencialesLogin,
  TokenUsuario,
  SesionUsuario,
  CambioPassword,
} from "./auth";

// Validation
export type {
  ErrorValidacion,
  ResultadoValidacion,
  ReglasValidacion,
  ValidadorLibro,
  ValidadorUsuario,
  ValidadorVenta,
} from "./validation";

// Configuration
export type {
  ConfiguracionTienda,
  ConfiguracionSistema,
  ConfiguracionImpresion,
  ConfiguracionBackup,
} from "./config";
