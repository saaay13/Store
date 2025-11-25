# Documentación de API

Esta sección describe los tipos utilizados para las interfaces de la API, incluyendo respuestas, filtros y paginación.

## Respuestas (Responses)

### ApiResponse<T>
Tipo genérico para respuestas de la API.

**Propiedades:**
- `success`: `boolean` - Indica si la operación fue exitosa.
- `data?`: `T` - Datos de la respuesta (presente si success es true).
- `error?`: `string` - Mensaje de error (presente si success es false).
- `message?`: `string` - Mensaje adicional.

### PaginatedResponse<T>
Tipo para respuestas paginadas.

**Propiedades:**
- `data`: `T[]` - Lista de elementos.
- `pagination`: `PaginationInfo` - Información de paginación.

#### PaginationInfo
Información sobre la paginación.

**Propiedades:**
- `page`: `number` - Página actual.
- `limit`: `number` - Elementos por página.
- `total`: `number` - Total de elementos.
- `totalPages`: `number` - Total de páginas.

## Filtros (Filters)

Los filtros permiten consultar entidades con criterios específicos.

### BaseFilters
Filtros comunes aplicables a la mayoría de entidades.

**Propiedades:**
- `search?`: `string` - Búsqueda de texto libre.
- `createdAtFrom?`: `Date` - Fecha de creación desde.
- `createdAtTo?`: `Date` - Fecha de creación hasta.
- `updatedAtFrom?`: `Date` - Fecha de actualización desde.
- `updatedAtTo?`: `Date` - Fecha de actualización hasta.

### UserFilters
Filtros específicos para usuarios.

**Propiedades:**
- Extiende `BaseFilters`.
- `role?`: `'admin' | 'user'` - Filtrar por rol.
- `email?`: `string` - Filtrar por email.

### CategoryFilters
Filtros para categorías.

**Propiedades:**
- Extiende `BaseFilters`.
- `name?`: `string` - Filtrar por nombre.

### ProductFilters
Filtros para productos.

**Propiedades:**
- Extiende `BaseFilters`.
- `name?`: `string` - Filtrar por nombre.
- `categoryId?`: `string` - Filtrar por categoría.
- `supplierId?`: `string` - Filtrar por proveedor.
- `priceMin?`: `number` - Precio mínimo.
- `priceMax?`: `number` - Precio máximo.
- `stockMin?`: `number` - Stock mínimo.
- `stockMax?`: `number` - Stock máximo.

### SupplierFilters
Filtros para proveedores.

**Propiedades:**
- Extiende `BaseFilters`.
- `name?`: `string` - Filtrar por nombre.
- `contact?`: `string` - Filtrar por contacto.

### PaymentMethodFilters
Filtros para métodos de pago.

**Propiedades:**
- Extiende `BaseFilters`.
- `name?`: `string` - Filtrar por nombre.
- `type?`: `'cash' | 'card' | 'transfer'` - Filtrar por tipo.
- `isActive?`: `boolean` - Filtrar por estado activo.

### SaleFilters
Filtros para ventas.

**Propiedades:**
- Extiende `BaseFilters`.
- `userId?`: `string` - Filtrar por usuario.
- `paymentMethodId?`: `string` - Filtrar por método de pago.
- `totalMin?`: `number` - Total mínimo.
- `totalMax?`: `number` - Total máximo.
- `dateFrom?`: `Date` - Fecha desde.
- `dateTo?`: `Date` - Fecha hasta.

### PurchaseFilters
Filtros para compras.

**Propiedades:**
- Extiende `BaseFilters`.
- `supplierId?`: `string` - Filtrar por proveedor.
- `paymentMethodId?`: `string` - Filtrar por método de pago.
- `totalMin?`: `number` - Total mínimo.
- `totalMax?`: `number` - Total máximo.
- `dateFrom?`: `Date` - Fecha desde.
- `dateTo?`: `Date` - Fecha hasta.

## Paginación (Pagination)

### PageRequest
Parámetros para solicitar una página.

**Propiedades:**
- `page`: `number` - Número de página (por defecto 1).
- `limit`: `number` - Elementos por página (por defecto 10).
- `sortBy?`: `string` - Campo para ordenar.
- `sortOrder?`: `'asc' | 'desc'` - Orden de clasificación (por defecto 'asc').

### SortOptions
Opciones de ordenamiento.

**Propiedades:**
- `field`: `string` - Campo a ordenar.
- `direction`: `'asc' | 'desc'` - Dirección.