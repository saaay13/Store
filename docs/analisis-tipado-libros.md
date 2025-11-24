# Análisis del Sistema de Tipos - Tienda de Libros

## Estado Actual

### Estructura de Entidades

#### Nuevas Entidades Creadas
1. **Autor** (`author.ts`)
   - `autor_id`, `nombre`, `biografia`, `nacionalidad`, `fecha_nacimiento`, `foto_url`

2. **Editorial** (`publisher.ts`)
   - `editorial_id`, `nombre`, `pais`, `sitio_web`, `descripcion`

3. **Libro** (`book.ts`)
   - Campos específicos: `libro_id`, `isbn`, `titulo`, `subtitulo`, `sinopsis`
   - Referencias: `autor_id`, `editorial_id`, `categoria_id`
   - Detalles: `año_publicacion`, `idioma`, `num_paginas`, `formato`
   - Comercial: `precio_venta`, `precio_compra_referencia`, `stock_actual`, `stock_minimo`
   - Estados: `estado` (disponible | agotado | proximamente | descatalogado)
   - Media: `portada_url`

4. **Categoría** (actualizada en `category.ts`)
   - Añadido: `genero` (GeneroLiterario con 23 géneros literarios)
   - Añadido: `icono` para representación visual

### Problema Principal Identificado

**CONFLICTO DE NOMENCLATURA: `producto_id` vs `libro_id`**

El código existente usa extensivamente `producto_id` en:
- CartContext (42 usos de `product.producto_id`)
- CartItem, Cart, CheckoutWizard
- ProductContext
- InventoryTable, ProductForm, SalesReport
- ProductsPage

Pero el nuevo tipo `Libro` usa `libro_id`, lo que causa **42 errores de TypeScript**.

### Otros Conflictos de Campos

El código existente espera campos que ya no existen en `Libro`:
- `nombre` → debería ser `titulo`
- `descripcion` → debería ser `sinopsis`
- `unidad_medida` → no aplica para libros (se eliminó)
- `codigo_barras` → debería ser `isbn`

---

## Opciones de Solución

### OPCIÓN 1: Mantener Compatibilidad Total (Dual Naming)
**Filosofía:** Mantener ambos nombres de campos para transición gradual

```typescript
export interface Libro {
  // IDs - ambos nombres
  libro_id: number;
  producto_id: number; // Alias de libro_id

  // ISBN y código de barras
  isbn: string;
  codigo_barras: string; // Alias de isbn

  // Título y nombre
  titulo: string;
  nombre: string; // Alias de titulo

  // Sinopsis y descripción
  sinopsis: string;
  descripcion: string; // Alias de sinopsis

  // Resto de campos específicos de libro
  subtitulo: string | null;
  autor_id: number;
  editorial_id: number;
  categoria_id: number;
  año_publicacion: number;
  idioma: IdiomaLibro;
  num_paginas: number;
  formato: FormatoLibro;
  precio_venta: number;
  precio_compra_referencia: number;
  stock_actual: number;
  stock_minimo: number;
  portada_url: string | null;
  estado: EstadoLibro;
  // Relaciones opcionales
  autor?: Autor;
  editorial?: Editorial;
  categoria?: Categoria;
}
```

**PROS:**
- ✅ Cero cambios en código existente
- ✅ Migración gradual posible
- ✅ No rompe nada

**CONTRAS:**
- ❌ Duplicación de datos en modelo
- ❌ Confusión sobre qué campo usar
- ❌ Código legacy permanece indefinidamente
- ❌ Base de datos necesitaría ambos campos o mapeo

---

### OPCIÓN 2: Nomenclatura Específica de Libros (Clean Slate)
**Filosofía:** Adoptar nombres específicos del dominio, actualizar todo el código

```typescript
export interface Libro {
  libro_id: number;
  isbn: string;
  titulo: string;
  subtitulo: string | null;
  sinopsis: string;
  autor_id: number;
  editorial_id: number;
  categoria_id: number;
  año_publicacion: number;
  idioma: IdiomaLibro;
  num_paginas: number;
  formato: FormatoLibro;
  precio_venta: number;
  precio_compra_referencia: number;
  stock_actual: number;
  stock_minimo: number;
  portada_url: string | null;
  estado: EstadoLibro;
  autor?: Autor;
  editorial?: Editorial;
  categoria?: Categoria;
}

// NO hay alias de Producto
```

**Cambios requeridos:**
- Actualizar CartContext: `producto_id` → `libro_id`
- Actualizar CartItem, ProductsPage, CheckoutWizard
- Actualizar ProductContext → renombrar a BookContext
- Actualizar componentes: InventoryTable, ProductForm
- Renombrar archivos: `ProductContext.tsx` → `BookContext.tsx`
- Actualizar referencias `nombre` → `titulo`, `descripcion` → `sinopsis`

**PROS:**
- ✅ Código limpio y semánticamente correcto
- ✅ Nombres reflejan el dominio (libros)
- ✅ Sin confusión en el futuro
- ✅ Mejor mantenibilidad

**CONTRAS:**
- ❌ Requiere refactorizar ~10-15 archivos
- ❌ Trabajo adicional ahora
- ❌ Posible introducción de bugs en refactor

---

### OPCIÓN 3: Nomenclatura Genérica (Middle Ground)
**Filosofía:** Mantener nombres genéricos `producto_id`, pero con datos específicos de libros

```typescript
export interface Libro {
  producto_id: number; // Nombre genérico mantenido
  isbn: string;
  titulo: string;
  subtitulo: string | null;
  sinopsis: string;
  autor_id: number;
  editorial_id: number;
  categoria_id: number;
  año_publicacion: number;
  idioma: IdiomaLibro;
  num_paginas: number;
  formato: FormatoLibro;
  precio_venta: number;
  precio_compra_referencia: number;
  stock_actual: number;
  stock_minimo: number;
  portada_url: string | null;
  estado: EstadoLibro;
  autor?: Autor;
  editorial?: Editorial;
  categoria?: Categoria;
}

// Producto es un alias directo
export type Producto = Libro;
```

