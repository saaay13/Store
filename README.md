# Store - Aplicación de Gestión para Tienda

Una aplicación web moderna para la gestión de tiendas, construida siguiendo las mejores prácticas de desarrollo, utilizando diseño atómico y un enfoque minimalista en dependencias.

## Tecnologías

- **React 19** - Framework principal para la interfaz de usuario
- **TypeScript** - Tipado fuerte para mayor robustez y mantenibilidad
- **Vite** - Herramienta de construcción rápida con HMR
- **Tailwind CSS v4** - Framework CSS utilitario con variables CSS personalizadas
- **React Router DOM** - Navegación y enrutamiento
- **ESLint** - Linting para mantener calidad de código

## Estilo de Programación

### Diseño Atómico
Seguimos la metodología de diseño atómico, organizando los componentes en:
- **Átomos** (`src/components/atoms/`): Componentes básicos reutilizables (Button, Input, Card, Badge)
- **Moléculas** (`src/components/molecules/`): Combinaciones de átomos
- **Organismos** (`src/components/organisms/`): Componentes complejos
- **Templates** (`src/components/templates/`): Estructuras de página
- **Páginas** (`src/pages/`): Páginas completas de la aplicación

### Principios de Desarrollo

#### Tipado Fuerte
- **Siempre usar TypeScript** con tipos explícitos
- Interfaces y tipos para todas las props de componentes
- Evitar `any` y usar tipos específicos
- Strict mode habilitado en configuración de TypeScript

#### Minimalismo en Librerías
- Usar APIs nativas del navegador cuando sea posible
- **Fetch API** en lugar de axios para peticiones HTTP
- Evitar librerías innecesarias que agreguen complejidad
- Preferir soluciones CSS/Tailwind sobre componentes de UI externos

#### CSS First con Tailwind
- Variables CSS personalizadas para temas y escalabilidad
- Configuración de Tailwind usando `@theme` con variables CSS
- Estilos consistentes y mantenibles
- Evitar estilos inline, usar clases de Tailwind

## Estructura del Proyecto

```
store-main/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── atoms/           # Componentes básicos (11 componentes)
│   │   │   ├── Alert.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── index.ts
│   │   ├── molecules/       # Componentes compuestos (6 componentes)
│   │   │   ├── DataTable.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── index.ts
│   │   ├── organisms/       # Componentes complejos (3 componentes)
│   │   │   ├── InventoryTable.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── SalesReport.tsx
│   │   │   └── index.ts
│   │   └── templates/       # Estructuras de página
│   │       └── Layout.tsx
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.tsx
│   ├── features/
│   ├── hooks/
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.tsx  # Contexto de autenticación
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   └── types/               # Definiciones TypeScript
│       ├── index.ts
│       ├── api/
│       │   ├── filters.ts
│       │   ├── pagination.ts
│       │   └── responses.ts
│       ├── auth/
│       │   └── index.ts
│       ├── config/
│       │   └── index.ts
│       ├── entities/
│       │   ├── category.ts
│       │   ├── payment-method.ts
│       │   ├── product.ts
│       │   ├── purchase.ts
│       │   ├── sale.ts
│       │   ├── supplier.ts
│       │   └── user.ts
│       ├── operations/
│       │   ├── create.ts
│       │   └── update.ts
│       ├── reports/
│       │   └── index.ts
│       └── validation/
│           └── index.ts
└── docs/
    └── modeling/
        ├── api.md
        ├── entidades.md
        ├── operaciones.md
        └── otros.md
```

## Modelado de Datos

La documentación completa del modelado de datos se encuentra en [`docs/modeling/`](docs/modeling/).

Incluye:
- [Entidades](docs/modeling/entidades.md) - Definición de las entidades principales (Usuario, Categoría, Producto, etc.)
- [Operaciones](docs/modeling/operaciones.md) - Tipos para crear y actualizar entidades
- [API](docs/modeling/api.md) - Interfaces de la API, filtros y paginación
- [Otros](docs/modeling/otros.md) - Autenticación, validación, configuración e informes

### Estructura de Tipos

Los tipos están organizados en módulos escalables en `src/types/`:

