# Guía de Estilos e Implementación Visual - Página Home

## Índice
1. [Sistema de Estilos CSS](#sistema-de-estilos-css)
2. [Componentes Atómicos](#componentes-atómicos)
3. [Estructura de la Página Home](#estructura-de-la-página-home)
4. [Secciones Destacadas](#secciones-destacadas)
5. [Cards y Elementos Visuales](#cards-y-elementos-visuales)
6. [Recursos de Imágenes](#recursos-de-imágenes)

---

## Sistema de Estilos CSS

### Sistema de Colores

**⚠️ IMPORTANTE:** Este proyecto usa un sistema de colores avanzado con soporte para modo oscuro.

**📖 Documentación completa:** Ver **[COLOR-SYSTEM-GUIDE.md](./COLOR-SYSTEM-GUIDE.md)**

**🎨 Demo visual:** Visitar `/colors` en el navegador

#### Resumen Rápido

El proyecto usa **Tailwind CSS v4** con un sistema de 3 capas:

```
Paleta Base (verde + neutros) → Variables Semánticas → Clases de Tailwind
```

**Clases principales para la Home:**

```tsx
// Fondos y textos
className="bg-background text-foreground"
className="bg-muted text-muted-foreground"

// Colores de marca
className="bg-primary text-primary-foreground"

// Hover states
className="hover:bg-accent hover:text-accent-foreground"

// Bordes
className="border border-border"

// Estados
className="bg-success text-success-foreground"
className="bg-error text-error-foreground"
```

**🔗 Referencias:**
- Sistema completo: [COLOR-SYSTEM-GUIDE.md](./COLOR-SYSTEM-GUIDE.md)
- Paleta de verdes: `green-50` a `green-950`
- Paleta de neutros: `neutral-50` a `neutral-950`
- Variables semánticas: `primary`, `background`, `foreground`, `muted`, `accent`, `border`, etc.

### Variables de Diseño

El proyecto utiliza variables CSS adicionales para espaciado, bordes y tipografía definidas en `src/index.css`.

#### Espaciado
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 0.75rem;   /* 12px */
--spacing-lg: 1rem;      /* 16px */
--spacing-xl: 1.25rem;   /* 20px */
--spacing-2xl: 1.5rem;   /* 24px */
--spacing-3xl: 2rem;     /* 32px */
```

#### Bordes Redondeados
```css
--radius-sm: 0.125rem;  /* 2px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-full: 9999px;  /* Completamente redondo */
```

#### Sombras
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

#### Tipografía
```css
/* Tamaños de fuente */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */

/* Pesos de fuente */
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

## Componentes Atómicos

### Button (`src/components/atoms/Button.tsx`)

#### Props Interface
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
}
```

#### Variantes de Estilo
```typescript
primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500'
secondary: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500'
success: 'bg-success text-white hover:bg-green-600 focus:ring-success'
warning: 'bg-warning text-white hover:bg-yellow-600 focus:ring-warning'
error: 'bg-error text-white hover:bg-red-600 focus:ring-error'
danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
```

#### Tamaños
```typescript
xs: 'px-2.5 py-1.5 text-xs rounded-sm'
sm: 'px-3 py-2 text-sm rounded-md'
md: 'px-4 py-2 text-base rounded-md'
lg: 'px-4 py-2 text-lg rounded-lg'
xl: 'px-6 py-3 text-xl rounded-lg'
```

#### Clases Base
```typescript
baseClasses = 'inline-flex items-center justify-center font-medium transition-colors
               focus:outline-none focus:ring-2 focus:ring-offset-2
               disabled:opacity-50 disabled:cursor-not-allowed'
```

#### Ejemplo de Uso
```tsx
<Button variant="primary" size="lg" onClick={() => navigate('/products')}>
  TIENDA
</Button>

<Button variant="secondary" size="md" onClick={() => navigate('/login')}>
  Iniciar Sesión
</Button>
```

### Input (`src/components/atoms/Input.tsx`)

#### Props Interface
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
}
```

#### Clases de Estilo
```typescript
baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none
               focus:ring-2 focus:ring-offset-2 transition-colors'

default: 'border-gray-300 focus:border-primary focus:ring-primary-500'
error: 'border-error focus:border-error focus:ring-error'
```

#### Ejemplo de Uso
```tsx
<Input
  placeholder="Buscar por título, autor o ISBN"
  className="flex-1"
/>
```

### Icon (`src/components/atoms/Icon.tsx`)

#### Props Interface
```typescript
interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}
```

#### Tamaños
```typescript
xs: 'w-3 h-3'
sm: 'w-4 h-4'
md: 'w-5 h-5'
lg: 'w-6 h-6'
xl: 'w-8 h-8'
```

#### Iconos Disponibles
```typescript
home: '🏠', user: '👤', settings: '⚙️', search: '🔍',
plus: '➕', minus: '➖', edit: '✏️', delete: '🗑️',
check: '✓', close: '✕', menu: '☰', loading: '⏳',
success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️'
```

#### Ejemplo de Uso
```tsx
<Icon name="search" size="sm" className="mr-2" />
```

---

## Estructura de la Página Home

### Layout Principal
```tsx
<div className="min-h-screen bg-white">
  {/* 1. Header */}
  {/* 2. Hero Section */}
  {/* 3. Search Section */}
  {/* 4. Categories Section */}
  {/* 5. Featured Products Section */}
  {/* 6. Services Section */}
  {/* 7. Visit Us Section */}
  {/* 8. Footer Info */}
</div>
```

---

## Secciones Destacadas

### 1. Header (Navegación Superior)

**Ubicación:** `src/pages/Home.tsx:46-66`

```tsx
<header className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">L</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Libros</span>
      </div>

      {/* Botones de autenticación */}
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
        <Button onClick={() => navigate('/register')}>
          Registrarse
        </Button>
      </div>
    </div>
  </div>
</header>
```

**Características:**
- Fondo blanco con sombra sutil y borde inferior
- Logo cuadrado con inicial "L" en fondo verde (bg-primary)
- Contenedor con max-width responsivo (max-w-7xl)
- Altura fija de 16 (h-16 = 64px)
- Padding responsivo (px-4 sm:px-6 lg:px-8)

### 2. Hero Section (Sección Principal)

**Ubicación:** `src/pages/Home.tsx:69-81`

```tsx
<section className="bg-primary-50 py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto text-center">
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
      Compra desde cualquier parte de Bolivia
    </h1>
    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
      Recibe tus libros favoritos en la puerta de tu casa
    </p>
    <Button size="lg" onClick={() => navigate('/products')}>
      TIENDA
    </Button>
  </div>
</section>
```

**Características:**
- Fondo verde muy claro (bg-primary-50)
- Padding vertical generoso (py-20 = 80px)
- Tipografía responsiva para título (4xl/5xl/6xl)
- Subtítulo con max-width limitado (max-w-3xl)
- CTA grande centrado

### 3. Search Section (Barra de Búsqueda)

**Ubicación:** `src/pages/Home.tsx:84-97`

```tsx
<section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-4xl mx-auto">
    <div className="flex gap-4">
      <Input
        placeholder="Buscar por título, autor o ISBN"
        className="flex-1"
      />
      <Button>
        <Icon name="search" size="sm" className="mr-2" />
        Buscar
      </Button>
    </div>
  </div>
</section>
```

**Características:**
- Centrado con max-w-4xl
- Layout flexbox con gap de 4 unidades
- Input con flex-1 para ocupar espacio disponible
- Botón con icono de búsqueda

### 4. Categories Section (Grid de Categorías)

**Ubicación:** `src/pages/Home.tsx:100-115`

```tsx
<section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <div
          key={index}
          className="relative group cursor-pointer h-96 overflow-hidden"
          onClick={() => navigate(category.link)}
        >
          <img
            src={`/img/${category.image}`}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/70 flex flex-col justify-end items-center p-6">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-primary font-semibold"
            >
              {category.name}
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Características:**
- Fondo gris claro (bg-gray-50)
- Grid responsivo: 1 columna (móvil), 2 (tablet), 3 (desktop)
- Cada card tiene altura fija de 96 (h-96 = 384px)
- Overlay verde con opacidad 70% (bg-primary/70)
- Botón blanco semitransparente en la parte inferior
- Efecto hover en grupo (group)

**Categorías Definidas:**
```typescript
const categories = [
  { name: 'CLÁSICOS', link: '/products?category=clasicos', image: 'libros.png' },
  { name: 'INFANTILES', link: '/products?category=infantiles', image: 'cuentos.png' },
  { name: 'JUVENILES', link: '/products?category=juveniles', image: 'vampiros.png' },
  { name: 'POESÍA', link: '/products?category=poesia', image: 'libros.png' },
  { name: 'INGLÉS', link: '/products?category=ingles', image: 'cuentos.png' },
  { name: 'NACIONALES', link: '/products?category=nacionales', image: 'vampiros.png' },
  { name: 'VARIOS', link: '/products?category=varios', image: 'libros.png' },
  { name: 'DESCUENTOS', link: '/products?category=descuentos', image: 'cuentos.png' },
  { name: 'ACCESORIOS LITERARIOS', link: '/products?category=accesorios', image: 'vampiros.png' }
];
```

### 5. Featured Products Section (Productos Destacados)

**Ubicación:** `src/pages/Home.tsx:118-154`

```tsx
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Nuestras novedades
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="relative group cursor-pointer">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
              <span className="text-white text-center px-4">
                <h3 className="text-lg font-semibold mb-2">
                  Título del Libro {item}
                </h3>
                <p className="text-sm mb-4">
                  Autor del libro
                </p>
                <p className="text-xl font-bold">
                  Bs. {(item * 25).toFixed(2)}
                </p>
              </span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button size="sm" className="w-full">
              Agregar al carrito
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**Características:**
- Fondo blanco
- Grid responsivo: 1 columna (móvil), 2 (tablet), 4 (desktop)
- Cards con aspect-ratio cuadrado (aspect-square)
- Overlay verde con información del producto
- Botón de compra ancho completo debajo de cada card
- Gap grande entre elementos (gap-8)

### 6. Services Section (Servicios)

**Ubicación:** `src/pages/Home.tsx:157-175`

```tsx
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-50">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <div key={index} className="text-center">
          <div className="text-6xl mb-4">{service.icon}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {service.title}
          </h3>
          {service.description && (
            <p className="text-gray-600">
              {service.description}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
```

**Servicios Definidos:**
```typescript
const services = [
  { icon: '📚', title: 'VENTA DE LIBROS ORIGINALES', description: '' },
  { icon: '🇧🇴', title: 'ENVÍOS A TODO EL PAÍS', description: '' },
  { icon: '🚚', title: 'ENTREGAS A DOMICILIO', description: '' },
  { icon: '📦', title: 'IMPORTACIÓN DE LIBROS A PEDIDO', description: '' }
];
```

**Características:**
- Fondo verde claro (bg-primary-50)
- Grid responsivo: 1 columna (móvil), 2 (tablet), 4 (desktop)
- Iconos emoji grandes (text-6xl)
- Texto centrado
- Títulos en negrita

### 7. Visit Us Section (Llamado a la Acción)

**Ubicación:** `src/pages/Home.tsx:178-190`

```tsx
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-gray-900 mb-8">
      Visítanos
    </h2>
    <p className="text-lg text-gray-600 mb-8">
      Contamos con los mejores libros originales de literatura universal,
      latinoamericana, juvenil, infantil y nacional.
    </p>
    <Button size="lg" variant="secondary" onClick={() => navigate('/ubicacion')}>
      UBICACIÓN
    </Button>
  </div>
</section>
```

**Características:**
- Fondo blanco
- Contenido centrado con max-w-4xl
- Tipografía grande para título y descripción
- Botón secundario grande

### 8. Footer Info (Pie de Página)

**Ubicación:** `src/pages/Home.tsx:193-201`

```tsx
<section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
  <div className="max-w-4xl mx-auto text-center">
    <h3 className="text-xl font-semibold mb-4">VISÍTANOS</h3>
    <p className="mb-2">Calle Colombia entre Aurelio Meleán y Julio Arauco #1069</p>
    <p className="mb-2">Cochabamba - Bolivia</p>
    <p className="mb-2">Lunes a viernes de 10:00 a 13:00 - 15:00 a 19:00,</p>
    <p>Sábado de 10:00 a 13:00</p>
  </div>
</section>
```

**Características:**
- Fondo negro (bg-gray-900)
- Texto blanco (text-white)
- Información de contacto centrada
- Padding vertical moderado (py-12)

---

## Cards y Elementos Visuales

### Card de Categoría (Category Card)

**Patrón de Diseño:**
```tsx
<div className="relative group cursor-pointer h-96 overflow-hidden">
  {/* Imagen de fondo */}
  <img
    src={`/img/${image}`}
    alt={name}
    className="w-full h-full object-cover"
  />

  {/* Overlay con gradiente */}
  <div className="absolute inset-0 bg-primary/70 flex flex-col justify-end items-center p-6">
    {/* Botón de categoría */}
    <Button
      size="lg"
      variant="secondary"
      className="bg-white/90 hover:bg-white text-primary font-semibold"
    >
      {name}
    </Button>
  </div>
</div>
```

**Técnicas Aplicadas:**
- `relative` + `absolute` para posicionamiento de overlay
- `group` para efectos hover coordinados
- `bg-primary/70` para overlay verde con 70% opacidad
- `object-cover` para mantener aspecto de imagen
- `overflow-hidden` para contener elementos
- Botón blanco semitransparente (bg-white/90)

### Card de Producto (Product Card)

**Patrón de Diseño:**
```tsx
<div className="relative group cursor-pointer">
  {/* Contenedor cuadrado */}
  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
    {/* Overlay con información */}
    <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
      <span className="text-white text-center px-4">
        <h3 className="text-lg font-semibold mb-2">Título del Libro</h3>
        <p className="text-sm mb-4">Autor del libro</p>
        <p className="text-xl font-bold">Bs. 25.00</p>
      </span>
    </div>
  </div>

  {/* Botón de acción */}
  <div className="mt-4 text-center">
    <Button size="sm" className="w-full">
      Agregar al carrito
    </Button>
  </div>
</div>
```

**Técnicas Aplicadas:**
- `aspect-square` para mantener proporción 1:1
- `rounded-lg` para esquinas redondeadas
- Overlay centrado con flexbox
- Botón ancho completo (w-full)
- Separación con margen superior (mt-4)

### Card de Servicio (Service Card)

**Patrón de Diseño:**
```tsx
<div className="text-center">
  <div className="text-6xl mb-4">{icon}</div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    {title}
  </h3>
  {description && (
    <p className="text-gray-600">{description}</p>
  )}
</div>
```

**Técnicas Aplicadas:**
- Diseño minimalista centrado
- Icono emoji grande (text-6xl = 60px)
- Jerarquía tipográfica clara
- Renderizado condicional de descripción

---

## Recursos de Imágenes

### Ubicación
Todas las imágenes están en: `public/img/`

### Imágenes Disponibles
```
cuentos.png      # Usado para: INFANTILES, INGLÉS, DESCUENTOS
libros.png       # Usado para: CLÁSICOS, POESÍA, VARIOS
libros2.png      # Disponible (no usado en Home actual)
libros3.png      # Disponible (no usado en Home actual)
vampiros.png     # Usado para: JUVENILES, NACIONALES, ACCESORIOS
```

**Nota:** La imagen `vampiros.png` no existe en el directorio actual. Se debe crear o reemplazar con una de las imágenes disponibles.

### Implementación en Código
```tsx
<img
  src={`/img/${category.image}`}
  alt={category.name}
  className="w-full h-full object-cover"
/>
```

### Recomendaciones de Uso
- **Formato:** PNG preferido para calidad
- **Dimensiones sugeridas:** Mínimo 800x800px para cards de categorías
- **Optimización:** Comprimir imágenes para web (60-80% calidad)
- **Nombrado:** Descriptivo y en minúsculas (libros.png, cuentos.png)

---

## Patrones de Diseño Responsivo

### Breakpoints Tailwind
```
sm: 640px   (tablet pequeño)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (desktop grande)
```

### Contenedores Responsivos
```tsx
{/* Max-width con padding responsivo */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Contenido */}
</div>

{/* Contenedor más estrecho para contenido de lectura */}
<div className="max-w-4xl mx-auto">
  {/* Contenido */}
</div>
```

### Tipografía Responsiva
```tsx
{/* Título que escala en diferentes pantallas */}
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
  Título Principal
</h1>
```

### Grids Responsivos
```tsx
{/* 1 columna móvil, 2 tablet, 3 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>

{/* 1 columna móvil, 2 tablet, 4 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Items */}
</div>
```

---

## Paleta de Colores Aplicada

### Fondos de Secciones
- **Blanco:** `bg-white` - Secciones limpias y profesionales
- **Verde claro:** `bg-primary-50` - Hero, servicios (destaca sin saturar)
- **Gris claro:** `bg-gray-50` - Categorías (contraste sutil)
- **Negro:** `bg-gray-900` - Footer (autoridad y cierre)

### Overlays
- **Verde 70%:** `bg-primary/70` - Sobre imágenes de categorías y productos
- **Blanco semitransparente:** `bg-white/90` - Botones sobre overlays

### Textos
- **Títulos principales:** `text-gray-900` - Negro intenso
- **Subtítulos:** `text-gray-600` - Gris medio
- **Botones primarios:** `text-white` - Blanco sobre verde
- **Botones sobre overlay:** `text-primary` - Verde sobre blanco

---

## Animaciones y Transiciones

### Transiciones de Botones
```tsx
className="transition-colors"  // Cambio suave de colores en hover
```

### Estados Hover
```tsx
hover:bg-primary-600   // Botón primario se oscurece
hover:bg-white         // Botón semitransparente se vuelve sólido
```

### Estados Focus
```tsx
focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
```

### Grupos con Efectos
```tsx
<div className="group cursor-pointer">
  {/* Los elementos hijos pueden usar group-hover: */}
  <img className="group-hover:scale-105 transition-transform" />
</div>
```

---

## Mejores Prácticas de Implementación

### 1. Consistencia de Espaciado
- Usar múltiplos de 4 (px-4, py-8, gap-6)
- Secciones grandes: py-16 o py-20
- Secciones pequeñas: py-12

### 2. Jerarquía Visual
- Títulos: text-3xl o text-4xl + font-bold
- Subtítulos: text-xl + text-gray-600
- Cuerpo: text-base + text-gray-600

### 3. Accesibilidad
- Usar atributos `alt` en imágenes
- Mantener contraste suficiente (verde oscuro sobre blanco)
- Botones con estados focus visibles

### 4. Mobile-First
- Diseñar primero para móvil
- Agregar breakpoints para pantallas más grandes
- Probar en diferentes dispositivos

### 5. Performance
- Optimizar imágenes antes de subirlas
- Usar `object-cover` para mantener aspecto
- Limitar número de cards visibles inicialmente

---

## Resumen de Implementación

Para replicar esta página en otro proyecto:

1. **Copiar variables CSS** de `src/index.css` (líneas 4-104)
2. **Implementar componentes atómicos:** Button, Input, Icon
3. **Crear estructura de secciones** siguiendo el orden del layout
4. **Aplicar grid responsivo** para categorías (3 columnas) y productos (4 columnas)
5. **Configurar overlays** con bg-primary/70 sobre imágenes
6. **Agregar imágenes** en `/public/img/` con los nombres correctos
7. **Definir arrays de datos** para categorías y servicios
8. **Implementar navegación** con React Router
9. **Ajustar colores** según la paleta verde definida
10. **Probar responsividad** en móvil, tablet y desktop

---

## Referencias de Código

- **Página completa:** `src/pages/Home.tsx`
- **Estilos globales:** `src/index.css`
- **Button:** `src/components/atoms/Button.tsx`
- **Input:** `src/components/atoms/Input.tsx`
- **Icon:** `src/components/atoms/Icon.tsx`
- **Imágenes:** `public/img/`

---

**Última actualización:** 2025-01-24
**Versión:** 1.0
**Proyecto:** Store - Sistema de Librería
