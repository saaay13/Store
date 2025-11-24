import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Libro, CrearLibro, ActualizarLibro, Categoria, CrearCategoria, ActualizarCategoria, Autor, CrearAutor, ActualizarAutor } from '../types';

interface TiendaContextType {
  // Estado de datos
  libros: Libro[];
  categorias: Categoria[];
  autores: Autor[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Libros CRUD
  fetchLibros: () => Promise<void>;
  getLibroById: (id: number) => Libro | undefined;
  getLibrosByCategoria: (categoriaId: number) => Libro[];
  getLibrosByAutor: (autorId: number) => Libro[];
  crearLibro: (libro: CrearLibro) => Promise<Libro>;
  actualizarLibro: (libro: ActualizarLibro) => Promise<Libro>;
  eliminarLibro: (id: number) => Promise<boolean>;

  // Categorías CRUD
  fetchCategorias: () => Promise<void>;
  getCategoriaById: (id: number) => Categoria | undefined;
  crearCategoria: (categoria: CrearCategoria) => Promise<Categoria>;
  actualizarCategoria: (categoria: ActualizarCategoria) => Promise<Categoria>;
  eliminarCategoria: (id: number) => Promise<boolean>;

  // Autores CRUD
  fetchAutores: () => Promise<void>;
  getAutorById: (id: number) => Autor | undefined;
  crearAutor: (autor: CrearAutor) => Promise<Autor>;
  actualizarAutor: (autor: ActualizarAutor) => Promise<Autor>;
  eliminarAutor: (id: number) => Promise<boolean>;
}

const TiendaContext = createContext<TiendaContextType | undefined>(undefined);

interface TiendaProviderProps {
  children: ReactNode;
}

export const TiendaProvider = ({ children }: TiendaProviderProps) => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // ==================== LIBROS ====================

