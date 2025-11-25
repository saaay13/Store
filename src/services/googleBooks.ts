import type { Book, Author, Category } from "../types";

// Tipos parciales basados en la respuesta de Google Books
interface GoogleIndustryIdentifier {
  type?: string;
  identifier?: string;
}

interface GoogleImageLinks {
  thumbnail?: string;
  smallThumbnail?: string;
}

interface GoogleVolumeInfo {
  title?: string;
  subtitle?: string;
  authors?: string[];
  categories?: string[];
  description?: string;
  publisher?: string;
  publishedDate?: string;
  pageCount?: number;
  printType?: string;
  language?: string;
  industryIdentifiers?: GoogleIndustryIdentifier[];
  imageLinks?: GoogleImageLinks;
}

export interface GoogleBookVolume {
  id: string;
  volumeInfo?: GoogleVolumeInfo;
}

export interface SeededData {
  books: Book[];
  authors: Author[];
  categories: Category[];
  seeded: boolean;
}

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";

const pickIsbn = (identifiers?: GoogleIndustryIdentifier[]): string => {
  if (!identifiers || identifiers.length === 0) {
    return crypto.randomUUID();
  }

  const isbn13 = identifiers.find((id) => id.type === "ISBN_13")?.identifier;
  if (isbn13) return isbn13;

  const isbn10 = identifiers.find((id) => id.type === "ISBN_10")?.identifier;
  if (isbn10) return isbn10;

  return identifiers[0]?.identifier ?? crypto.randomUUID();
};

const mapLanguage = (language?: string): string => {
  if (!language) return "Español";
  const lang = language.toLowerCase();
  if (lang === "es") return "Español";
  if (lang === "en") return "Inglés";
  if (lang === "fr") return "Francés";
  if (lang === "de") return "Alemán";
  if (lang === "it") return "Italiano";
  if (lang === "pt") return "Portugués";
  return language;
};

const pickYear = (publishedDate?: string): number => {
  if (!publishedDate) return 2000;
  const match = publishedDate.match(/\d{4}/);
  if (!match) return 2000;
  const year = Number.parseInt(match[0], 10);
  return Number.isNaN(year) ? 2000 : year;
};

const pickFormat = (printType?: string): string => {
  if (!printType) return "Tapa blanda";
  return printType.toUpperCase() === "BOOK" ? "Tapa blanda" : "eBook";
};

const pickPrice = (): number => {
  const min = 9.99;
  const max = 59.99;
  const price = Math.random() * (max - min) + min;
  return Number(price.toFixed(2));
};

const pickStock = (): number => {
  const min = 5;
  const max = 35;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const ensureAuthor = (name: string, authors: Map<string, Author>): Author => {
  if (authors.has(name)) {
    return authors.get(name)!;
  }

  const author: Author = {
    authorId: authors.size + 1,
    name,
    biography: "",
    nationality: "Desconocida",
    birthDate: null,
    photoUrl: null,
    autor_id: authors.size + 1,
    nombre: name,
    biografia: "",
    nacionalidad: "Desconocida",
    fecha_nacimiento: null,
    foto_url: null,
  };

  authors.set(name, author);
  return author;
};

const ensureCategoria = (
  name: string,
  categories: Map<string, Category>
): Category => {
  if (categories.has(name)) {
    return categories.get(name)!;
  }

  const category: Category = {
    categoryId: categories.size + 1,
    name,
    description: name,
    icon: null,
    imageUrl: null,
  };

  categories.set(name, category);
  return category;
};

export const mapGoogleVolumesToDomain = (
  volumes: GoogleBookVolume[]
): SeededData => {
  const authors = new Map<string, Author>();
  const categories = new Map<string, Category>();
  const books: Book[] = [];

  volumes.forEach((volume, index) => {
    const info = volume.volumeInfo ?? {};
    const title = info.title ?? "Título desconocido";
    const authorName = info.authors?.[0] ?? "Autor desconocido";
    const categoryName = info.categories?.[0] ?? "General";

    const author = ensureAuthor(authorName, authors);
    const category = ensureCategoria(categoryName, categories);

    const book: Book = {
      bookId: index + 1,
      isbn: pickIsbn(info.industryIdentifiers),
      title,
      subtitle: info.subtitle ?? null,
      synopsis: info.description ?? "Sin sinopsis disponible",
      authorId: author.authorId,
      publisherName: info.publisher ?? "Editorial desconocida",
      categoryId: category.categoryId,
      publicationYear: pickYear(info.publishedDate),
      language: mapLanguage(info.language),
      pageCount: info.pageCount ?? 220,
      format: pickFormat(info.printType),
      price: pickPrice(),
      stock: pickStock(),
      coverUrl:
        info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null,
      status: "disponible",
    };

    books.push(book);
  });

  return {
    books,
    authors: Array.from(authors.values()),
    categories: Array.from(categories.values()),
    seeded: true,
  };
};

interface FetchBooksOptions {
  limit?: number;
  language?: string; // ISO 639-1 (es, en, fr, etc.)
  subject?: string; // tema para la query (fiction, tecnologia, fantasia, etc.)
  startIndex?: number; // paginación para traer más de 20
}

export const fetchGoogleBooks = async (
  limit: number = 40,
  options: FetchBooksOptions = {}
): Promise<GoogleBookVolume[]> => {
  const maxResults = Math.min(Math.max(limit, 1), 40); // Google Books API permite hasta 40
  const langRestrict = options.language ?? "es";
  const subject = options.subject ?? "fiction";
  const query = encodeURIComponent(`subject:${subject}`);
  const startIndex = options.startIndex ?? 0;
  const url = `${GOOGLE_BOOKS_URL}?q=${query}&maxResults=${maxResults}&langRestrict=${langRestrict}&startIndex=${startIndex}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo obtener datos de Google Books");
  }

  const data = await response.json();
  const items: GoogleBookVolume[] = Array.isArray(data.items) ? data.items : [];
  return items;
};
