import { useState, type MouseEvent } from "react";
import type { Book } from "../../types";
import { Badge } from "../atoms";
import { AddToCartButton, useCart } from "../../features/cart";
import { ShoppingCart, BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  author?: { name: string };
  category?: { name: string };
  coverUrl?: string | null;
}

// ==================== VARIANTE 1: Portada Protagonista con Hover Elegante ====================
export const BookCardVariant1 = ({
  book,
  author,
  category,
  coverUrl,
}: BookCardProps) => {
  return (
    <div className="group relative cursor-pointer">
      {/* Card principal con elevacion en hover */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2">
        {/* Imagen de portada con zoom en hover */}
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/40">
            <BookOpen size={64} className="text-primary/60" />
          </div>
        )}

        {/* Overlay que aparece en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-bold mb-1 line-clamp-2">
              {book.title}
            </h3>
            {author && (
              <p className="text-sm text-white/90 mb-2">{author.name}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                Bs. {book.price.toFixed(2)}
              </span>
              <Badge
                variant={
                  book.stock > 10
                    ? "success"
                    : book.stock > 0
                    ? "warning"
                    : "error"
                }
                size="sm"
              >
                {book.stock > 0 ? `${book.stock}` : "Agotado"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Badge de categoria siempre visible */}
        {category && (
          <div className="absolute top-2 left-2 z-10">
            <Badge
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              {category.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Boton integrado debajo, visible en hover */}
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <AddToCartButton
          book={book}
          className="w-full"
          disabled={book.stock === 0}
        />
      </div>
    </div>
  );
};

// ==================== VARIANTE 2: Card Flotante con FAB ====================
export const BookCardVariant2 = ({
  book,
  author,
  category,
  coverUrl,
}: BookCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (book.stock === 0 || isAdding) return;
    setIsAdding(true);
    addToCart(book, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group relative cursor-pointer">
      {/* Card con borde y sombra */}
      <div className="relative aspect-[3/4] overflow-hidden border-2 border-gray-200 bg-white transition-all duration-300 group-hover:border-primary group-hover:shadow-xl group-hover:scale-105">
        {/* Imagen de portada */}
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <BookOpen size={64} className="text-gray-400" />
          </div>
        )}

        {/* Badge de precio flotante */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <span className="text-primary font-bold text-sm">
            Bs. {book.price.toFixed(2)}
          </span>
        </div>

        {/* Badge de categoria con mejor contraste */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              {category.name}
            </span>
          </div>
        )}

        {/* Titulo siempre visible en la parte inferior con degradado verde suave */}
        <div
          className="absolute bottom-0 left-0 right-0 pt-12 pb-3 px-4 transition-all duration-300 group-hover:pb-6 group-hover:pt-20"
          style={{
            background:
              "linear-gradient(to top, rgb(45, 80, 22) 0%, rgba(45, 80, 22, 0.85) 15%, rgba(45, 80, 22, 0.6) 30%, rgba(45, 80, 22, 0.35) 45%, rgba(45, 80, 22, 0.15) 60%, rgba(45, 80, 22, 0.05) 75%, transparent 100%)",
          }}
        >
          <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight mb-1">
            {book.title}
          </h3>
          {author && (
            <p className="text-white/90 text-xs line-clamp-1">{author.name}</p>
          )}
        </div>

        {/* FAB (Floating Action Button) que aparece en hover */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            className="w-12 h-12 rounded-full bg-white text-primary border-2 border-primary shadow-lg hover:bg-primary hover:text-white hover:scale-110 transition-all duration-200 flex items-center justify-center disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={book.stock === 0 || isAdding}
          >
            {isAdding ? (
              <span className="text-xs font-semibold">Agregado</span>
            ) : (
              <ShoppingCart size={24} />
            )}
          </button>
        </div>

        {/* Info adicional que aparece en hover (stock) */}
        <div className="absolute bottom-20 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Badge
            variant={
              book.stock > 10 ? "success" : book.stock > 0 ? "warning" : "error"
            }
            size="sm"
          >
            Stock: {book.stock}
          </Badge>
        </div>
      </div>
    </div>
  );
};

// ==================== VARIANTE 3: Overlay Deslizante ====================
export const BookCardVariant3 = ({
  book,
  author,
  category,
  coverUrl,
}: BookCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (book.stock === 0 || isAdding) return;
    setIsAdding(true);
    addToCart(book, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group relative cursor-pointer">
      {/* Card limpio sin overlay inicial */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-2xl">
        {/* Imagen de portada con filtro sutil en hover */}
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/50">
            <BookOpen size={64} className="text-primary" />
          </div>
        )}

        {/* Badges superiores siempre visibles */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {category && (
            <Badge
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              {category.name}
            </Badge>
          )}
          <Badge
            variant={
              book.stock > 10 ? "success" : book.stock > 0 ? "warning" : "error"
            }
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
          >
            {book.stock}
          </Badge>
        </div>

        {/* Overlay que desliza desde abajo en hover */}
        <div className="absolute inset-x-0 bottom-0 bg-primary/95 backdrop-blur-md text-white p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold mb-1 line-clamp-2">
                {book.title}
              </h3>
              {author && <p className="text-white/90 text-sm">{author.name}</p>}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                Bs. {book.price.toFixed(2)}
              </span>
            </div>

            {/* Boton integrado en el overlay */}
            <button
              className="w-full bg-white text-primary font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={book.stock === 0 || isAdding}
              onClick={handleAddToCart}
            >
              {book.stock === 0
                ? "Agotado"
                : isAdding
                ? "Agregado"
                : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== VARIANTE 4: Minimalista Premium ====================
export const BookCardVariant4 = ({
  book,
  author,
  category,
  coverUrl,
}: BookCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (book.stock === 0 || isAdding) return;
    setIsAdding(true);
    addToCart(book, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group cursor-pointer">
      {/* Contenedor con padding para simular marco */}
      <div className="bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 group-hover:shadow-xl">
        {/* Portada con marco elegante */}
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-4">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <BookOpen size={56} className="text-gray-400" />
            </div>
          )}

          {/* Badge de categoria con estilo minimalista */}
          {category && (
            <div className="absolute top-2 left-2">
              <span className="text-xs font-medium text-gray-700 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
                {category.name}
              </span>
            </div>
          )}

          {/* Indicador de stock sutil */}
          <div className="absolute top-2 right-2">
            <div
              className={`w-2 h-2 rounded-full ${
                book.stock > 10
                  ? "bg-success"
                  : book.stock > 0
                  ? "bg-warning"
                  : "bg-error"
              }`}
            />
          </div>
        </div>

        {/* Footer siempre visible */}
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            {author && (
              <p className="text-xs text-gray-500 mt-1">{author.name}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              Bs. {book.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">Stock: {book.stock}</span>
          </div>

          {/* Boton que cambia en hover */}
          <button
            className="w-full py-2 rounded-lg font-medium text-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50
                       bg-gray-100 text-gray-700 group-hover:bg-primary group-hover:text-white"
            disabled={book.stock === 0 || isAdding}
            onClick={handleAddToCart}
          >
            <span className="group-hover:hidden">
              {book.stock === 0 ? "Agotado" : isAdding ? "Agregado" : "Ver detalles"}
            </span>
            <span className="hidden group-hover:inline">
              {book.stock === 0
                ? "Sin stock"
                : isAdding
                ? "Agregado"
                : "Agregar al carrito"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
