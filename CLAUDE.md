# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev      # Start development server (Vite on localhost:5173)
npm run build    # TypeScript compile + production build
npm run lint     # Run ESLint on all files
npm run preview  # Preview production build locally
```

### TypeScript
```bash
npx tsc -b       # Type check without emitting files
```

## Project Philosophy

### Minimalist Dependency Approach
This project emphasizes using native browser APIs over external libraries:
- **Fetch API** instead of axios for HTTP requests
- **localStorage** for client-side persistence
- **Native CSS/Tailwind** instead of UI component libraries
- Only add dependencies when strictly necessary

### Strict TypeScript
- Strict mode enabled with aggressive linting rules
- All variables, functions, and components must have explicit types
- Avoid `any` - use specific types or `unknown` with type guards
- TypeScript configuration: `tsconfig.app.json` with strict: true, noUnusedLocals, noUnusedParameters

### CSS-First with Tailwind v4
- Uses Tailwind CSS v4 with `@theme` directive and CSS variables
- Variables defined in `src/index.css` for theming and scalability
- Avoid inline styles - use Tailwind utility classes
- Mobile-first responsive design

## Architecture Overview

### Atomic Design Structure
Components are organized following atomic design methodology:

```
src/components/
├── atoms/        # Basic building blocks (11 components)
│   ├── Button, Input, Card, Badge, Alert
│   ├── Checkbox, Radio, Select, Textarea
│   └── Icon, Spinner
├── molecules/    # Composed components (7 components)
│   ├── DataTable, Dialog, Dropdown, FormField
│   ├── IconPicker, Modal, Pagination, SearchBar
├── organisms/    # Complex components (5 components)
│   ├── CategoriesTable, CategoryForm
│   ├── InventoryTable, ProductForm, SalesReport
└── templates/    # Page layouts
    └── Layout.tsx
```

All atomic components:
- Have explicit TypeScript interfaces for props
- Export from `index.ts` barrel files
- Support variant/size props for flexibility
- Follow consistent naming conventions

### Feature-Based Modules
Business logic is organized into self-contained feature modules in `src/features/`:

#### `cart/` - Shopping Cart Feature
- **CartContext.tsx**: Global state management with localStorage persistence
- **Cart.tsx**: Main cart component with item list and totals
- **CartItem.tsx**: Individual item with quantity controls
- **AddToCartButton.tsx**: Reusable add-to-cart button
- **useCart** hook: `addToCart(libro, quantity?)`, `removeFromCart(libroId)`, `updateQuantity(libroId, quantity)`, `clearCart()`
- Cart persists in localStorage and auto-calculates totals
- Uses `Libro` type with `libro_id` for identification

#### `checkout/` - Multi-Step Checkout
- **CheckoutWizard.tsx**: Main wizard component managing 4-step flow
  1. Shipping information (name, phone, email, address, city, notes)
  2. Payment method selection (cash, card, transfer, QR, credit) with conditional card fields
  3. Review step showing complete order summary
  4. Confirmation with success message
- Includes validation, progress bar, and automatic cart clearing on success
- Integrates with cart context to process checkout

#### Other Features
- `auth/`: Authentication (currently mock implementation)
- `dashboard/`: Analytics dashboard
- `inventory/`: Stock management
- `purchases/`: Purchase tracking
- `sales/`: Sales management
- `users/`: User administration

### Type System (`src/types/`)
Comprehensive type definitions organized by domain:

```
types/
├── entities/      # Domain models (Usuario, Libro, Autor, Categoria, Venta, Compra, etc.)
├── operations/    # CRUD operations (Crear*, Actualizar*, checkout)
├── api/          # API contracts (RespuestaAPI, ListaPaginada, filters, pagination)
├── auth/         # Authentication (CredencialesLogin, TokenUsuario, SesionUsuario)
├── validation/   # Validation rules and error handling
├── config/       # System configuration types
├── reports/      # Analytics and reporting types
└── index.ts      # Central export barrel
```

**Key Entities:**
- **Usuario**: `tipo_usuario: 'cliente' | 'empleado' | 'admin' | 'proveedor'`
- **Libro**: `libro_id`, `isbn`, `titulo`, `sinopsis`, `nombre_editorial`, `autor_id`, `categoria_id`, `precio_venta`, `stock_actual`, `idioma`, `formato`
- **Autor**: `autor_id`, `nombre`, `biografia`, `nacionalidad`, `fecha_nacimiento`, `foto_url`
- **Categoria**: `categoria_id`, `nombre`, `descripcion`, `icono`, `imagen_url` (simplified - no genre classification)
- **Venta/Compra**: Include details arrays with `DetalleVenta[]`/`DetalleCompra[]`

Import types from the central barrel: `import type { Usuario, Libro, Autor, Categoria, CrearVenta } from '@/types'`

### Context Providers
Three main contexts wrap the application:

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Mock authentication (accepts any username/password)
   - `useAuth()` hook provides: `user`, `login`, `register`, `logout`, `isAuthenticated`, `isLoading`
   - Persists user in localStorage

2. **TiendaContext** (`src/contexts/TiendaContext.tsx`)
   - Global state for libros, autores, and categorías
   - Fetches data from JSON files on first load
   - `useTienda()` hook provides: `libros`, `autores`, `categorias`, and full CRUD operations for each entity
   - Simulates backend with in-memory operations

3. **CartContext** (`src/features/cart/CartContext.tsx`)
   - Global cart state with localStorage sync
   - Auto-calculates totals on every change
   - Uses `Libro` type (libro_id)
   - `useCart()` hook provides cart operations

### Routing Structure
Protected routes require authentication via `ProtectedRoute` component:

```
App.tsx routing hierarchy:
├── AuthProvider
│   └── TiendaProvider
│       └── CartProvider
│           └── Router
│               ├── / (Home - public)
│               ├── /login (Login - public)
│               ├── /register (Register - public)
│               ├── /dashboard (Dashboard - protected, with Layout)
│               ├── /products (ProductsPage - protected, with Layout)
│               ├── /cart (CartPage - with Layout)
│               ├── /checkout (CheckoutWizard - with Layout)
│               └── /components (ComponentsDemo - public dev page)
```

**Layout Component**: Wraps protected pages, provides navigation header with cart counter and user menu

## Development Guidelines

### Component Creation
When creating new components:
1. Define explicit TypeScript interface for props
2. Use React.FC or explicit return types
3. Export from feature/layer `index.ts` barrel file
4. For atoms/molecules: support `variant` and `size` props
5. Use Tailwind classes, avoid inline styles

Example atom structure:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) => {
  // Implementation
};
```

