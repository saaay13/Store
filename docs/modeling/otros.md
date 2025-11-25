# Documentación de Autenticación, Validación, Configuración e Informes

Esta sección cubre los tipos restantes: autenticación, validación de datos, configuración de la aplicación e informes.

## Autenticación (Auth)

### LoginRequest
Datos para iniciar sesión.

**Propiedades:**
- `email`: `string` - Correo electrónico del usuario.
- `password`: `string` - Contraseña.

### AuthResponse
Respuesta después de autenticación exitosa.

**Propiedades:**
- `user`: `User` - Datos del usuario autenticado.
- `token`: `string` - Token de acceso JWT.
- `refreshToken`: `string` - Token para refrescar el acceso.

### RefreshTokenRequest
Solicitud para refrescar el token.

**Propiedades:**
- `refreshToken`: `string` - Token de refresco.

### UserSession
Información de la sesión del usuario.

**Propiedades:**
- `userId`: `string` - ID del usuario.
- `token`: `string` - Token actual.
- `expiresAt`: `Date` - Fecha de expiración.

## Validación (Validation)

Reglas y tipos para validar datos de entrada.

### ValidationError
Error de validación individual.

**Propiedades:**
- `field`: `string` - Campo que falló la validación.
- `message`: `string` - Mensaje de error.

### ValidationResult
Resultado de validación.

**Propiedades:**
- `isValid`: `boolean` - Si los datos son válidos.
- `errors`: `ValidationError[]` - Lista de errores.

### UserValidationRules
Reglas de validación para usuarios.

**Propiedades:**
- `name`: `{ minLength: 2, maxLength: 100 }` - Longitud del nombre.
- `email`: `{ pattern: RegExp }` - Patrón de email válido.
- `role`: `{ allowedValues: ['admin', 'user'] }` - Valores permitidos para rol.

### ProductValidationRules
Reglas para productos.

**Propiedades:**
- `name`: `{ minLength: 1, maxLength: 200 }` - Longitud del nombre.
- `price`: `{ min: 0 }` - Precio mínimo.
- `stock`: `{ min: 0 }` - Stock mínimo.

## Configuración (Config)

Tipos para la configuración de la aplicación.

### AppConfig
Configuración general de la aplicación.

**Propiedades:**
- `name`: `string` - Nombre de la aplicación.
- `version`: `string` - Versión actual.
- `environment`: `'development' | 'production' | 'test'` - Entorno.
- `port`: `number` - Puerto del servidor.

### DatabaseConfig
Configuración de la base de datos.

**Propiedades:**
- `host`: `string` - Host de la base de datos.
- `port`: `number` - Puerto de la base de datos.
- `database`: `string` - Nombre de la base de datos.
- `username`: `string` - Usuario.
- `password`: `string` - Contraseña.

### ApiConfig
Configuración de la API.

**Propiedades:**
- `baseUrl`: `string` - URL base de la API.
- `timeout`: `number` - Tiempo de espera en ms.
- `retries`: `number` - Número de reintentos.

## Informes (Reports)

Tipos para generar y estructurar informes.

### SalesReport
Informe de ventas.

**Propiedades:**
- `period`: `{ from: Date, to: Date }` - Período del informe.
- `totalSales`: `number` - Total de ventas.
- `totalRevenue`: `number` - Ingresos totales.
- `topProducts`: `ProductSales[]` - Productos más vendidos.
- `salesByCategory`: `CategorySales[]` - Ventas por categoría.

#### ProductSales
Ventas por producto.

**Propiedades:**
- `productId`: `string` - ID del producto.
- `productName`: `string` - Nombre del producto.
- `quantitySold`: `number` - Cantidad vendida.
- `revenue`: `number` - Ingresos generados.

#### CategorySales
Ventas por categoría.

**Propiedades:**
- `categoryId`: `string` - ID de la categoría.
- `categoryName`: `string` - Nombre de la categoría.
- `totalSales`: `number` - Número de ventas.
- `revenue`: `number` - Ingresos.

### InventoryReport
Informe de inventario.

**Propiedades:**
- `totalProducts`: `number` - Total de productos.
- `lowStockProducts`: `Product[]` - Productos con stock bajo.
- `outOfStockProducts`: `Product[]` - Productos agotados.
- `inventoryValue`: `number` - Valor total del inventario.

### PurchaseReport
Informe de compras.

**Propiedades:**
- `period`: `{ from: Date, to: Date }` - Período.
- `totalPurchases`: `number` - Total de compras.
- `totalSpent`: `number` - Gastos totales.
- `purchasesBySupplier`: `SupplierPurchases[]` - Compras por proveedor.

#### SupplierPurchases
Compras por proveedor.

**Propiedades:**
- `supplierId`: `string` - ID del proveedor.
- `supplierName`: `string` - Nombre del proveedor.
- `totalPurchases`: `number` - Número de compras.
- `totalSpent`: `number` - Gastos.

### ReportFilters
Filtros comunes para informes.

**Propiedades:**
- `dateFrom`: `Date` - Fecha desde.
- `dateTo`: `Date` - Fecha hasta.
- `categoryId?`: `string` - Filtrar por categoría.
- `supplierId?`: `string` - Filtrar por proveedor.