- **entities/**: Entidades del dominio (Usuario, Producto, Categoría, Proveedor, etc.)
- **operations/**: Tipos para operaciones CRUD (crear/actualizar)
- **api/**: Interfaces para comunicación con API (respuestas, filtros, paginación)
- **auth/**: Tipos de autenticación y sesiones
- **validation/**: Validación de datos y errores
- **config/**: Configuración del sistema
- **reports/**: Tipos para reportes y analytics

### Entidades Principales

#### Usuario
```typescript
interface Usuario {
  usuario_id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  email: string;
  tipo_usuario: 'cliente' | 'empleado' | 'admin' | 'proveedor';
  nombre_usuario?: string;
  password_hash?: string;
}
```

#### Producto
```typescript
interface Producto {
  producto_id: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  precio_compra_referencia: number;
  stock_actual: number;
  unidad_medida: string;
  codigo_barras: string;
  categoria_id: number;
}
```

#### Venta
```typescript
interface Venta {
  venta_id: number;
  fecha_hora: Date;
  total: number;
  cliente_id: number;
  empleado_id: number;
  metodo_pago_id: number;
  detalles?: DetalleVenta[];
}
```

### Relaciones del Sistema

- **Categoría** 1:N **Producto**
- **Producto** 1:N **DetalleVenta** / **DetalleCompra**
- **Proveedor** 1:N **Compra**
- **Usuario** 1:N **Venta** (cliente/empleado) / **Compra** (empleado)
- **MétodoPago** 1:N **Venta** / **Compra**

### Uso de Tipos

```typescript
// Importación desde el índice principal
import type { Usuario, Producto, CrearProducto } from '@/types';

// Función tipada
const crearProducto = async (datos: CrearProducto): Promise<RespuestaAPI<Producto>> => {
  const response = await fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return response.json();
};
```

## Sistema de Autenticación

La aplicación incluye un sistema completo de autenticación con las siguientes características:

### Funcionalidades
- **Registro de usuarios** con validación completa
- **Inicio de sesión** con persistencia de sesión
- **Protección de rutas** para áreas privadas
- **Contexto de autenticación** global
- **Navegación condicional** basada en estado de autenticación

### Rutas de la Aplicación
- **`/`** - Página de inicio con landing page
- **`/login`** - Formulario de inicio de sesión
- **`/register`** - Formulario de registro
- **`/dashboard`** - Dashboard principal (requiere autenticación)
- **`/components`** - Demo de componentes (desarrollo)

### Flujo de Autenticación
```
🏠 Página de Inicio → 🔐 Login/Registro → ✅ Dashboard
```

### Contexto de Autenticación
```typescript
const { user, login, register, logout, isAuthenticated } = useAuth();
```

## Componentes del Sistema

### Sistema Atómico Completo
- **11 Componentes Atómicos**: Base reutilizable (Button, Input, Card, etc.)
- **6 Componentes Moleculares**: Funcionalidades compuestas (DataTable, Modal, etc.)
- **3 Organismos**: Interfaces completas (ProductForm, InventoryTable, SalesReport)

### Páginas Implementadas
- **Home**: Landing page con navegación a auth
- **Login**: Formulario de autenticación
- **Register**: Formulario de registro de usuarios
- **Dashboard**: Panel principal con métricas

### Contextos y Hooks
- **AuthContext**: Gestión global del estado de autenticación
- **useAuth**: Hook personalizado para acceder al contexto

## Reglas del Proyecto

### Código
- **Tipado fuerte obligatorio**: Todas las variables, funciones y componentes deben tener tipos explícitos
- **Nombres descriptivos**: Variables y funciones con nombres que expresen su propósito
- **Funciones puras**: Evitar efectos secundarios cuando sea posible
- **Componentes funcionales**: Usar hooks en lugar de class components

### Estilos
- **CSS Variables**: Definir colores, espaciado y otros valores en variables CSS
- **Tailwind utility-first**: Usar clases de Tailwind para estilos
- **Responsive design**: Mobile-first approach
- **Consistencia**: Seguir el sistema de diseño definido

### Librerías y Dependencias
- **Minimalismo**: Solo instalar librerías cuando sean estrictamente necesarias
- **Nativas primero**: Usar APIs del navegador (fetch, localStorage, etc.) antes que wrappers
- **Mantenimiento**: Evaluar el costo de mantenimiento de cada dependencia

### Ejemplos de Implementación

#### Peticiones HTTP
```typescript
// ✅ Correcto: Usar fetch nativo
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

// ❌ Incorrecto: Usar axios u otras librerías
import axios from 'axios';
```

#### Tipado de Componentes
```typescript
// ✅ Correcto: Interfaces explícitas
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

// ❌ Incorrecto: Props sin tipar
const Button = ({ variant, size, children }) => { ... };
```

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Linting
npm run lint
```

## Cómo Usar la Aplicación

### Primera Ejecución
1. **Instala dependencias**: `npm install`
2. **Ejecuta el servidor**: `npm run dev`
3. **Visita** `http://localhost:5173`

### Flujo de Usuario
1. **Página de Inicio** (`/`): Landing page con opciones de login/registro
2. **Registro** (`/register`): Crea una nueva cuenta
3. **Login** (`/login`): Inicia sesión con cualquier usuario/contraseña
4. **Dashboard** (`/dashboard`): Panel principal con funcionalidades

### Autenticación de Prueba
- **Usuario**: Cualquier texto
- **Contraseña**: Cualquier texto
- La aplicación acepta cualquier combinación para facilitar las pruebas

### Navegación
- Usa los botones en la página de inicio para navegar
- El dashboard está protegido y requiere autenticación
- La sesión se mantiene al recargar la página

## Arquitectura del Código

### Diseño Atómico
```
Átomos (11) → Moléculas (6) → Organismos (3) → Páginas (4)
```

### Principios Implementados
- **Tipado fuerte** en todos los componentes
- **Separación de responsabilidades** clara
- **Reutilización** máxima de componentes
- **Navegación** basada en estado de autenticación
- **Responsive design** para todos los dispositivos

## Contribución

1. Seguir las reglas de tipado fuerte
2. Mantener el diseño atómico
3. Usar el menor número de librerías posible
4. Asegurar que el código pase ESLint
5. Documentar componentes nuevos