### API Integration
Currently uses mock data. When implementing real API calls:
- Use native `fetch()` API
- Create typed response interfaces in `src/types/api/`
- Handle errors with proper TypeScript types
- Example pattern:
```typescript
const fetchLibros = async (): Promise<RespuestaAPI<Libro[]>> => {
  const response = await fetch('/api/libros');
  if (!response.ok) throw new Error('Failed to fetch libros');
  return response.json();
};
```

### State Management
- Use React Context for global state (auth, cart)
- Use `useState` for local component state
- Use `useEffect` for side effects and data fetching
- Persist to localStorage for client-side persistence
- No Redux or external state libraries

### Form Handling
- Use controlled components with `useState`
- Validate on submit or blur
- Show validation errors inline
- See `CheckoutWizard.tsx` for multi-step form pattern

## Common Patterns

### Using Tienda (Store) Feature
```typescript
import { useTienda } from '@/contexts/TiendaContext';

const MyComponent = () => {
  const {
    libros,
    autores,
    categorias,
    getLibroById,
    crearLibro,
    actualizarLibro,
    eliminarLibro
  } = useTienda();

  // Access all books, authors, and categories
  // Perform CRUD operations
};
```

### Using Cart Feature
```typescript
import { useCart } from '@/features/cart';

const MyComponent = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  // cart.items: CartItem[] (each item has libro: Libro)
  // cart.total: number

  return <button onClick={() => addToCart(libro, 2)}>Add 2 to Cart</button>;
};
```

### Using Authentication
```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

  return <div>Welcome {user?.nombre}</div>;
};
```

### Protected Routes
Wrap route elements with `<ProtectedRoute>` component to require authentication:
```typescript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Layout><Dashboard /></Layout>
  </ProtectedRoute>
} />
```

## Build Configuration

