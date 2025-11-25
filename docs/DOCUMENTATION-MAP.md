# Mapa de Documentación del Proyecto

Este documento muestra cómo se relacionan todos los archivos de documentación del proyecto.

## 🗺️ Estructura Visual

```
📁 Store (Proyecto de Librería)
│
├── 📄 CLAUDE.md (raíz)
│   └── Guía principal para Claude Code
│       ├─→ Referencia: Design System (COLOR-SYSTEM-GUIDE.md)
│       ├─→ Referencia: UI Service (UI-SERVICE-IMPLEMENTATION-GUIDE.md)
│       └─→ Referencia: Modelado de datos (modeling/)
│
└── 📁 docs/
    │
    ├── 📄 README.md
    │   └── Índice general (este es el punto de entrada)
    │
    ├── 🎨 DESIGN SYSTEM & UI
    │   │
    │   ├── 📄 COLOR-SYSTEM-GUIDE.md ⭐
    │   │   ├── Paleta de colores base
    │   │   ├── Variables semánticas
    │   │   ├── Soporte para dark mode
    │   │   └─→ Referencias:
    │   │       ├── UI-SERVICE-IMPLEMENTATION-GUIDE.md
    │   │       ├── HOME-PAGE-STYLES-GUIDE.md
    │   │       ├── MAPS-GUIDE.md
    │   │       └── CLAUDE.md
    │   │
    │   ├── 📄 UI-SERVICE-IMPLEMENTATION-GUIDE.md
    │   │   ├── Sistema de Toasts
    │   │   ├── Modales de confirmación
    │   │   └─→ Usa: COLOR-SYSTEM-GUIDE.md
    │   │
    │   ├── 📄 HOME-PAGE-STYLES-GUIDE.md
    │   │   ├── Estructura de la Home
    │   │   ├── Componentes visuales
    │   │   └─→ Usa: COLOR-SYSTEM-GUIDE.md
    │   │
    │   └── 📄 MAPS-GUIDE.md
    │       ├── Integración de Leaflet
    │       ├── Componentes Map y StoreLocationsMap
    │       ├── Tipo StoreLocation
    │       └─→ Usa: COLOR-SYSTEM-GUIDE.md
    │
    ├── 📊 MODELADO DE DATOS
    │   │
    │   └── 📁 modeling/
    │       ├── 📄 entidades.md
    │       │   └── Usuario, Libro, Autor, Categoría, etc.
    │       │
    │       ├── 📄 operaciones.md
    │       │   └── CRUD operations, tipos de creación/actualización
    │       │
    │       ├── 📄 api.md
    │       │   └── Interfaces de API, filtros, paginación
    │       │
    │       └── 📄 otros.md
    │           └── Auth, validación, configuración
    │
    └── 🔧 SISTEMAS TÉCNICOS
        │
        ├── 📄 mock-data-system.md
        │   └── Sistema de datos simulados
        │
        ├── 📄 productos-sistema-completo.md
        │   └── Gestión de productos (libros)
        │
        └── 📄 analisis-tipado-libros.md
            └── Análisis del sistema de tipos
```

---

## 🔗 Flujos de Lectura Recomendados

### Para Nuevos Desarrolladores

**Ruta completa de onboarding:**

```
1. CLAUDE.md (raíz)
   ↓
2. docs/README.md
   ↓
3. docs/COLOR-SYSTEM-GUIDE.md
   ↓
4. docs/UI-SERVICE-IMPLEMENTATION-GUIDE.md
   ↓
5. docs/modeling/entidades.md
   ↓
6. Empezar a desarrollar
```

### Para Trabajar con UI

**Desarrollo de interfaces:**

```
1. docs/COLOR-SYSTEM-GUIDE.md
   ├─→ Leer paletas y variables semánticas
   └─→ Probar en /colors
   ↓
2. docs/UI-SERVICE-IMPLEMENTATION-GUIDE.md
   ├─→ Sistema de toasts
   └─→ Modales de confirmación
   ↓
3. docs/HOME-PAGE-STYLES-GUIDE.md
   └─→ Estructura y componentes visuales
   ↓
4. docs/MAPS-GUIDE.md (si necesitas mapas)
   ├─→ Componentes Map y StoreLocationsMap
   └─→ Integración de Leaflet
   ↓
5. Implementar componente
```

### Para Entender el Dominio

**Modelado y tipos:**

```
1. docs/modeling/entidades.md
   └─→ Conocer Usuario, Libro, Autor, Categoría
   ↓
2. docs/modeling/operaciones.md
   └─→ CRUD operations
   ↓
3. docs/productos-sistema-completo.md
   └─→ Sistema completo de gestión
   ↓
4. docs/modeling/api.md
   └─→ Interfaces de API
```

