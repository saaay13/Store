# Sistema de Libros - Implementación Completa

> **Nota:** Esta es una aplicación de librería/tienda de libros. Todas las entidades y sistemas están diseñados específicamente para el dominio de libros.

## ✅ Implementado

### 1. Mock Data (JSON)
- ✅ `/public/data/libros.json` - Libros con ISBN, títulos, autores, editoriales, etc.
- ✅ `/public/data/autores.json` - Autores con biografía, nacionalidad, foto
- ✅ `/public/data/categorias.json` - Categorías con géneros literarios (23 géneros), icono e imagen_url

### 2. TiendaContext Global
- ✅ `src/contexts/TiendaContext.tsx`
- ✅ Gestión de estado global para libros, autores y categorías
- ✅ Fetch inicial automático desde archivos JSON
- ✅ Cache en memoria (fetch solo la primera vez)
- ✅ Estados de loading y error

### 3. Hook useTienda
Provee acceso completo a:
- ✅ `libros` - Array de todos los libros
- ✅ `autores` - Array de todos los autores
- ✅ `categorias` - Array de todas las categorías
- ✅ `isLoading` - Estado de carga
- ✅ `error` - Mensajes de error
- ✅ `isInitialized` - Si ya se cargó data

#### Métodos CRUD - Libros
- ✅ `fetchLibros()` - Carga inicial desde JSON
- ✅ `getLibroById(id)` - Obtener libro por ID
- ✅ `getLibrosByCategoria(categoriaId)` - Filtrar por categoría
- ✅ `getLibrosByAutor(autorId)` - Filtrar por autor
- ✅ `crearLibro(data)` - Crear nuevo libro
- ✅ `actualizarLibro(data)` - Actualizar libro existente
- ✅ `eliminarLibro(id)` - Eliminar libro

#### Métodos CRUD - Autores
- ✅ `fetchAutores()` - Carga autores
- ✅ `getAutorById(id)` - Obtener autor por ID
- ✅ `crearAutor(data)` - Crear nuevo autor
- ✅ `actualizarAutor(data)` - Actualizar autor
- ✅ `eliminarAutor(id)` - Eliminar autor

#### Métodos CRUD - Categorías
- ✅ `fetchCategorias()` - Carga categorías
- ✅ `getCategoriaById(id)` - Obtener categoría por ID
- ✅ `crearCategoria(data)` - Crear nueva categoría
- ✅ `actualizarCategoria(data)` - Actualizar categoría
- ✅ `eliminarCategoria(id)` - Eliminar categoría

### 4. Integración con App
- ✅ TiendaProvider agregado a App.tsx
- ✅ Envuelve toda la aplicación
- ✅ Disponible en todos los componentes

### 5. ProductsPage Actualizada
- ⚠️ Usa `useTienda()` hook (pendiente actualizar componente)
- ⚠️ Filtrado por categoría con botones
- ⚠️ Muestra spinner durante carga
- ⚠️ Manejo de errores
- ⚠️ Badges de categoría en cada libro
- ⚠️ Contador total de libros
- ⚠️ Advertencia visual para stock bajo
- ⚠️ Botón "Sin Stock" para libros agotados
- ⚠️ Integración completa con carrito

### 6. AddToCartButton Actualizado
- ⚠️ Usa tipo `Libro` con `libro_id` (pendiente actualizar componente)
- ⚠️ Prop `disabled` para libros sin stock
- ⚠️ Muestra "Sin Stock" cuando disabled=true

## 📊 Estructura de Datos

### Libro
```typescript
interface Libro {
  libro_id: number;
  isbn: string;
  titulo: string;
  subtitulo: string | null;
  sinopsis: string;
  autor_id: number;
  nombre_editorial: string;
  categoria_id: number;
  año_publicacion: number;
  idioma: string;
  num_paginas: number;
  formato: string;
  precio_venta: number;
  stock_actual: number;
  portada_url: string | null;
  estado: EstadoLibro;
  autor?: Autor;
  categoria?: Categoria;
}
```

### Autor
```typescript
interface Autor {
  autor_id: number;
  nombre: string;
  biografia: string;
  nacionalidad: string;
  fecha_nacimiento: Date | null;
  foto_url: string | null;
}
```

### Categoría
```typescript
interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion: string;
  genero: GeneroLiterario;
  icono: string | null;
  imagen_url: string | null;
}
```

## 🚀 Cómo Usar

### En cualquier componente:

```typescript
import { useTienda } from '@/contexts/TiendaContext';

const MyComponent = () => {
  const {
    libros,
    autores,
    categorias,
    isLoading,
    error,
    getLibroById,
    getLibrosByCategoria,
    getLibrosByAutor,
    crearLibro,
    actualizarLibro,
    eliminarLibro
  } = useTienda();

  // Tu lógica aquí...
};
```

