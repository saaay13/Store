import { useState } from "react";
import { Badge, Spinner } from "../components/atoms";
import {
  BookCardVariant1,
  BookCardVariant2,
  BookCardVariant3,
  BookCardVariant4,
} from "../components/organisms";
import { useStore } from "../contexts/StoreContext";

const ProductsPage = () => {
  const {
    books,
    categories,
    isLoading,
    error,
    getCategoryById,
    getAuthorById,
  } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Filtrar libros por categoría si hay una seleccionada
  const filteredBooks = selectedCategory
    ? books.filter((book) => book.categoryId === selectedCategory)
    : books;

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Libros</h1>
        <Badge variant="primary">{filteredBooks.length} libros</Badge>
      </div>

      {/* Filtro por categoría */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            onClick={() => setSelectedCategory(category.categoryId)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.categoryId
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Grid de libros */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay libros disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book) => {
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
    </div>
  );
};

export default ProductsPage;
