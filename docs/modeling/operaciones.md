# Documentación de Operaciones

Esta sección describe los tipos utilizados para operaciones de creación y actualización de entidades. Estos tipos definen los datos requeridos o permitidos para cada operación, excluyendo campos automáticos como `id`, `createdAt` y `updatedAt`.

## Operaciones de Creación (Create Operations)

Los tipos de creación incluyen solo los campos necesarios para crear una nueva instancia de la entidad.

### CreateUser
Tipo para crear un nuevo usuario.

**Propiedades:**
- `name`: `string` - Nombre completo (requerido).
- `email`: `string` - Correo electrónico único (requerido).
- `role`: `'admin' | 'user'` - Rol del usuario (requerido).

### CreateCategory
Tipo para crear una nueva categoría.

**Propiedades:**
- `name`: `string` - Nombre de la categoría (requerido).
- `description?`: `string` - Descripción opcional.

### CreateProduct
Tipo para crear un nuevo producto.

**Propiedades:**
- `name`: `string` - Nombre del producto (requerido).
- `description?`: `string` - Descripción opcional.
- `price`: `number` - Precio unitario (requerido).
- `stock`: `number` - Cantidad inicial en inventario (requerido).
- `categoryId`: `string` - ID de la categoría (requerido).
- `supplierId`: `string` - ID del proveedor (requerido).

### CreateSupplier
Tipo para crear un nuevo proveedor.

**Propiedades:**
- `name`: `string` - Nombre del proveedor (requerido).
- `contact`: `string` - Información de contacto (requerido).
- `address`: `string` - Dirección (requerido).

### CreatePaymentMethod
Tipo para crear un nuevo método de pago.

**Propiedades:**
- `name`: `string` - Nombre del método (requerido).
- `type`: `'cash' | 'card' | 'transfer'` - Tipo de método (requerido).
- `isActive?`: `boolean` - Si está activo (opcional, por defecto true).

### CreateSale
Tipo para registrar una nueva venta.

**Propiedades:**
- `userId`: `string` - ID del usuario que realiza la venta (requerido).
- `total`: `number` - Monto total (requerido).
- `paymentMethodId`: `string` - ID del método de pago (requerido).
- `items`: `CreateSaleItem[]` - Lista de ítems (requerido).

#### CreateSaleItem
Tipo para ítems en una venta.

**Propiedades:**
- `productId`: `string` - ID del producto (requerido).
- `quantity`: `number` - Cantidad (requerido).
- `unitPrice`: `number` - Precio unitario (requerido).

### CreatePurchase
Tipo para registrar una nueva compra.

**Propiedades:**
- `supplierId`: `string` - ID del proveedor (requerido).
- `total`: `number` - Monto total (requerido).
- `paymentMethodId`: `string` - ID del método de pago (requerido).
- `items`: `CreatePurchaseItem[]` - Lista de ítems (requerido).

#### CreatePurchaseItem
Tipo para ítems en una compra.

**Propiedades:**
- `productId`: `string` - ID del producto (requerido).
- `quantity`: `number` - Cantidad (requerido).
- `unitPrice`: `number` - Precio unitario (requerido).

## Operaciones de Actualización (Update Operations)

Los tipos de actualización incluyen campos opcionales que pueden ser modificados.

### UpdateUser
Tipo para actualizar un usuario existente.

**Propiedades:**
- `name?`: `string` - Nuevo nombre.
- `email?`: `string` - Nuevo correo electrónico.
- `role?`: `'admin' | 'user'` - Nuevo rol.

### UpdateCategory
Tipo para actualizar una categoría.

**Propiedades:**
- `name?`: `string` - Nuevo nombre.
- `description?`: `string` - Nueva descripción.

### UpdateProduct
Tipo para actualizar un producto.

**Propiedades:**
- `name?`: `string` - Nuevo nombre.
- `description?`: `string` - Nueva descripción.
- `price?`: `number` - Nuevo precio.
- `stock?`: `number` - Nueva cantidad en stock.
- `categoryId?`: `string` - Nuevo ID de categoría.
- `supplierId?`: `string` - Nuevo ID de proveedor.

### UpdateSupplier
Tipo para actualizar un proveedor.

**Propiedades:**
- `name?`: `string` - Nuevo nombre.
- `contact?`: `string` - Nueva información de contacto.
- `address?`: `string` - Nueva dirección.

### UpdatePaymentMethod
Tipo para actualizar un método de pago.

**Propiedades:**
- `name?`: `string` - Nuevo nombre.
- `type?`: `'cash' | 'card' | 'transfer'` - Nuevo tipo.
- `isActive?`: `boolean` - Nuevo estado activo.

### UpdateSale
Tipo para actualizar una venta (usualmente limitado).

**Propiedades:**
- `total?`: `number` - Nuevo total (si hay ajustes).
- `paymentMethodId?`: `string` - Nuevo método de pago.

### UpdatePurchase
Tipo para actualizar una compra.

**Propiedades:**
- `total?`: `number` - Nuevo total.
- `paymentMethodId?`: `string` - Nuevo método de pago.