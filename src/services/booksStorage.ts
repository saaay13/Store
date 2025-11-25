import type { Author, Category, Book } from "../types";
import { fetchGoogleBooks, mapGoogleVolumesToDomain } from "./googleBooks";

const STORAGE_KEYS = {
  books: "store_books",
  categories: "store_categories",
  authors: "store_authors",
};

export interface StoredData {
  books: Book[];
  categories: Category[];
  authors: Author[];
}

const hasLocalStorage = (): boolean =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";

const safeParseArray = <T>(value: string | null): T[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const reviveAuthorDates = (authors: Author[]): Author[] =>
  authors.map((author) => ({
    ...author,
    birthDate: author.birthDate ? new Date(author.birthDate) : null,
  }));

export const readStoredData = (): StoredData => {
  if (!hasLocalStorage()) {
    return { books: [], categories: [], authors: [] };
  }

  // Nota: mantenemos estos removeItem comentados para poder reactivarlos en pruebas de reseteo sin perder persistencia en uso normal.
  // localStorage.removeItem(STORAGE_KEYS.books);
  // localStorage.removeItem(STORAGE_KEYS.categories);
  // localStorage.removeItem(STORAGE_KEYS.authors);

  const books = safeParseArray<Book>(localStorage.getItem(STORAGE_KEYS.books));
  const categories = safeParseArray<Category>(
    localStorage.getItem(STORAGE_KEYS.categories)
  );
  const authorsRaw = safeParseArray<Author>(
    localStorage.getItem(STORAGE_KEYS.authors)
  );

  return {
    books,
    categories,
    authors: reviveAuthorDates(authorsRaw),
  };
};

export const persistStoredData = (data: StoredData) => {
  if (!hasLocalStorage()) return;

  localStorage.setItem(STORAGE_KEYS.books, JSON.stringify(data.books));
  localStorage.setItem(
    STORAGE_KEYS.categories,
    JSON.stringify(data.categories)
  );
  localStorage.setItem(STORAGE_KEYS.authors, JSON.stringify(data.authors));
};

export const seedBooksIfEmpty = async (
  limit: number = 40
): Promise<StoredData & { seeded: boolean }> => {
  const existing = readStoredData();
  if (existing.books.length > 0) {
    return { ...existing, seeded: false };
  }

  // Si se requieren más de 20, hacemos paginación en lotes de 20
  const batches = Math.ceil(limit / 20);
  const volumes = [];

  for (let i = 0; i < batches; i += 1) {
    const batch = await fetchGoogleBooks(20, {
      language: "es",
      subject: "ficcion",
      startIndex: i * 20,
    });
    volumes.push(...batch);
  }

  const trimmed = volumes.slice(0, limit);
  const mapped = mapGoogleVolumesToDomain(trimmed);
  persistStoredData(mapped);

  return { ...mapped, seeded: true };
};

export const refreshFromStorage = (): StoredData => readStoredData();
