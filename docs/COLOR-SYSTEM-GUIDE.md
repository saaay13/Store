# Guía del Sistema de Colores

## Resumen

Este proyecto usa un sistema de colores de 3 capas con soporte automático para modo oscuro:

```
Paleta Base (verde + neutros)
    ↓
Variables Semánticas (primary, background, muted, etc.)
    ↓
Clases de Tailwind (bg-*, text-*, border-*)
```

## 🎨 Paleta de Colores Base

### Verde (Color Principal)
Tonalidades de verde inspiradas en libros y naturaleza:

- `green-50` - `#f0fdf4` - Muy claro
- `green-100` - `#dcfce7`
- `green-200` - `#bbf7d0`
- `green-300` - `#86efac`
- `green-400` - `#4ade80`
- `green-500` - `#22c55e` - Base
- `green-600` - `#16a34a` - **Primary (light mode)**
- `green-700` - `#15803d`
- `green-800` - `#166534`
- `green-900` - `#14532d`
- `green-950` - `#052e16` - Muy oscuro

### Neutros (Grises)
Para texto, fondos y UI:

- `neutral-50` a `neutral-950` - Escala completa de grises

## 🔧 Variables Semánticas

Estas variables **cambian automáticamente** entre modo claro y oscuro:

### Colores de Marca
- `primary` - Color principal de la marca
- `primary-foreground` - Texto sobre primary

### Fondos y Textos
- `background` - Fondo principal de la página
- `foreground` - Texto principal

### Secundarios
- `muted` - Fondos secundarios (cards, secciones)
- `muted-foreground` - Texto desactivado o secundario

### Acentos
- `accent` - Para hover states y highlights
- `accent-foreground` - Texto sobre accent

### UI Elements
- `border` - Bordes y separadores
- `input` - Bordes de inputs
- `ring` - Anillo de foco (focus rings)
- `card` / `card-foreground` - Cards
- `popover` / `popover-foreground` - Modales y popovers

### Estados
- `success` / `success-foreground` - Verde (éxito)
- `error` / `error-foreground` - Rojo (error/destructivo)
- `warning` / `warning-foreground` - Amarillo (advertencia)
- `info` / `info-foreground` - Azul (información)

## 💡 Cómo Usar

### 1. Usar Variables Semánticas (RECOMENDADO)

Las variables semánticas se adaptan automáticamente al tema:

```tsx
// ✅ CORRECTO - Se adapta a dark mode automáticamente
<div className="bg-background text-foreground">
  <h1 className="text-primary">Título</h1>
  <p className="text-muted-foreground">Texto secundario</p>
  <button className="bg-primary text-primary-foreground">
    Botón
  </button>
</div>
```

### 2. Usar Paleta de Verdes Directamente

Para casos donde necesitas un verde específico:

```tsx
// ✅ Para elementos decorativos o casos especiales
<div className="bg-green-50 border-green-200">
  <span className="text-green-700">Oferta especial</span>
</div>
```

### 3. Usar Colores de Estado

Para feedback al usuario:

```tsx
// ✅ Mensajes de estado
<div className="bg-success text-success-foreground">
  ✓ Guardado exitosamente
</div>

<div className="bg-error text-error-foreground">
  ✗ Error al guardar
</div>

<div className="bg-warning text-warning-foreground">
  ⚠ Advertencia importante
</div>
```

## 📋 Patrones Comunes

### Botón Principal
```tsx
<button className="bg-primary text-primary-foreground hover:bg-green-700">
  Acción Principal
</button>
```

### Botón Secundario
```tsx
<button className="bg-muted text-foreground hover:bg-accent">
  Acción Secundaria
</button>
```

### Card
```tsx
<div className="bg-card text-card-foreground border border-border rounded-lg">
  <h3 className="text-foreground">Título</h3>
  <p className="text-muted-foreground">Descripción</p>
</div>
```

### Input
```tsx
<input className="bg-background border-input text-foreground focus:ring-ring" />
```

### Badge
```tsx
<span className="bg-accent text-accent-foreground">Nuevo</span>
```

## 🌓 Modo Oscuro

El modo oscuro se activa automáticamente basado en la preferencia del sistema operativo:

```css
/* Light mode (default) */
background: white
foreground: neutral-900
primary: green-600

/* Dark mode (automático) */
background: neutral-950
foreground: neutral-50
primary: green-500
```

