# Documentación de Entidades

Esta sección describe las entidades principales del modelado de datos para la aplicación de **librería/tienda de libros**.

> **Nota:** Esta es una tienda especializada en libros, por lo tanto todas las entidades están diseñadas específicamente para este dominio.

## Usuario (User)

Representa a un usuario del sistema, como administradores o empleados.

**Propiedades:**
- `usuario_id`: `number` - Identificador único del usuario.
- `nombre`: `string` - Nombre completo del usuario.
- `email`: `string` - Correo electrónico único.
- `tipo_usuario`: `'cliente' | 'empleado' | 'admin' | 'proveedor'` - Rol del usuario en el sistema.

**Relaciones:**
- Puede estar asociado a ventas (Venta) como el usuario que realizó la venta.

## Categoría (Categoria)

Clasifica los libros en géneros literarios.

**Propiedades:**
- `categoria_id`: `number` - Identificador único de la categoría.
- `nombre`: `string` - Nombre de la categoría.
- `descripcion`: `string` - Descripción de la categoría.
- `genero`: `GeneroLiterario` - Género literario (ficción, no_ficción, ciencia_ficción, fantasía, romance, misterio, thriller, terror, biografía, etc.)
- `icono`: `string | null` - Icono o emoji para representar visualmente la categoría.
- `imagen_url`: `string | null` - URL de imagen representativa de la categoría.

**Relaciones:**
- Tiene muchos libros (Libro) asociados.

## Autor (Autor)

Representa a los autores de libros.

**Propiedades:**
- `autor_id`: `number` - Identificador único del autor.
- `nombre`: `string` - Nombre completo del autor.
- `biografia`: `string` - Biografía del autor.
- `nacionalidad`: `string` - País de origen del autor.
- `fecha_nacimiento`: `Date | null` - Fecha de nacimiento del autor.
- `foto_url`: `string | null` - URL de la foto del autor.

**Relaciones:**
- Ha escrito muchos libros (Libro).

## Libro (Libro)

Representa los libros disponibles para venta en la tienda.

**Propiedades:**
- `libro_id`: `number` - Identificador único del libro.
- `isbn`: `string` - Código ISBN único del libro.
- `titulo`: `string` - Título del libro.
- `subtitulo`: `string | null` - Subtítulo opcional del libro.
- `sinopsis`: `string` - Descripción/sinopsis del libro.
- `autor_id`: `number` - ID del autor del libro.
- `nombre_editorial`: `string` - Nombre de la editorial (almacenado como string simple).
- `categoria_id`: `number` - ID de la categoría/género literario.
- `año_publicacion`: `number` - Año de publicación.
- `idioma`: `string` - Idioma del libro (ej: "Español", "Inglés", "Francés").
- `num_paginas`: `number` - Número de páginas.
- `formato`: `string` - Formato del libro (ej: "Tapa dura", "Tapa blanda", "eBook", "Audiolibro").
- `precio_venta`: `number` - Precio de venta al público.
- `stock_actual`: `number` - Cantidad disponible en inventario.
- `portada_url`: `string | null` - URL de la imagen de portada del libro.
- `estado`: `EstadoLibro` - Estado del libro ('disponible' | 'agotado' | 'proximamente' | 'descatalogado').

**Relaciones:**
- Pertenece a una categoría (Categoria).
- Escrito por un autor (Autor).
- Aparece en ítems de venta (DetalleVenta) y compra (DetalleCompra).

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

### Detalle de Venta (DetalleVenta)

Sub-entidad para los libros vendidos en una venta.

**Propiedades:**
- `libro_id`: `number` - ID del libro vendido.
- `cantidad`: `number` - Cantidad de libros vendidos.
- `precio_unitario`: `number` - Precio unitario al momento de la venta.
- `subtotal`: `number` - Subtotal (cantidad * precio_unitario).

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

### Detalle de Compra (DetalleCompra)

Sub-entidad para los libros en una compra.

**Propiedades:**
- `libro_id`: `number` - ID del libro comprado.
- `cantidad`: `number` - Cantidad de libros comprados.
- `precio_unitario`: `number` - Precio unitario de compra.
- `subtotal`: `number` - Subtotal (cantidad * precio_unitario).