**Cambios requeridos:**
- Actualizar solo los campos conflictivos: `nombre` → `titulo`, `descripcion` → `sinopsis`
- Mantener `producto_id` (sin cambios en IDs)
- Actualizar 5-6 archivos donde se usa `nombre` y `descripcion`

**PROS:**
- ✅ Mínimos cambios de código
- ✅ Mantiene compatibilidad con estructura existente
- ✅ Fácil de implementar
- ✅ Permite futuras expansiones a otros productos

**CONTRAS:**
- ❌ Semánticamente menos preciso
- ❌ "producto_id" no refleja que es un libro
- ❌ Inconsistencia entre nombre de tipo (Libro) y campo (producto_id)

---

## Campos Específicos a Decidir

### 1. ISBN vs Código de Barras
**Situación:** Los libros usan ISBN (International Standard Book Number), que técnicamente ES un código de barras estandarizado.

**Opciones:**
- A) Solo `isbn: string` - Específico para libros
- B) Solo `codigo_barras: string` - Genérico, compatible con futuro
- C) Ambos: `isbn` principal, `codigo_barras` como alias

**Recomendación:** Opción A (solo ISBN) - es específico del dominio

### 2. Unidad de Medida
**Situación:** El modelo original tenía `unidad_medida` (ej: "kg", "unidad", "litro")

**Opciones:**
- A) Eliminarlo - Los libros siempre se venden por unidad
- B) Mantenerlo opcional - Para futura extensión
- C) Hardcodearlo internamente como "unidad"

**Recomendación:** Opción A (eliminar) - innecesario para libros

### 3. Título vs Nombre
**Situación:** Conflicto semántico

**Opciones:**
- A) `titulo` - Específico para libros
- B) `nombre` - Genérico para cualquier producto
- C) Ambos como alias

**Recomendación:** Depende de la opción elegida arriba

---

## Impacto en Otros Módulos

### Módulos que NO necesitan cambios:
- ✅ `auth/` - Independiente
- ✅ `payment-method/` - Independiente
- ✅ `supplier/` - Solo referencia a productos genéricamente
- ✅ `user/` - Independiente

### Módulos que necesitan actualización (según opción elegida):
- 🔄 `sale.ts`, `purchase.ts` - Ya actualizados para soportar `libro_id` y `producto_id`
- 🔄 `filters.ts` - Ya tiene `FiltroLibros` con campos específicos
- 🔄 `cart/` - Necesita actualización de campos
- 🔄 `checkout/` - Usa tipos del carrito
- 🔄 `ProductContext.tsx` - Usa Producto extensivamente
- 🔄 `ProductsPage.tsx` - Renderiza productos
- 🔄 Componentes organisms - InventoryTable, ProductForm, SalesReport

---

## Estructura de Base de Datos Implicada

```sql
-- Opción 2 (Clean Slate)
CREATE TABLE libros (
  libro_id INT PRIMARY KEY,
  isbn VARCHAR(13) UNIQUE,
  titulo VARCHAR(255),
  subtitulo VARCHAR(255),
  sinopsis TEXT,
  autor_id INT,
  editorial_id INT,
  categoria_id INT,
  ...
);

-- Opción 3 (Middle Ground)
CREATE TABLE productos (  -- nombre genérico de tabla
  producto_id INT PRIMARY KEY,
  isbn VARCHAR(13) UNIQUE,
  titulo VARCHAR(255),      -- campo específico
  subtitulo VARCHAR(255),
  sinopsis TEXT,
  autor_id INT,
  editorial_id INT,
  ...
);
```

---

## Recomendación Final

### Recomendación Personal: OPCIÓN 3 (Middle Ground)

**Justificación:**
1. **Pragmatismo:** Minimiza refactorización inmediata (~6 archivos vs ~15)
2. **Flexibilidad:** Si luego quieres vender otros productos (cuadernos, marcadores), ya tienes estructura genérica
3. **Compatibilidad:** El código de carrito, checkout, ventas sigue funcionando sin cambios mayores
4. **Claridad de tipos:** Aunque use `producto_id`, el tipo `Libro` deja claro que es un libro con ISBN, autor, etc.

**Implementación sugerida:**
```typescript
export interface Libro {
  producto_id: number;  // ID genérico
  isbn: string;         // Campo específico de libro
  titulo: string;       // En vez de "nombre"
  sinopsis: string;     // En vez de "descripcion"
  autor_id: number;     // Relación específica
  editorial_id: number; // Relación específica
  // ... resto de campos específicos
}
```

**Cambios necesarios:**
1. Actualizar referencias a `nombre` → `titulo` (5 archivos)
2. Actualizar referencias a `descripcion` → `sinopsis` (5 archivos)
3. Eliminar referencias a `unidad_medida` (3 archivos)
4. Mantener `producto_id` como está (0 cambios)

---

## Decisiones Pendientes

Para poder continuar con la implementación, necesito que apruebes:

1. **Opción de nomenclatura:** ¿Opción 1, 2 o 3?
2. **Campo ISBN:** ¿Solo ISBN o mantener codigo_barras?
3. **Unidad de medida:** ¿Eliminar o mantener opcional?
4. **Nombres de contextos:** ¿Renombrar ProductContext a BookContext o mantener genérico?
5. **Tipo exportado:** ¿Seguir exportando `Producto` como alias o solo `Libro`?

Una vez apruebes estas decisiones, procederé con la refactorización correspondiente.
