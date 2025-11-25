import type { Author, Category, Book } from "../types";

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
  limit: number = 100
): Promise<StoredData & { seeded: boolean }> => {
  const existing = readStoredData();
  if (existing.books.length > 0) {
    return { ...existing, seeded: false };
  }

  const [books, categories, authors] = await Promise.all([
    fetch("/data/books.seed.json").then((res) => res.json() as Promise<Book[]>),
    fetch("/data/categories.seed.json").then(
      (res) => res.json() as Promise<Category[]>
    ),
    fetch("/data/authors.seed.json").then(
      (res) => res.json() as Promise<Author[]>
    ),
  ]);

  const trimmedBooks = books.slice(0, limit);
  const seeded: StoredData = {
    books: trimmedBooks,
    categories,
    authors,
  };

  persistStoredData(seeded);
  return { ...seeded, seeded: true };
};

export const refreshFromStorage = (): StoredData => readStoredData();
