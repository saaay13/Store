/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";

const GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes";
const TOTAL_BOOKS = 100;
const SUBJECTS = ["ficcion", "novela", "fantasia"];
const CATEGORY_TRANSLATIONS = new Map([
  ["fiction", "Ficci\u00f3n"],
  ["ficcion", "Ficci\u00f3n"],
  ["novel", "Novela"],
  ["novela", "Novela"],
  ["juvenile nonfiction", "No ficci\u00f3n juvenil"],
  ["children's stories, spanish", "Cuentos infantiles en espa\u00f1ol"],
  ["arithmetic", "Aritm\u00e9tica"],
  ["travel", "Viajes"],
  ["biography & autobiography", "Biograf\u00eda y autobiograf\u00eda"],
  ["brainwashing", "Lavado de cerebro"],
  ["general", "General"],
  ["brazil", "Brasil"],
  ["cuban fiction", "Ficci\u00f3n cubana"],
  ["armageddon", "Armaged\u00f3n"],
  ["education", "Educaci\u00f3n"],
  ["spanish fiction", "Ficci\u00f3n en espa\u00f1ol"],
  ["humor", "Humor"],
  ["navarra", "Navarra"],
]);

const normalizeCategoryName = (rawName) => {
  const base = rawName?.trim() || "General";
  const cleaned = base.replace(/^[.\\-\\s]+/, "");
  const translated =
    CATEGORY_TRANSLATIONS.get(cleaned.toLowerCase()) ?? cleaned;
  return translated;
};

const fetchBatch = async (subject, startIndex, maxResults) => {
  const url = `${GOOGLE_BOOKS_URL}?q=subject:${encodeURIComponent(
    subject
  )}&langRestrict=es&maxResults=${maxResults}&startIndex=${startIndex}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Books request failed (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
};

const ensureAuthor = (name, authors) => {
  if (authors.has(name)) {
    return authors.get(name);
  }

  const author = {
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

const ensureCategory = (name, categories) => {
  if (categories.has(name)) {
    return categories.get(name);
  }

  const category = {
    categoryId: categories.size + 1,
    name,
    description: name,
    icon: null,
    imageUrl: null,
  };

  categories.set(name, category);
  return category;
};

const pickIsbn = (identifiers) => {
  if (!identifiers || identifiers.length === 0) {
    return crypto.randomUUID();
  }
  const isbn13 = identifiers.find((id) => id.type === "ISBN_13")?.identifier;
  if (isbn13) return isbn13;
  const isbn10 = identifiers.find((id) => id.type === "ISBN_10")?.identifier;
  if (isbn10) return isbn10;
  return identifiers[0]?.identifier ?? crypto.randomUUID();
};

const mapLanguage = (language) => {
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

const pickYear = (publishedDate) => {
  if (!publishedDate) return 2000;
  const match = publishedDate.match(/\d{4}/);
  if (!match) return 2000;
  const year = Number.parseInt(match[0], 10);
  return Number.isNaN(year) ? 2000 : year;
};

const pickFormat = (printType) => {
  if (!printType) return "Tapa blanda";
  return printType.toUpperCase() === "BOOK" ? "Tapa blanda" : "eBook";
};

const pickPrice = () => {
  const min = 9.99;
  const max = 59.99;
  const price = Math.random() * (max - min) + min;
  return Number(price.toFixed(2));
};

const pickStock = () => {
  const min = 5;
  const max = 35;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const collectVolumes = async () => {
  const seen = new Map();
  const maxResults = 40;
  const pagesPerSubject = 5; // up to 200 results per subject if needed

  for (const subject of SUBJECTS) {
    for (let page = 0; page < pagesPerSubject; page += 1) {
      const startIndex = page * maxResults;
      const batch = await fetchBatch(subject, startIndex, maxResults);

      batch.forEach((item) => {
        const cover =
          item?.volumeInfo?.imageLinks?.thumbnail ||
          item?.volumeInfo?.imageLinks?.smallThumbnail;
        if (!cover) return; // descartar libros sin portada
        seen.set(item.id, item);
      });

      if (seen.size >= TOTAL_BOOKS) {
        return Array.from(seen.values()).slice(0, TOTAL_BOOKS);
      }
    }
  }

  return Array.from(seen.values()).slice(0, TOTAL_BOOKS);
};

const main = async () => {
  const volumes = await collectVolumes();
  if (volumes.length < TOTAL_BOOKS) {
    throw new Error(`Only fetched ${volumes.length} volumes from Google Books`);
  }

  const authors = new Map();
  const categories = new Map();
  const books = [];

  volumes.forEach((volume) => {
    const info = volume?.volumeInfo ?? {};
    const authorName = info.authors?.[0]?.trim() || "Autor desconocido";
    const categoryName = normalizeCategoryName(info.categories?.[0]);

    const author = ensureAuthor(authorName, authors);
    const category = ensureCategory(categoryName, categories);

    const price = pickPrice();
    const stock = pickStock();
    const pageCount = info.pageCount ?? 220;
    const format = pickFormat(info.printType);
    const year = pickYear(info.publishedDate);
    const language = mapLanguage(info.language);
    const publisher = info.publisher ?? "Editorial desconocida";
    const title = info.title ?? "T\u00edtulo desconocido";
    const subtitle = info.subtitle ?? null;
    const synopsis = info.description ?? "Sin sinopsis disponible";
    const cover =
      info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null;

    const book = {
      bookId: books.length + 1,
      isbn: pickIsbn(info.industryIdentifiers),
      title,
      subtitle,
      synopsis,
      authorId: author.authorId,
      publisherName: publisher,
      categoryId: category.categoryId,
      publicationYear: year,
      language,
      pageCount,
      format,
      price,
      stock,
      coverUrl: cover,
      status: "disponible",
      // Legacy Spanish keys for compatibility
      libro_id: books.length + 1,
      titulo: title,
      subtitulo: subtitle,
      sinopsis: synopsis,
      autor_id: author.authorId,
      nombre_editorial: publisher,
      a\u00f1o_publicacion: year,
      idioma: language,
      num_paginas: pageCount,
      formato: format,
      precio_venta: price,
      stock_actual: stock,
      portada_url: cover,
      estado: "disponible",
    };

    books.push(book);
  });

  const outputDir = path.join(process.cwd(), "public", "data");
  fs.mkdirSync(outputDir, { recursive: true });

  const authorsPath = path.join(outputDir, "authors.seed.json");
  const categoriesPath = path.join(outputDir, "categories.seed.json");
  const booksPath = path.join(outputDir, "books.seed.json");

  fs.writeFileSync(
    authorsPath,
    JSON.stringify(Array.from(authors.values()), null, 2),
    "utf8"
  );
  fs.writeFileSync(
    categoriesPath,
    JSON.stringify(Array.from(categories.values()), null, 2),
    "utf8"
  );
  fs.writeFileSync(booksPath, JSON.stringify(books, null, 2), "utf8");

  console.log(
    `Seed data written to ${authorsPath} (${authors.size} autores), ${categoriesPath} (${categories.size} categorías) and ${booksPath} (${books.length} libros)`
  );
};

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
