# Tipos TypeScript - Tienda de Barrio

Este directorio contiene todas las definiciones de tipos TypeScript para el sistema de gestión de tienda de barrio, organizadas en módulos escalables basados en el diagrama ER proporcionado.

## Estructura Organizada

```
src/types/
├── index.ts              # Exportaciones principales
├── README.md            # Esta documentación
├── entities/            # Entidades del dominio
│   ├── user.ts
│   ├── product.ts
│   ├── category.ts
│   ├── supplier.ts
│   ├── payment-method.ts
│   ├── sale.ts
│   └── purchase.ts
├── operations/          # Tipos para operaciones CRUD
│   ├── create.ts
│   └── update.ts
├── api/                 # Tipos para API
│   ├── responses.ts
│   ├── filters.ts
│   └── pagination.ts
├── reports/             # Tipos para reportes
│   └── index.ts
├── auth/                # Tipos de autenticación
│   └── index.ts
├── validation/          # Tipos de validación
│   └── index.ts
└── config/              # Tipos de configuración
    └── index.ts
```

## Entidades del Dominio

### Usuario (`entities/user.ts`)
Representa tanto clientes como empleados del sistema.
```typescript
interface Usuario {
  usuario_id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  tipo_usuario: TipoUsuario; // 'cliente' | 'empleado' | 'admin' | 'proveedor'
  nombre_usuario: string | null; // Opcional para clientes sin login
  password_hash: string | null; // Opcional si no usa sistema
}
```

### Producto (`entities/product.ts`)
Artículos disponibles para venta con información de inventario.
```typescript
interface Producto {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  precio_compra_referencia: number;
  stock_actual: number;
  unidad_medida: string;
  codigo_barras: string;
  categoria_id: number;
  categoria?: Categoria; // Relación opcional
}
```

### Venta y DetalleVenta (`entities/sale.ts`)
Transacciones de venta al cliente con sus detalles.
```typescript
interface Venta {
  venta_id: number;
  fecha_hora: Date;
  total: number;
  cliente_id: number;
  empleado_id: number;
  metodo_pago_id: number;
  cliente?: Usuario; // Relación opcional
  empleado?: Usuario; // Relación opcional
  metodo_pago?: MetodoPago; // Relación opcional
  detalles?: DetalleVenta[]; // Relación opcional
}
```

### Compra y DetalleCompra (`entities/purchase.ts`)
Compras a proveedores para reponer inventario.
```typescript
interface Compra {
  compra_id: number;
  fecha_hora: Date;
  total: number;
  proveedor_id: number;
  empleado_id: number;
  proveedor?: Proveedor; // Relación opcional
  empleado?: Usuario; // Relación opcional
  detalles?: DetalleCompra[]; // Relación opcional
}
```

## Operaciones CRUD

### Creación (`operations/create.ts`)
Interfaces para crear nuevas entidades (sin IDs auto-generados):
- `CrearCategoria`, `CrearProducto`, `CrearProveedor`
- `CrearUsuario`, `CrearMetodoPago`
- `CrearVenta`, `CrearCompra` (incluyen detalles)

### Actualización (`operations/update.ts`)
Interfaces para actualizar entidades existentes (ID requerido, campos opcionales):
- `ActualizarCategoria`, `ActualizarProducto`, etc.
- Usan `Partial<TipoCrear>` para campos opcionales

## API y Comunicación

### Respuestas (`api/responses.ts`)
```typescript
interface RespuestaAPI<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface ListaPaginada<T> {
  items: T[];
  total: number;
  pagina: number;
  limite: number;
  total_paginas: number;
}
```

### Filtros (`api/filters.ts`)
Interfaces para filtrar resultados en búsquedas:
- `FiltroProductos`: nombre, categoría, rango de precios, stock
- `FiltroVentas`: fechas, cliente, empleado, método de pago, totales
- `FiltroCompras`: fechas, proveedor, empleado, totales

### Paginación (`api/pagination.ts`)
```typescript
interface OpcionesPaginacion {
  pagina?: number;
  limite?: number;
  ordenar_por?: string;
  orden?: 'asc' | 'desc';
}
```

## Reportes y Analytics

### Reportes (`reports/index.ts`)
- `ReporteVentas`: métricas de ventas, productos más vendidos, métodos de pago
- `ReporteInventario`: stock bajo, valor total, productos por categoría

## Autenticación

### Auth (`auth/index.ts`)
```typescript
interface CredencialesLogin {
  nombre_usuario: string;
  password: string;
}

interface TokenUsuario {
  usuario: Usuario;
  token: string;
  expira_en: Date;
}
```

## Validación

### Validation (`validation/index.ts`)
```typescript
interface ErrorValidacion {
  campo: string;
  mensaje: string;
}

interface ResultadoValidacion {
  esValido: boolean;
  errores: ErrorValidacion[];
}
```

## Configuración

### Config (`config/index.ts`)
- `ConfiguracionTienda`: nombre, dirección, IVA, moneda
- `ConfiguracionSistema`: paginación, zona horaria, idioma
- `ConfiguracionImpresion`: tickets, logos
- `ConfiguracionBackup`: frecuencia, retención

## Estados y Tipos de Unión

```typescript
type TipoUsuario = 'cliente' | 'empleado' | 'admin' | 'proveedor';
type EstadoVenta = 'pendiente' | 'completada' | 'cancelada';
type EstadoCompra = 'pendiente' | 'recibida' | 'cancelada';
```

## Uso en el Código

### Importación desde el índice principal
```typescript
import type {
  Usuario,
  Producto,
  Venta,
  CrearProducto,
  RespuestaAPI,
  FiltroProductos
} from '@/types';
```

### Importación directa desde módulos
```typescript
import type { Usuario, TipoUsuario } from '@/types/entities/user';
import type { RespuestaAPI } from '@/types/api/responses';
import type { ReporteVentas } from '@/types/reports';
```

### Ejemplo de Función Tipada
```typescript
// ✅ Correcto: Tipado fuerte
const crearProducto = async (datos: CrearProducto): Promise<RespuestaAPI<Producto>> => {
  const response = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    throw new Error('Error al crear producto');
  }

  return response.json();
};
```

## Reglas de Organización

1. **Un archivo por entidad** - Cada entidad del dominio en su propio archivo
2. **Separación por responsabilidad** - API, auth, validation, config en módulos distintos
3. **Exportaciones consistentes** - Todos los tipos exportados desde `index.ts`
4. **Imports relativos** - Usar rutas relativas dentro del módulo de tipos
5. **Documentación por módulo** - Cada archivo documentado con ejemplos

## Relaciones del Diagrama ER

- **Categoria** 1:N **Producto**
- **Producto** N:1 **Categoria**
- **Producto** 1:N **DetalleVenta**
- **Producto** 1:N **DetalleCompra**
- **Proveedor** 1:N **Compra**
- **Usuario** 1:N **Venta** (cliente/empleado)
- **Usuario** 1:N **Compra** (empleado)
- **MetodoPago** 1:N **Venta**
- **Venta** 1:N **DetalleVenta**
- **Compra** 1:N **DetalleCompra**