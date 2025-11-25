# Documentación del Proyecto Store

## 📚 Índice General

Esta carpeta contiene toda la documentación técnica del proyecto de librería online.

**🗺️ ¿Perdido?** Ver el **[Mapa de Documentación](./DOCUMENTATION-MAP.md)** para entender cómo se relacionan todos los documentos.

### 📋 Meta-Documentación

- **[Mapa de Documentación](./DOCUMENTATION-MAP.md)** - Diagrama visual de cómo se relacionan todos los documentos

### 🎨 Design System

- **[Sistema de Colores](./COLOR-SYSTEM-GUIDE.md)** - Guía completa del sistema de colores con soporte para dark mode ⭐
- **[Guía de Estilos de Home](./HOME-PAGE-STYLES-GUIDE.md)** - Implementación visual de la página principal
- **[Sistema de UI/UX](./UI-SERVICE-IMPLEMENTATION-GUIDE.md)** - Toasts, modales y sistema de feedback
- **[Guía de Mapas](./MAPS-GUIDE.md)** - Integración de Leaflet y componentes de mapas interactivos

### 📊 Modelado de Datos

Documentación del sistema de tipos y entidades del dominio:

- **[Entidades](./modeling/entidades.md)** - Modelos de dominio (Usuario, Libro, Autor, Categoría, etc.)
- **[Operaciones](./modeling/operaciones.md)** - Tipos para operaciones CRUD
- **[API](./modeling/api.md)** - Interfaces de API, filtros y paginación
- **[Otros](./modeling/otros.md)** - Autenticación, validación, configuración

### 🔧 Sistemas Técnicos

- **[Mock Data System](./mock-data-system.md)** - Sistema de datos simulados para desarrollo
- **[Sistema de Productos](./productos-sistema-completo.md)** - Gestión completa de productos (libros)
- **[Análisis de Tipado](./analisis-tipado-libros.md)** - Análisis del sistema de tipos de libros

---

## 🚀 Inicio Rápido

### Para Desarrolladores Nuevos

1. **Leer primero:** [CLAUDE.md](../CLAUDE.md) en la raíz del proyecto
2. **Design System:** [COLOR-SYSTEM-GUIDE.md](./COLOR-SYSTEM-GUIDE.md) y [UI-SERVICE-IMPLEMENTATION-GUIDE.md](./UI-SERVICE-IMPLEMENTATION-GUIDE.md)
3. **Modelado:** Revisar carpeta [modeling/](./modeling/)

### Para Trabajar con Componentes

1. **Colores y temas:** [COLOR-SYSTEM-GUIDE.md](./COLOR-SYSTEM-GUIDE.md)
2. **Página Home:** [HOME-PAGE-STYLES-GUIDE.md](./HOME-PAGE-STYLES-GUIDE.md)
3. **Feedback de UI:** [UI-SERVICE-IMPLEMENTATION-GUIDE.md](./UI-SERVICE-IMPLEMENTATION-GUIDE.md)
4. **Mapas interactivos:** [MAPS-GUIDE.md](./MAPS-GUIDE.md)

### Para Entender el Dominio

1. **Entidades:** [modeling/entidades.md](./modeling/entidades.md)
2. **Sistema de productos:** [productos-sistema-completo.md](./productos-sistema-completo.md)

---

## 📝 Estructura de la Documentación

```
docs/
├── README.md (este archivo)          # Índice general
│
├── Design System & UI
│   ├── COLOR-SYSTEM-GUIDE.md         # Sistema de colores y dark mode
│   ├── HOME-PAGE-STYLES-GUIDE.md     # Estilos de la home
│   ├── UI-SERVICE-IMPLEMENTATION-GUIDE.md  # Toasts y modales
│   ├── MAPS-GUIDE.md                 # Mapas interactivos con Leaflet
│   └── FORM-GUIDE.md                 # Guía de formularios
│
├── Modelado de Datos
│   └── modeling/
│       ├── entidades.md              # Modelos de dominio
│       ├── operaciones.md            # CRUD operations
│       ├── api.md                    # API interfaces
│       └── otros.md                  # Auth, validación, config
│
└── Sistemas
    ├── mock-data-system.md           # Sistema de mocks
    ├── productos-sistema-completo.md # Gestión de productos
    └── analisis-tipado-libros.md     # Análisis de tipos
```

---

## 🎯 Convenciones

### Nomenclatura de Archivos
- Usar kebab-case: `color-system-guide.md`
- Nombres descriptivos en español
- MAYÚSCULAS para guías principales: `COLOR-SYSTEM-GUIDE.md`

### Estructura de Documentos
Cada documento de guía debe incluir:

1. **Título descriptivo**
2. **Tabla de contenidos** (para docs >100 líneas)
3. **Descripción general**
4. **Ejemplos de código**
5. **Anti-patrones** (qué NO hacer)
6. **Referencias cruzadas** a otros docs

### Referencias Cruzadas
Usar enlaces relativos:
```markdown
Ver [Sistema de Colores](./COLOR-SYSTEM-GUIDE.md) para más detalles.
```

---

## 🔄 Actualizaciones

### Última Actualización
**Fecha:** Noviembre 2025

### Cambios Recientes
- ✅ Guía de mapas con Leaflet (MAPS-GUIDE.md)
- ✅ Nuevo sistema de colores con soporte para dark mode
- ✅ Índice general de documentación (README.md)
- ✅ Guías de UI/UX y feedback

### TODO
- [ ] Guía de testing (cuando se implemente)
- [ ] Guía de deployment
- [ ] Documentación de API cuando se integre el backend

---

## 📞 Contribuir a la Documentación

Al agregar nueva documentación:

1. Crear el archivo en la carpeta apropiada
2. Actualizar este README.md con el enlace
3. Agregar referencias cruzadas en documentos relacionados
4. Actualizar CLAUDE.md si es necesario

**Ejemplo:**
Si creas `AUTH-SYSTEM-GUIDE.md`:
- Agregarlo a la sección correspondiente en este README
- Agregar referencia en `UI-SERVICE-IMPLEMENTATION-GUIDE.md` si se relaciona
- Actualizar `CLAUDE.md` con el enlace

---

## 📖 Recursos Adicionales

### Archivo Principal del Proyecto
- **[CLAUDE.md](../CLAUDE.md)** - Guía principal para Claude Code con instrucciones del proyecto

### Tecnologías Usadas
- **React 18** + TypeScript (strict mode)
- **Tailwind CSS v4** con variables CSS
- **Vite** (Rolldown-Vite fork)
- **React Router v6**

### Demo Páginas
- `/colors` - Demo del sistema de colores
- `/components` - Demo de componentes atómicos