---

## 📝 Referencias Cruzadas

### COLOR-SYSTEM-GUIDE.md
**Es referenciado por:**
- CLAUDE.md (sección Design System)
- HOME-PAGE-STYLES-GUIDE.md
- UI-SERVICE-IMPLEMENTATION-GUIDE.md
- README.md

**Referencia a:**
- HOME-PAGE-STYLES-GUIDE.md (implementación)
- UI-SERVICE-IMPLEMENTATION-GUIDE.md (uso en toasts)
- CLAUDE.md (guía principal)

### UI-SERVICE-IMPLEMENTATION-GUIDE.md
**Es referenciado por:**
- CLAUDE.md (sección UI Guidelines)
- COLOR-SYSTEM-GUIDE.md
- README.md

**Referencia a:**
- COLOR-SYSTEM-GUIDE.md (colores de variantes)

### HOME-PAGE-STYLES-GUIDE.md
**Es referenciado por:**
- COLOR-SYSTEM-GUIDE.md
- README.md
- MAPS-GUIDE.md

**Referencia a:**
- COLOR-SYSTEM-GUIDE.md (sistema de colores)

### MAPS-GUIDE.md
**Es referenciado por:**
- CLAUDE.md (sección de componentes)
- README.md

**Referencia a:**
- COLOR-SYSTEM-GUIDE.md (sistema de colores)
- HOME-PAGE-STYLES-GUIDE.md (implementación en home)
- modeling/entidades.md (tipo StoreLocation)

---

## 🎯 Puntos de Entrada

### Por Tipo de Tarea

| Tarea | Documento Principal | Documentos Secundarios |
|-------|---------------------|------------------------|
| **Crear componente UI** | COLOR-SYSTEM-GUIDE.md | UI-SERVICE-IMPLEMENTATION-GUIDE.md, HOME-PAGE-STYLES-GUIDE.md |
| **Implementar feedback** | UI-SERVICE-IMPLEMENTATION-GUIDE.md | COLOR-SYSTEM-GUIDE.md |
| **Agregar mapas** | MAPS-GUIDE.md | COLOR-SYSTEM-GUIDE.md, modeling/entidades.md |
| **Trabajar con datos** | modeling/entidades.md | productos-sistema-completo.md, modeling/api.md |
| **Onboarding general** | CLAUDE.md | README.md, COLOR-SYSTEM-GUIDE.md |
| **Diseñar página** | HOME-PAGE-STYLES-GUIDE.md | COLOR-SYSTEM-GUIDE.md |

---

## 🔄 Dependencias

```
                    CLAUDE.md (raíz)
                         |
            ┌────────────┼────────────┐
            |            |            |
    COLOR-SYSTEM    UI-SERVICE    modeling/
         |              |              |
         ├──────────────┤              |
         |                             |
  HOME-PAGE-STYLES            productos-sistema
```

### Niveles de Dependencia

**Nivel 0 (Base):**
- COLOR-SYSTEM-GUIDE.md
- modeling/entidades.md

**Nivel 1 (Dependen de Nivel 0):**
- UI-SERVICE-IMPLEMENTATION-GUIDE.md
- HOME-PAGE-STYLES-GUIDE.md
- modeling/operaciones.md
- modeling/api.md

**Nivel 2 (Dependen de Nivel 1):**
- productos-sistema-completo.md
- mock-data-system.md

**Nivel 3 (Documentación general):**
- CLAUDE.md
- README.md

---

## 📊 Estadísticas

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| **Guías de Design System** | 4 | docs/ (raíz) |
| **Documentación de Modelado** | 4 | docs/modeling/ |
| **Sistemas Técnicos** | 3 | docs/ (raíz) |
| **Documentación Principal** | 2 | / y docs/ |
| **TOTAL** | 13 | - |

---

## 🚀 Actualizaciones y Mantenimiento

### Al Agregar Nueva Documentación

1. **Crear el archivo** en la carpeta apropiada
2. **Actualizar README.md** con el enlace en la sección correcta
3. **Actualizar este DOCUMENTATION-MAP.md** con:
   - Ubicación en el árbol visual
   - Referencias cruzadas
   - Flujo de lectura recomendado
4. **Agregar referencias** en documentos relacionados
5. **Actualizar CLAUDE.md** si es necesario

### Convenciones

- **MAYÚSCULAS-CON-GUIONES.md** - Guías principales
- **minúsculas-con-guiones.md** - Documentos técnicos
- **carpetas/** - Agrupación temática
- **📄 📁 🎨 📊 🔧** - Emojis para navegación visual

---

**Última actualización:** Noviembre 2025
**Mantenido por:** Equipo de desarrollo
