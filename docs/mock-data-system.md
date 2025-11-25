# Sistema de Mock Data con Contexto Global

Este documento explica cómo funciona el sistema de mock data con contexto global implementado en la aplicación de librería.

> **Nota:** Esta es una tienda de libros, por lo que todo el sistema está diseñado para gestionar libros, autores y categorías literarias.

## Arquitectura

El sistema está diseñado para simular una API backend usando archivos JSON estáticos y React Context:

1. **Primera carga**: Fetch a archivos JSON en `/public/data/`
2. **Siguientes operaciones**: Todo se maneja en memoria con el contexto
3. **Persistencia simulada**: Las operaciones CRUD actualizan el estado del contexto

```
┌─────────────────┐
│  Component      │
│  (ProductsPage) │
└────────┬────────┘
         │ useTienda()
         ▼
┌─────────────────┐
│ TiendaContext   │◄───── Fetch inicial (una vez)
│                 │       /data/libros.json
│ - libros[]      │       /data/autores.json
│ - autores[]     │       /data/categorias.json
│ - categorias[]  │
│ - CRUD methods  │
└─────────────────┘
```

## Archivos JSON

### `/public/data/libros.json`
Contiene libros de ejemplo con:
- libro_id
- isbn
- titulo
- subtitulo
- sinopsis
- autor_id
- nombre_editorial
- categoria_id
- año_publicacion
- idioma (ej: "Español", "Inglés")
- num_paginas
- formato (ej: "Tapa dura", "Tapa blanda", "eBook")
- precio_venta
- stock_actual
- portada_url
- estado (disponible | agotado | proximamente | descatalogado)

### `/public/data/autores.json`
Contiene autores de ejemplo con:
- autor_id
- nombre
- biografia
- nacionalidad
- fecha_nacimiento
- foto_url

### `/public/data/categorias.json`
Contiene categorías/géneros literarios:
- categoria_id
- nombre
- descripcion
- genero (GeneroLiterario)
- icono (emoji o string)
- imagen_url

## TiendaContext

### Estado
```typescript
{
  libros: Libro[];               // Array de libros
  autores: Autor[];              // Array de autores
  categorias: Categoria[];       // Array de categorías
  isLoading: boolean;            // Estado de carga
  error: string | null;          // Mensajes de error
  isInitialized: boolean;        // Si ya se hizo fetch inicial
}
```

### Métodos

#### Libros
- `fetchLibros()`: Carga libros desde JSON (solo primera vez)
- `getLibroById(id)`: Obtiene libro por ID desde contexto
- `getLibrosByCategoria(categoriaId)`: Filtra libros por categoría
- `getLibrosByAutor(autorId)`: Filtra libros por autor
- `crearLibro(data)`: Crea libro y actualiza contexto
- `actualizarLibro(data)`: Actualiza libro en contexto
- `eliminarLibro(id)`: Elimina libro del contexto

#### Autores
- `fetchAutores()`: Carga autores desde JSON (solo primera vez)
- `getAutorById(id)`: Obtiene autor por ID desde contexto
- `crearAutor(data)`: Crea autor y actualiza contexto
- `actualizarAutor(data)`: Actualiza autor en contexto
- `eliminarAutor(id)`: Elimina autor del contexto

#### Categorías
- `fetchCategorias()`: Carga categorías desde JSON (solo primera vez)
- `getCategoriaById(id)`: Obtiene categoría por ID desde contexto
- `crearCategoria(data)`: Crea categoría y actualiza contexto
- `actualizarCategoria(data)`: Actualiza categoría en contexto
- `eliminarCategoria(id)`: Elimina categoría del contexto

## Hook useTienda

```typescript
import { useTienda } from '@/contexts/TiendaContext';

const MyComponent = () => {
  const {
    libros,          // Array de todos los libros
    autores,         // Array de todos los autores
    categorias,      // Array de todas las categorías
    isLoading,       // Estado de carga
    error,           // Mensaje de error
    getLibroById,
    getLibrosByCategoria,
    getLibrosByAutor,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    getAutorById,
    crearAutor,
    // ... más métodos
  } = useTienda();

  // Uso...
};
```

