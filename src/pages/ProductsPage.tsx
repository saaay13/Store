import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Spinner } from "../components/atoms";
import { SearchBar, Pagination } from "../components/molecules";
import { BookCardVariant2 } from "../components/organisms";
import { useStore } from "../contexts/StoreContext";

const ProductsPage = () => {
  const {
    books,
    categories,
    authors,
    isLoading,
    error,
    getCategoryById,
    getAuthorById,
  } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const normalize = (value?: string | null) =>
    (value ?? "").toLowerCase().trim();

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const normalizedQuery = normalize(searchQuery);
      const categoryMatch =
        !selectedCategory || book.categoryId?.toString() === selectedCategory;
      const authorMatch =
        !selectedAuthor ||
        (book.authorId ?? book.autor_id)?.toString() === selectedAuthor;

      if (!normalizedQuery) {
        return categoryMatch && authorMatch;
      }

      const authorId = book.authorId ?? book.autor_id;
      const authorName = authorId ? getAuthorById(authorId)?.name ?? "" : "";
      const categoryName = getCategoryById(book.categoryId)?.name ?? "";
      const haystack = [
        normalize(book.title ?? book.titulo),
        normalize(book.isbn),
        normalize(authorName),
        normalize(categoryName),
      ].join(" ");

      return categoryMatch && authorMatch && haystack.includes(normalizedQuery);
    });
  }, [books, searchQuery, selectedCategory, selectedAuthor, getAuthorById, getCategoryById]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / itemsPerPage)
  );

  const paginatedBooks = useMemo(
    () =>
      filteredBooks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredBooks, currentPage]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearch = useCallback(
    (query: string, filters: Record<string, any>) => {
      setSearchQuery(query);
      setSelectedCategory(filters.category || "");
      setSelectedAuthor(filters.author || "");
      setCurrentPage(1);
    },
    []
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Libros</h1>
        <Badge variant="primary">{filteredBooks.length} libros</Badge>
      </div>

      <SearchBar
        placeholder="Buscar por título, ISBN o autor..."
        filters={[
          {
            key: "category",
            label: "Categoría",
            options: [
              { value: "", label: "Todas las categorías" },
              ...categories.map((cat) => ({
                value: cat.categoryId.toString(),
                label: cat.name,
              })),
            ],
          },
          {
            key: "author",
            label: "Autor",
            options: [
              { value: "", label: "Todos los autores" },
              ...authors.map((author) => ({
                value: author.authorId.toString(),
                label: author.name,
              })),
            ],
          },
        ]}
        onSearch={handleSearch}
      />

      {/* Grid de libros */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay libros disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {paginatedBooks.map((book) => {
            const categoryId = book.categoryId;
            const categoria = categoryId
              ? getCategoryById(categoryId)
              : undefined;
            const authorId = book.authorId ?? book.autor_id;
            const author = authorId ? getAuthorById(authorId) : undefined;
            const coverUrl = book.coverUrl ?? book.portada_url;

            return (
              <BookCardVariant2
                key={book.bookId}
                book={book}
                author={author}
                category={categoria}
                coverUrl={coverUrl}
              />
            );
          })}
        </div>
      )}

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredBooks.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProductsPage;
