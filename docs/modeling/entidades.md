# Documentación de Entidades

Esta sección describe las entidades principales del modelado de datos para la aplicación de tienda.

## Usuario (User)

Representa a un usuario del sistema, como administradores o empleados.

**Propiedades:**
- `id`: `string` - Identificador único del usuario.
- `name`: `string` - Nombre completo del usuario.
- `email`: `string` - Correo electrónico único.
- `role`: `'admin' | 'user'` - Rol del usuario en el sistema.
- `createdAt`: `Date` - Fecha de creación del registro.
- `updatedAt`: `Date` - Fecha de última actualización.

**Relaciones:**
- Puede estar asociado a ventas (Sale) como el usuario que realizó la venta.

## Categoría (Category)

Clasifica los productos en grupos lógicos.

**Propiedades:**
- `id`: `string` - Identificador único de la categoría.
- `name`: `string` - Nombre de la categoría.
- `description`: `string` - Descripción opcional de la categoría.
- `createdAt`: `Date` - Fecha de creación.
- `updatedAt`: `Date` - Fecha de actualización.

**Relaciones:**
- Tiene muchos productos (Product) asociados.

## Producto (Product)

Representa los artículos disponibles para venta.

**Propiedades:**
- `id`: `string` - Identificador único del producto.
- `name`: `string` - Nombre del producto.
- `description`: `string` - Descripción detallada.
- `price`: `number` - Precio unitario.
- `stock`: `number` - Cantidad en inventario.
- `categoryId`: `string` - ID de la categoría a la que pertenece.
- `supplierId`: `string` - ID del proveedor.
- `createdAt`: `Date` - Fecha de creación.
- `updatedAt`: `Date` - Fecha de actualización.

**Relaciones:**
- Pertenece a una categoría (Category).
- Proviene de un proveedor (Supplier).
- Aparece en ítems de venta (SaleItem) y compra (PurchaseItem).

## Proveedor (Supplier)

Entidad que representa a los proveedores de productos.

**Propiedades:**
- `id`: `string` - Identificador único del proveedor.
- `name`: `string` - Nombre del proveedor.
- `contact`: `string` - Información de contacto (teléfono, email).
- `address`: `string` - Dirección del proveedor.
- `createdAt`: `Date` - Fecha de creación.
- `updatedAt`: `Date` - Fecha de actualización.

**Relaciones:**
- Suministra productos (Product).
- Asociado a compras (Purchase).

## Método de Pago (PaymentMethod)

Define los métodos disponibles para procesar pagos.

**Propiedades:**
- `id`: `string` - Identificador único del método de pago.
- `name`: `string` - Nombre del método (ej. Efectivo, Tarjeta, Transferencia).
- `type`: `'cash' | 'card' | 'transfer'` - Tipo de método.
- `isActive`: `boolean` - Si está activo para uso.

**Relaciones:**
- Usado en ventas (Sale) y compras (Purchase).

## Venta (Sale)

Registra las transacciones de venta al cliente.

**Propiedades:**
- `id`: `string` - Identificador único de la venta.
- `date`: `Date` - Fecha y hora de la venta.
- `userId`: `string` - ID del usuario que realizó la venta.
- `total`: `number` - Monto total de la venta.
- `paymentMethodId`: `string` - ID del método de pago usado.
- `items`: `SaleItem[]` - Lista de ítems vendidos.
- `createdAt`: `Date` - Fecha de creación.
- `updatedAt`: `Date` - Fecha de actualización.

**Relaciones:**
- Realizada por un usuario (User).
- Usa un método de pago (PaymentMethod).
- Contiene ítems de venta (SaleItem).

### Ítem de Venta (SaleItem)

Sub-entidad para los productos en una venta.

**Propiedades:**
- `productId`: `string` - ID del producto vendido.
- `quantity`: `number` - Cantidad vendida.
- `unitPrice`: `number` - Precio unitario al momento de la venta.
- `subtotal`: `number` - Subtotal (quantity * unitPrice).

## Compra (Purchase)

Registra las adquisiciones de productos a proveedores.

**Propiedades:**
- `id`: `string` - Identificador único de la compra.
- `date`: `Date` - Fecha y hora de la compra.
- `supplierId`: `string` - ID del proveedor.
- `total`: `number` - Monto total de la compra.
- `paymentMethodId`: `string` - ID del método de pago usado.
- `items`: `PurchaseItem[]` - Lista de ítems comprados.
- `createdAt`: `Date` - Fecha de creación.
- `updatedAt`: `Date` - Fecha de actualización.

**Relaciones:**
- Realizada a un proveedor (Supplier).
- Usa un método de pago (PaymentMethod).
- Contiene ítems de compra (PurchaseItem).

### Ítem de Compra (PurchaseItem)

Sub-entidad para los productos en una compra.

**Propiedades:**
- `productId`: `string` - ID del producto comprado.
- `quantity`: `number` - Cantidad comprada.
- `unitPrice`: `number` - Precio unitario de compra.
- `subtotal`: `number` - Subtotal (quantity * unitPrice).