### Ejemplo: Crear libro

```typescript
const handleCreate = async () => {
  const newLibro = await crearLibro({
    isbn: '978-3-16-148410-0',
    titulo: 'Nuevo Libro',
    sinopsis: 'Una historia fascinante...',
    autor_id: 1,
    nombre_editorial: 'Editorial Ejemplo',
    categoria_id: 1,
    año_publicacion: 2024,
    idioma: 'Español',
    num_paginas: 350,
    formato: 'Tapa dura',
    precio_venta: 29.99,
    stock_actual: 50,
    estado: 'disponible'
  });
  // El contexto se actualiza automáticamente
  // Todos los componentes verán el nuevo libro
};
```

## 🎯 Funcionamiento

1. **Primera carga**:
   - App monta TiendaProvider
   - Auto-fetch a `/data/libros.json`, `/data/autores.json`, `/data/categorias.json`
   - Datos se almacenan en contexto global

2. **Uso en componentes**:
   - Componentes usan `useTienda()` hook
   - Leen datos directamente del contexto (sin fetch)
   - Operaciones CRUD actualizan el contexto
   - Todos los componentes ven cambios instantáneamente

3. **Simulación realista**:
   - Delays de red simulados (500ms)
   - Generación automática de IDs
   - Validación de existencia
   - Manejo de errores

## 📝 Documentación

Ver `/docs/mock-data-system.md` para:
- Arquitectura detallada
- Ejemplos de todos los casos de uso
- Guía de migración a API real
- Patrones recomendados

## ⚠️ Pendiente de Actualización

Los siguientes componentes aún referencian la nomenclatura antigua (`Producto`, `producto_id`) y deben actualizarse:

### Componentes React:
1. `src/pages/ProductsPage.tsx` - Cambiar de `useProducts()` a `useTienda()`
2. `src/features/cart/AddToCartButton.tsx` - Usar tipo `Libro` con `libro_id`
3. `src/features/cart/Cart.tsx` - Cambiar `item.product` a `item.libro`
4. `src/features/cart/CartItem.tsx` - Cambiar `item.product` a `item.libro`
5. `src/features/checkout/CheckoutWizard.tsx` - Cambiar `item.product` a `item.libro`
6. `src/components/organisms/InventoryTable.tsx` - Usar tipo `Libro`
7. `src/components/organisms/ProductForm.tsx` - Usar tipo `Libro`
8. `src/components/organisms/SalesReport.tsx` - Usar tipo `Libro`

### Tipos:
9. `src/types/api/filters.ts` - Actualizar filtros para libros
10. `src/types/operations/create.ts` - Actualizar imports
11. `src/types/operations/update.ts` - Actualizar imports
12. `src/types/reports/index.ts` - Actualizar imports

## 🔄 Próximos Pasos Recomendados

Para completar el sistema mock data, replicar este patrón para:

1. **Ventas** (`SalesContext` + `useSales`)
2. **Compras** (`PurchasesContext` + `usePurchases`)
3. **Usuarios** (`UsersContext` + `useUsers`)
4. **Proveedores** (`SuppliersContext` + `useSuppliers`)
5. **Métodos de Pago** (`PaymentMethodsContext` + `usePaymentMethods`)

Cada uno con:
- Archivo JSON en `/public/data/`
- Context provider en `/src/contexts/`
- Hook personalizado
- Operaciones CRUD simuladas

## 🧪 Estado de Testing

- ✅ TiendaContext creado correctamente
- ✅ CartContext actualizado para usar `libro_id`
- ✅ No hay errores de compilación de TypeScript en contextos
- ⚠️ Componentes pendientes de actualización generan 26 errores
- ✅ App.tsx integrado con TiendaProvider

## 🌐 Servidor de Desarrollo

```bash
npm run dev
```

Abierto en: http://localhost:5173

La página de productos (`/products`) estará lista una vez se actualicen los componentes pendientes.

## 📌 Diferencias Clave con Sistema Anterior

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Contexto | `ProductContext` | `TiendaContext` |
| Hook | `useProducts()` | `useTienda()` |
| Entidad principal | `Producto` | `Libro` |
| ID | `producto_id` | `libro_id` |
| Campos | `nombre`, `descripcion`, `codigo_barras` | `titulo`, `sinopsis`, `isbn` |
| Entidades gestionadas | Productos, Categorías | Libros, Autores, Categorías |
| Editorial | `editorial_id` (relación) | `nombre_editorial` (string) |
| Tipos eliminados | `FormatoLibro`, `IdiomaLibro` | Ahora son strings simples |