### Vite Setup
- Uses Rolldown-Vite (custom Vite fork) specified in package.json overrides
- React plugin with SWC for fast compilation
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- No path aliases configured - use relative imports

### TypeScript Configuration
- References pattern with `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- App config: strict mode, no unused variables/parameters, bundler module resolution
- JSX: `react-jsx` (automatic runtime)

## Data Modeling
Full data model documentation in `docs/modeling/`:
- `entidades.md`: Entity definitions and relationships
- `operaciones.md`: CRUD operation types
- `api.md`: API interfaces, filters, pagination
- `otros.md`: Auth, validation, config, reports

Key relationships:
- Categoría 1:N Libro
- Autor 1:N Libro
- Libro 1:N DetalleVenta/DetalleCompra
- Usuario acts as cliente/empleado in Ventas and Compras
- MetodoPago links to Venta/Compra

**Note:** This is a bookstore application, so all products are books (Libro) with specific attributes like ISBN, author, publisher, etc.

## Important Notes

### Current Implementation Status
- Authentication is mocked (accepts any credentials)
- No backend API integration yet - data is mock/localStorage only
- Cart and checkout are fully functional with localStorage persistence
- All 11 atoms, 6 molecules, and 3 organisms are implemented

### Future Backend Integration
When adding real API:
1. Update `AuthContext` login/register to call actual endpoints
2. Replace mock data in `TiendaContext` (libros, autores, categorías) with API fetch
3. Implement checkout API call in `CheckoutWizard` confirmation step
4. Add error handling and loading states
5. Consider adding API service layer in `src/services/`
6. Update cart operations to work with backend libro_id references

### Testing
No testing framework currently installed. When adding tests:
- Use Vitest (Vite-native test runner)
- Write tests alongside components: `Component.test.tsx`
- Focus on business logic and user interactions

---

## Design System & UI Guidelines

### Color System

**⚠️ IMPORTANT:** Este proyecto usa un sistema de colores de 3 capas con **soporte automático para modo oscuro**.

**Documentación completa:** Ver `docs/COLOR-SYSTEM-GUIDE.md`

**Demo visual:** Visitar `/colors` en el navegador

#### Estructura del Sistema

```
Paleta Base (verde + neutros) → Variables Semánticas → Clases de Tailwind
```

#### Variables Semánticas (PREFERIDAS)

**Usar SIEMPRE estas variables - se adaptan automáticamente a dark mode:**

```tsx
// ✅ CORRECTO - Fondos y textos principales
<div className="bg-background text-foreground">

// ✅ Colores de marca
<button className="bg-primary text-primary-foreground">

// ✅ Fondos secundarios
<div className="bg-muted text-muted-foreground">

// ✅ Hover states
<div className="hover:bg-accent hover:text-accent-foreground">

// ✅ Bordes
<div className="border border-border">

// ✅ Cards
<div className="bg-card text-card-foreground">

// ✅ Estados
<div className="bg-success text-success-foreground">
<div className="bg-error text-error-foreground">
<div className="bg-warning text-warning-foreground">
<div className="bg-info text-info-foreground">
```

#### Paletas de Colores Base

**Verde (Principal):**
- `green-50` a `green-950` - 11 tonalidades de verde
- `primary` (semántico) → `green-600` en light, `green-500` en dark

**Neutros (Grises):**
- `neutral-50` a `neutral-950` - 11 tonalidades de gris
- Usar para texto, fondos y elementos de UI

#### Anti-Patrones (EVITAR)

```tsx
// ❌ NO usar colores hardcodeados
<div className="bg-white text-black">

// ❌ NO usar hex colors inline
<div style={{ backgroundColor: '#16a34a' }}>

// ❌ NO usar gray-* (usa neutral-* o variables semánticas)
<div className="bg-gray-100">
```

#### Modo Oscuro

El modo oscuro se activa **automáticamente** basado en `prefers-color-scheme`.

**Para probar:**
- Chrome DevTools → Cmd+Shift+P → "Render" → Emulate dark mode
- Cambiar tema del sistema operativo

### Icon System: Lucide React

**Installation:**
```bash
npm install lucide-react
```

**Usage:**
```typescript
import { Plus, Pencil, Trash2, Search, BookOpen } from 'lucide-react';