  // Fetch libros desde JSON (solo primera vez)
  const fetchLibros = useCallback(async () => {
    if (isInitialized && libros.length > 0) {
      return; // Ya tenemos los datos en contexto
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/data/libros.json');
      if (!response.ok) {
        throw new Error('Error al cargar libros');
      }
      const data: Libro[] = await response.json();
      setLibros(data);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching libros:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, libros.length]);

  // Obtener libro por ID (desde contexto)
  const getLibroById = useCallback((id: number): Libro | undefined => {
    return libros.find(l => l.libro_id === id);
  }, [libros]);

  // Obtener libros por categoría (desde contexto)
  const getLibrosByCategoria = useCallback((categoriaId: number): Libro[] => {
    return libros.filter(l => l.categoria_id === categoriaId);
  }, [libros]);

  // Obtener libros por autor (desde contexto)
  const getLibrosByAutor = useCallback((autorId: number): Libro[] => {
    return libros.filter(l => l.autor_id === autorId);
  }, [libros]);

  // Crear libro (simulado - actualiza contexto)
  const crearLibro = useCallback(async (libroData: CrearLibro): Promise<Libro> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generar nuevo ID
      const newId = libros.length > 0
        ? Math.max(...libros.map(l => l.libro_id)) + 1
        : 1;

      const newLibro: Libro = {
        libro_id: newId,
        subtitulo: libroData.subtitulo || null,
        portada_url: libroData.portada_url || null,
        ...libroData
      };

      // Actualizar contexto
      setLibros(prev => [...prev, newLibro]);

      return newLibro;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear libro';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [libros]);

  // Actualizar libro (simulado - actualiza contexto)
  const actualizarLibro = useCallback(async (libroData: ActualizarLibro): Promise<Libro> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      const existingLibro = libros.find(l => l.libro_id === libroData.libro_id);
      if (!existingLibro) {
        throw new Error('Libro no encontrado');
      }

      const updatedLibro: Libro = {
        ...existingLibro,
        ...libroData
      };

      // Actualizar contexto
      setLibros(prev =>
        prev.map(l => l.libro_id === libroData.libro_id ? updatedLibro : l)
      );

      return updatedLibro;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar libro';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [libros]);

  // Eliminar libro (simulado - actualiza contexto)
  const eliminarLibro = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));

      const exists = libros.some(l => l.libro_id === id);
      if (!exists) {
        throw new Error('Libro no encontrado');
      }

      // Actualizar contexto
      setLibros(prev => prev.filter(l => l.libro_id !== id));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar libro';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [libros]);

  // ==================== CATEGORÍAS ====================

  // Fetch categorías desde JSON (solo primera vez)
  const fetchCategorias = useCallback(async () => {
    if (categorias.length > 0) {
      return; // Ya tenemos las categorías en contexto
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/data/categorias.json');
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      const data: Categoria[] = await response.json();
      setCategorias(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching categorias:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categorias.length]);

  // Obtener categoría por ID (desde contexto)
  const getCategoriaById = useCallback((id: number): Categoria | undefined => {
    return categorias.find(c => c.categoria_id === id);
  }, [categorias]);

  // Crear categoría (simulado - actualiza contexto)
  const crearCategoria = useCallback(async (categoriaData: CrearCategoria): Promise<Categoria> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newId = categorias.length > 0
        ? Math.max(...categorias.map(c => c.categoria_id)) + 1
        : 1;

      const newCategoria: Categoria = {
        categoria_id: newId,
        icono: categoriaData.icono || null,
        imagen_url: categoriaData.imagen_url || null,
        ...categoriaData
      };

      setCategorias(prev => [...prev, newCategoria]);

      return newCategoria;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear categoría';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [categorias]);

  // Actualizar categoría (simulado - actualiza contexto)
  const actualizarCategoria = useCallback(async (categoriaData: ActualizarCategoria): Promise<Categoria> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const existingCategoria = categorias.find(c => c.categoria_id === categoriaData.categoria_id);
      if (!existingCategoria) {
        throw new Error('Categoría no encontrada');
      }

      const updatedCategoria: Categoria = {
        ...existingCategoria,
        ...categoriaData
      };

      setCategorias(prev =>
        prev.map(c => c.categoria_id === categoriaData.categoria_id ? updatedCategoria : c)
      );

      return updatedCategoria;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar categoría';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [categorias]);

  // Eliminar categoría (simulado - actualiza contexto)
  const eliminarCategoria = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const exists = categorias.some(c => c.categoria_id === id);
      if (!exists) {
        throw new Error('Categoría no encontrada');
      }

      setCategorias(prev => prev.filter(c => c.categoria_id !== id));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar categoría';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [categorias]);

  // ==================== AUTORES ====================

  // Fetch autores desde JSON (solo primera vez)
  const fetchAutores = useCallback(async () => {
    if (autores.length > 0) {
      return; // Ya tenemos los autores en contexto
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/data/autores.json');
      if (!response.ok) {
        throw new Error('Error al cargar autores');
      }
      const data: Autor[] = await response.json();
      setAutores(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching autores:', err);
    } finally {
      setIsLoading(false);
    }
  }, [autores.length]);

  // Obtener autor por ID (desde contexto)
  const getAutorById = useCallback((id: number): Autor | undefined => {
    return autores.find(a => a.autor_id === id);
  }, [autores]);

  // Crear autor (simulado - actualiza contexto)
  const crearAutor = useCallback(async (autorData: CrearAutor): Promise<Autor> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newId = autores.length > 0
        ? Math.max(...autores.map(a => a.autor_id)) + 1
        : 1;

      const newAutor: Autor = {
        autor_id: newId,
        fecha_nacimiento: autorData.fecha_nacimiento || null,
        foto_url: autorData.foto_url || null,
        ...autorData
      };

      setAutores(prev => [...prev, newAutor]);

      return newAutor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear autor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [autores]);

  // Actualizar autor (simulado - actualiza contexto)
  const actualizarAutor = useCallback(async (autorData: ActualizarAutor): Promise<Autor> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const existingAutor = autores.find(a => a.autor_id === autorData.autor_id);
      if (!existingAutor) {
        throw new Error('Autor no encontrado');
      }

      const updatedAutor: Autor = {
        ...existingAutor,
        ...autorData
      };

      setAutores(prev =>
        prev.map(a => a.autor_id === autorData.autor_id ? updatedAutor : a)
      );

      return updatedAutor;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar autor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [autores]);

  // Eliminar autor (simulado - actualiza contexto)
  const eliminarAutor = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const exists = autores.some(a => a.autor_id === id);
      if (!exists) {
        throw new Error('Autor no encontrado');
      }

      setAutores(prev => prev.filter(a => a.autor_id !== id));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar autor';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [autores]);

  // Auto-fetch inicial al montar el componente
  useEffect(() => {
    if (!isInitialized) {
      fetchLibros();
      fetchCategorias();
      fetchAutores();
    }
  }, [isInitialized, fetchLibros, fetchCategorias, fetchAutores]);

  const value: TiendaContextType = {
    // Estado
    libros,
    categorias,
    autores,
    isLoading,
    error,
    isInitialized,

    // Libros
    fetchLibros,
    getLibroById,
    getLibrosByCategoria,
    getLibrosByAutor,
    crearLibro,
    actualizarLibro,
    eliminarLibro,

    // Categorías
    fetchCategorias,
    getCategoriaById,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,

    // Autores
    fetchAutores,
    getAutorById,
    crearAutor,
    actualizarAutor,
    eliminarAutor
  };

  return (
    <TiendaContext.Provider value={value}>
      {children}
    </TiendaContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTienda = () => {
  const context = useContext(TiendaContext);
  if (context === undefined) {
    throw new Error('useTienda must be used within a TiendaProvider');
  }
  return context;
};