### Probar Modo Oscuro

**Chrome DevTools:**
1. F12 → Cmd/Ctrl+Shift+P
2. Buscar "Render"
3. En "Emulate CSS media feature prefers-color-scheme" → Seleccionar "dark"

**macOS:**
System Preferences → General → Appearance → Dark

**Windows:**
Settings → Personalization → Colors → Choose your mode → Dark

## ❌ Anti-Patrones (Evitar)

```tsx
// ❌ NO usar colores hardcodeados
<div className="bg-white text-black">

// ❌ NO usar hex colors inline
<div style={{ backgroundColor: '#16a34a' }}>

// ❌ NO mezclar tonalidades aleatorias
<div className="bg-green-200 text-green-800">
```

## ✅ Mejores Prácticas

1. **Preferir variables semánticas** sobre colores específicos
2. **Usar `primary`** para elementos de marca y acciones principales
3. **Usar `muted`** para fondos secundarios
4. **Usar `foreground`/`muted-foreground`** para texto
5. **Usar colores de estado** (`success`, `error`, `warning`) para feedback
6. **Probar siempre en dark mode** antes de commit

## 🎯 Decisiones de Diseño

### ¿Cuándo usar cada variable?

| Variable | Uso |
|----------|-----|
| `primary` | Botones principales, links, elementos de marca |
| `background` | Fondo de la página |
| `foreground` | Texto principal |
| `muted` | Fondos secundarios (sidebars, headers) |
| `muted-foreground` | Texto secundario, placeholders |
| `accent` | Hover states, elementos destacados |
| `border` | Bordes, divisores |
| `card` | Cards, paneles |
| `success/error/warning` | Mensajes de feedback |

### ¿Cuándo usar verde directo?

Solo cuando necesitas una tonalidad específica que no cambiará con el tema:
- Ilustraciones decorativas
- Gradientes específicos
- Elementos de branding fijos

## 📚 Ejemplos Completos

### Header con Dark Mode
```tsx
<header className="bg-background border-b border-border">
  <div className="flex justify-between items-center">
    <Logo className="text-primary" />
    <nav className="space-x-4">
      <a className="text-muted-foreground hover:text-foreground">
        Productos
      </a>
      <button className="bg-primary text-primary-foreground">
        Iniciar Sesión
      </button>
    </nav>
  </div>
</header>
```

### Formulario
```tsx
<form className="space-y-4">
  <div>
    <label className="text-foreground font-medium">
      Email
    </label>
    <input
      type="email"
      className="bg-background border-input text-foreground
                 focus:ring-2 focus:ring-ring"
    />
  </div>

  <button className="bg-primary text-primary-foreground">
    Enviar
  </button>
</form>
```

### Toast de Éxito
```tsx
<div className="bg-success text-success-foreground rounded-lg p-4">
  <CheckCircle className="inline mr-2" />
  Categoría creada exitosamente
</div>
```

## 🔍 Debugging

Si los colores no se ven bien:

1. **Verificar que el CSS se importa correctamente**
   ```tsx
   // En src/main.tsx o src/index.tsx
   import './index.css';
   ```

2. **Inspeccionar variables CSS**
   ```
   DevTools → Elements → :root → Computed → Filter "color"
   ```

3. **Verificar que @theme está funcionando**
   ```
   DevTools → Elements → Buscar clases bg-primary, text-foreground, etc.
   ```

---

## 📚 Documentación Relacionada

Este sistema de colores se integra con otras partes del proyecto:

### Guías de Implementación
- **[UI Service](./UI-SERVICE-IMPLEMENTATION-GUIDE.md)** - Los toasts y modales usan variables semánticas (`bg-success`, `bg-error`, etc.)
- **[Home Page Styles](./HOME-PAGE-STYLES-GUIDE.md)** - Implementación visual de la página principal usando este sistema

### Documentación Principal
- **[CLAUDE.md](../CLAUDE.md)** - Guía principal del proyecto con sección actualizada sobre colores
- **[README.md](./README.md)** - Índice general de toda la documentación

### Demo Interactiva
- Visitar `/colors` en el navegador para ver todos los colores en acción
- Cambiar el tema del sistema operativo para probar dark mode automático

---

**Última actualización:** Noviembre 2025