// In JSX
<Plus size={18} className="mr-2" />
<Pencil size={16} className="mr-1" />
```

**Common Icons:**
- **Plus** - Add/Create actions
- **Pencil** - Edit actions
- **Trash2** - Delete actions
- **Search** - Search functionality
- **BookOpen, Book, BookMarked** - Book-related features
- **Heart, Star, Sparkles** - Categories/favorites
- **Users, Baby, GraduationCap** - User demographics
- **Clock, Brain, Globe** - Various categories

**Icon Sizes:**
- Buttons: `size={16}` or `size={18}`
- Category displays: `size={20}`
- Feature highlights: `size={24}`

**DO NOT use:**
- Emoji icons (✏️, 🗑️, ➕) - Use Lucide instead
- Icon atom component with emoji - Only for legacy compatibility

### UI Feedback: UIService

**Location:** `src/stores/ui/UIServiceContext.tsx`

Always use UIService for user feedback instead of console.log or custom modals.

#### Toast Notifications

**Success:**
```typescript
import { useUIService } from '../../stores/ui';

const { toast } = useUIService();

// Show success message
toast.success('Categoría creada exitosamente');
```

**Error:**
```typescript
toast.error('Error al eliminar la categoría');
```

**Warning:**
```typescript
toast.warning('Esta categoría tiene libros asociados');
```

**Info:**
```typescript
toast.info('Procesando solicitud...');
```

**Custom Toast:**
```typescript
toast.show('Mensaje personalizado', {
  variant: 'success',
  duration: 5000  // milliseconds
});
```

#### Confirmation Dialogs

**Delete Confirmation:**
```typescript
const { confirm } = useUIService();

confirm.delete(categoria.nombre, async () => {
  await eliminarCategoria(categoria.categoria_id);
  toast.success(`Categoría "${categoria.nombre}" eliminada`);
});
```

**Generic Confirmation:**
```typescript
confirm.show({
  title: '¿Está seguro?',
  message: 'Esta acción no se puede deshacer',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger',  // 'danger' | 'warning' | 'info'
  onConfirm: async () => {
    // Perform action
  }
});
```

**Restore/Archive Confirmation:**
```typescript
confirm.restore(categoria.nombre, async () => {
  await restaurarCategoria(categoria.categoria_id);
  toast.success('Categoría restaurada');
});
```

#### Features
- **Auto-dismiss:** Toasts automatically disappear after 5 seconds (configurable)
- **Max toasts:** Only 5 toasts shown at once
- **Loading states:** Confirmation dialogs show loading during async operations
- **Error extraction:** Automatically extracts messages from backend errors

### Component Patterns for CRUD

#### Table with Actions (InventoryTable pattern)
```typescript
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useUIService } from '../../stores/ui';

const columns = [
  {
    key: 'actions',
    header: 'Acciones',
    render: (_: any, item: Item) => (
      <div className="flex space-x-2">
        <Button variant="secondary" size="sm" onClick={() => onEdit(item)}>
          <Pencil size={16} className="mr-1" />
          Editar
        </Button>
        <Button variant="error" size="sm" onClick={() => onDelete(item)}>
          <Trash2 size={16} className="mr-1" />
          Eliminar
        </Button>
      </div>
    )
  }
];
```

#### Form with Dialog (CategoryForm pattern)
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const { toast } = useUIService();

const handleSubmit = async (data: CreateData) => {
  try {
    await createItem(data);
    toast.success('Elemento creado exitosamente');
    setIsModalOpen(false);
  } catch (error) {
    toast.error('Error al crear elemento');
  }
};

return (
  <>
    <Button onClick={() => setIsModalOpen(true)}>
      <Plus size={18} className="mr-2" />
      Nuevo Elemento
    </Button>

    <Dialog
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Nuevo Elemento"
      size="lg"
    >
      <ItemForm
        onSubmit={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        loading={isSubmitting}
      />
    </Dialog>
  </>
);
```

### Best Practices

1. **Always use UIService** for feedback, never alert() or console.log for user messages
2. **Use Lucide icons** consistently, not emoji
3. **Follow color palette** from Tailwind utilities
4. **Confirm destructive actions** with confirm.delete()
5. **Show loading states** during async operations
6. **Clear error messages** that users can understand
7. **Success feedback** for all successful actions
