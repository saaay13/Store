import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type {
  Book,
  CreateBook,
  UpdateBook,
  Category,
  CreateCategory,
  UpdateCategory,
  Author,
  CreateAuthor,
  UpdateAuthor,
  BookStatus,
} from "../types";
import {
  seedBooksIfEmpty,
  persistStoredData,
  refreshFromStorage,
} from "../services/booksStorage";

const normalizeCategory = (category: Partial<Category>): Category => ({
  categoryId: category.categoryId ?? 0,
  name: category.name ?? "",
  description: category.description ?? "",
  icon: category.icon ?? null,
  imageUrl: category.imageUrl ?? null,
});

const normalizeBook = (book: Partial<Book>): Book => ({
  bookId: book.bookId ?? 0,
  isbn: book.isbn ?? "",
  title: book.title ?? "",
  subtitle: book.subtitle ?? null,
  synopsis: book.synopsis ?? "",
  authorId: book.authorId ?? 0,
  publisherName: book.publisherName ?? "",
  categoryId: book.categoryId ?? 0,
  publicationYear: book.publicationYear ?? 0,
  language: book.language ?? "Español",
  pageCount: book.pageCount ?? 0,
  format: book.format ?? "",
  price: book.price ?? 0,
  stock: book.stock ?? 0,
  coverUrl: book.coverUrl ?? null,
  status: book.status ?? "disponible",
  author: book.author,
  category: book.category,
});

const withLegacyAuthorFields = (author: Author): Author => ({
  ...author,
  autor_id: author.authorId,
  nombre: author.name,
  biografia: author.biography,
  nacionalidad: author.nationality,
  fecha_nacimiento: author.birthDate ?? null,
  foto_url: author.photoUrl ?? null,
});

interface StoreContextType {
  // Data state
  books: Book[];
  categories: Category[];
  authors: Author[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Books CRUD
  fetchBooks: () => Promise<void>;
  getBookById: (id: number) => Book | undefined;
  getBooksByCategory: (categoryId: number) => Book[];
  getBooksByAuthor: (authorId: number) => Book[];
  createBook: (book: CreateBook) => Promise<Book>;
  updateBook: (book: UpdateBook) => Promise<Book>;
  deleteBook: (id: number) => Promise<boolean>;

  // Categories CRUD
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: number) => Category | undefined;
  createCategory: (category: CreateCategory) => Promise<Category>;
  updateCategory: (category: UpdateCategory) => Promise<Category>;
  deleteCategory: (id: number) => Promise<boolean>;

  // Authors CRUD
  fetchAuthors: () => Promise<void>;
  getAuthorById: (id: number) => Author | undefined;
  createAuthor: (author: CreateAuthor) => Promise<Author>;
  updateAuthor: (author: UpdateAuthor) => Promise<Author>;
  deleteAuthor: (id: number) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const persistAll = useCallback(
    (
      nextBooks: Book[] = books,
      nextCategories: Category[] = categories,
      nextAuthors: Author[] = authors
    ) => {
      persistStoredData({
        books: nextBooks,
        categories: nextCategories,
        authors: nextAuthors,
      });
    },
    [books, categories, authors]
  );

  // ==================== BOOKS ====================