## Ejemplo de Uso

### Listar Libros

```typescript
import { useTienda } from '@/contexts/TiendaContext';

const LibrosList = () => {
  const { libros, isLoading, error } = useTienda();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {libros.map(libro => (
        <LibroCard key={libro.libro_id} libro={libro} />
      ))}
    </div>
  );
};
```

### Filtrar por Categoría

```typescript
const LibrosByCategoria = ({ categoriaId }: { categoriaId: number }) => {
  const { getLibrosByCategoria } = useTienda();

  const libros = getLibrosByCategoria(categoriaId);

  return (
    <div>
      {libros.map(libro => (
        <LibroCard key={libro.libro_id} libro={libro} />
      ))}
    </div>
  );
};
```

### Crear Libro

```typescript
const CrearLibroForm = () => {
  const { crearLibro, isLoading } = useTienda();

  const handleSubmit = async (data: CrearLibro) => {
    try {
      const newLibro = await crearLibro(data);
      console.log('Libro creado:', newLibro);
      // El contexto se actualiza automáticamente
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // ...form JSX
};
```

### Actualizar Libro

```typescript
const EditLibroForm = ({ libroId }: { libroId: number }) => {
  const { actualizarLibro, getLibroById } = useTienda();
  const libro = getLibroById(libroId);

  const handleSubmit = async (data: ActualizarLibro) => {
    try {
      const updated = await actualizarLibro({
        libro_id: libroId,
        ...data
      });
      console.log('Libro actualizado:', updated);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // ...form JSX
};
```

### Eliminar Libro

```typescript
const DeleteLibroButton = ({ libroId }: { libroId: number }) => {
  const { eliminarLibro } = useTienda();

  const handleDelete = async () => {
    if (confirm('¿Eliminar libro?')) {
      try {
        await eliminarLibro(libroId);
        console.log('Libro eliminado');
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  return <button onClick={handleDelete}>Eliminar</button>;
};
```

## Integración con Componentes

### ProductsPage
La página de productos usa el hook completo:
- Carga automática de libros, autores y categorías
- Filtrado por categoría
- Spinner durante carga
- Manejo de errores
- Badges con información de categoría
- Advertencia visual para stock bajo

```typescript
const ProductsPage = () => {
  const { libros, categorias, isLoading, error, getCategoriaById } = useTienda();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredLibros = selectedCategory
    ? libros.filter(l => l.categoria_id === selectedCategory)
    : libros;

  // Render con filtros de categoría y grid de libros
};
```

## Ventajas del Sistema

1. **Performance**: Fetch único al inicio, todo lo demás en memoria
2. **Tipado fuerte**: TypeScript en toda la cadena
3. **Simplicidad**: No requiere servidor backend para desarrollo
4. **Realismo**: Simula delays de red y errores
5. **Escalable**: Fácil migrar a API real más adelante
6. **Estado global**: Todos los componentes ven los mismos datos
7. **Múltiples entidades**: Gestiona libros, autores y categorías de forma integrada

## Migración a API Real

Cuando se implemente un backend real, solo hay que modificar `TiendaContext.tsx`:

```typescript
// Cambiar de:
const response = await fetch('/data/libros.json');

// A:
const response = await fetch('/api/libros', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

Los componentes que usan `useTienda()` no necesitan cambios.

## Próximos Pasos

Este mismo patrón se puede replicar para:
- **Ventas** (SalesContext + useSales)
- **Compras** (PurchasesContext + usePurchases)
- **Usuarios** (UsersContext + useUsers)
- **Proveedores** (SuppliersContext + useSuppliers)

Cada uno con sus propios archivos JSON y operaciones CRUD simuladas.
