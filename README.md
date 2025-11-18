# Store - Aplicación Web con Diseño Atómico

Una aplicación web moderna construida siguiendo las mejores prácticas de desarrollo, utilizando diseño atómico y un enfoque minimalista en dependencias.

## Tecnologías

- **React 19** - Framework principal para la interfaz de usuario
- **TypeScript** - Tipado fuerte para mayor robustez y mantenibilidad
- **Vite** - Herramienta de construcción rápida con HMR
- **Tailwind CSS v4** - Framework CSS utilitario con variables CSS personalizadas
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
src/
├── components/
│   ├── atoms/          # Componentes básicos
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts    # Exportaciones
│   ├── molecules/      # Combinaciones de átomos
│   ├── organisms/      # Componentes complejos
│   └── templates/      # Estructuras de página
├── pages/              # Páginas de la aplicación
├── hooks/              # Hooks personalizados
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts        # Todos los tipos del dominio (Usuario, Producto, Venta, etc.)
├── features/           # Lógica de negocio por feature
├── assets/             # Recursos estáticos
├── App.tsx
├── main.tsx
└── index.css           # Configuración Tailwind + variables CSS
```

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

## Contribución

1. Seguir las reglas de tipado fuerte
2. Mantener el diseño atómico
3. Usar el menor número de librerías posible
4. Asegurar que el código pase ESLint
5. Documentar componentes nuevos