  // Fetch books (only the first time)
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await seedBooksIfEmpty(40);
      const nextBooks = data.books.map(normalizeBook);
      const nextCategories = data.categories.map(normalizeCategory);
      const nextAuthors = data.authors.map(withLegacyAuthorFields);
      setBooks(nextBooks);
      setCategories(nextCategories);
      setAuthors(nextAuthors);
      persistStoredData({
        books: nextBooks,
        categories: nextCategories,
        authors: nextAuthors,
      });
      setIsInitialized(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error fetching books:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBookById = useCallback(
    (id: number): Book | undefined => {
      return books.find(
        (book) => book.bookId === id || book.libro_id === id
      );
    },
    [books]
  );

  const getBooksByCategory = useCallback(
    (categoryId: number): Book[] => {
      return books.filter((book) => book.categoryId === categoryId);
    },
    [books]
  );

  const getBooksByAuthor = useCallback(
    (authorId: number): Book[] => {
      return books.filter(
        (book) => book.authorId === authorId || book.autor_id === authorId
      );
    },
    [books]
  );

  const createBook = useCallback(
    async (bookData: CreateBook): Promise<Book> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newId =
          books.length > 0 ? Math.max(...books.map((l) => l.bookId)) + 1 : 1;

        const newBook: Book = normalizeBook({
          bookId: newId,
          subtitle: bookData.subtitle || null,
          coverUrl: bookData.coverUrl || null,
          ...bookData,
        });

        const updatedBooks = [...books, newBook];
        setBooks(updatedBooks);
        persistAll(updatedBooks);

        return newBook;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear libro";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [books, persistAll]
  );

  const updateBook = useCallback(
    async (bookData: UpdateBook): Promise<Book> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const existingBook = books.find((book) => book.bookId === bookData.bookId);
        if (!existingBook) {
          throw new Error("Libro no encontrado");
        }

        const updatedBook: Book = normalizeBook({
          ...existingBook,
          ...bookData,
        });

        const updatedBooks = books.map((book) =>
          book.bookId === bookData.bookId ? updatedBook : book
        );
        setBooks(updatedBooks);
        persistAll(updatedBooks);

        return updatedBook;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar libro";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [books, persistAll]
  );

  const deleteBook = useCallback(
    async (id: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const exists = books.some((book) => book.bookId === id);
        if (!exists) {
          throw new Error("Libro no encontrado");
        }

        const updatedBooks = books.filter((book) => book.bookId !== id);
        setBooks(updatedBooks);
        persistAll(updatedBooks);

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al eliminar libro";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [books, persistAll]
  );

  // ==================== CATEGORIES ====================

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = refreshFromStorage();
      const nextCategories = data.categories.map(normalizeCategory);
      const nextBooks = data.books.map(normalizeBook);
      const nextAuthors = data.authors.map(withLegacyAuthorFields);
      setCategories(nextCategories);
      if (data.books.length > 0) {
        setBooks(nextBooks);
      }
      if (data.authors.length > 0) {
        setAuthors(nextAuthors);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCategoryById = useCallback(
    (id: number): Category | undefined => {
      return categories.find((category) => category.categoryId === id);
    },
    [categories]
  );

  const createCategory = useCallback(
    async (categoryData: CreateCategory): Promise<Category> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newId =
          categories.length > 0
            ? Math.max(...categories.map((c) => c.categoryId)) + 1
            : 1;

        const newCategory: Category = normalizeCategory({
          categoryId: newId,
          icon: categoryData.icon || null,
          imageUrl: categoryData.imageUrl || null,
          ...categoryData,
        });

        const updatedCategories = [...categories, newCategory];
        setCategories(updatedCategories);
        persistAll(books, updatedCategories, authors);

        return newCategory;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear categoría";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authors, categories, books, persistAll]
  );

  const updateCategory = useCallback(
    async (categoryData: UpdateCategory): Promise<Category> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const targetId = categoryData.categoryId;

        const existingCategory = categories.find(
          (category) => category.categoryId === targetId
        );
        if (!existingCategory) {
          throw new Error("Categoría no encontrada");
        }

        const updatedCategory: Category = normalizeCategory({
          ...existingCategory,
          ...categoryData,
        });

        const updatedCategories = categories.map((category) =>
          category.categoryId === targetId ? updatedCategory : category
        );

        setCategories(updatedCategories);
        persistAll(books, updatedCategories, authors);

        return updatedCategory;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar categoría";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authors, categories, books, persistAll]
  );

  const deleteCategory = useCallback(
    async (id: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const exists = categories.some((category) => category.categoryId === id);
        if (!exists) {
          throw new Error("Categoría no encontrada");
        }

        const updatedCategories = categories.filter(
          (category) => category.categoryId !== id
        );
        setCategories(updatedCategories);
        persistAll(books, updatedCategories, authors);

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al eliminar categoría";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authors, categories, books, persistAll]
  );

  // ==================== AUTHORS ====================

  const fetchAuthors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = refreshFromStorage();
      const nextAuthors = data.authors.map(withLegacyAuthorFields);
      const nextBooks = data.books.map(normalizeBook);
      const nextCategories = data.categories.map(normalizeCategory);
      setAuthors(nextAuthors);
      if (data.books.length > 0) {
        setBooks(nextBooks);
      }
      if (data.categories.length > 0) {
        setCategories(nextCategories);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      console.error("Error fetching authors:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAuthorById = useCallback(
    (id: number): Author | undefined => {
      return authors.find(
        (author) => author.authorId === id || author.autor_id === id
      );
    },
    [authors]
  );

  const createAuthor = useCallback(
    async (authorData: CreateAuthor): Promise<Author> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newId =
          authors.length > 0
            ? Math.max(...authors.map((author) => author.authorId)) + 1
            : 1;

        const newAuthor: Author = withLegacyAuthorFields({
          authorId: newId,
          birthDate: authorData.birthDate || null,
          photoUrl: authorData.photoUrl || null,
          ...authorData,
        });

        const updatedAuthors = [...authors, newAuthor];
        setAuthors(updatedAuthors);
        persistAll(books, categories, updatedAuthors);

        return newAuthor;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al crear autor";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authors, categories, books, persistAll]
  );

  const updateAuthor = useCallback(
    async (authorData: UpdateAuthor): Promise<Author> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const existingAuthor = authors.find(
          (author) => author.authorId === authorData.authorId
        );
        if (!existingAuthor) {
          throw new Error("Autor no encontrado");
        }

        const updatedAuthor: Author = withLegacyAuthorFields({
          ...existingAuthor,
          ...authorData,
        });

        const updatedAuthors = authors.map((author) =>
          author.authorId === authorData.authorId ? updatedAuthor : author
        );
        setAuthors(updatedAuthors);
        persistAll(books, categories, updatedAuthors);

        return updatedAuthor;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar autor";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authors, categories, books, persistAll]
  );

  const deleteAuthor = useCallback(
    async (id: number): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const exists = authors.some((author) => author.authorId === id);
        if (!exists) {
          throw new Error("Autor no encontrado");
        }

        const updatedAuthors = authors.filter((author) => author.authorId !== id);
        setAuthors(updatedAuthors);
        persistAll(books, categories, updatedAuthors);

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al eliminar autor";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authors, categories, books, persistAll]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (!isInitialized) {
      fetchBooks();
    }
  }, [fetchBooks, isInitialized]);

  const value: StoreContextType = {
    books,
    categories,
    authors,
    isLoading,
    error,
    isInitialized,
    fetchBooks,
    getBookById,
    getBooksByCategory,
    getBooksByAuthor,
    createBook,
    updateBook,
    deleteBook,
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
