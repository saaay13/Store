import { useState } from 'react';
import { Card, Badge, Spinner } from '../components/atoms';
import { AddToCartButton } from '../features/cart';
import { useTienda } from '../contexts/TiendaContext';

const ProductsPage = () => {
  const { libros, categorias, isLoading, error, getCategoriaById } = useTienda();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Filtrar libros por categoría si hay una seleccionada
  const filteredLibros = selectedCategory
    ? libros.filter(l => l.categoria_id === selectedCategory)
    : libros;

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
        <Badge variant="primary">{filteredLibros.length} libros</Badge>
      </div>

      {/* Filtro por categoría */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === null
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.categoria_id}
            onClick={() => setSelectedCategory(categoria.categoria_id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === categoria.categoria_id
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {categoria.nombre}
          </button>
        ))}
      </div>

      {/* Grid de libros */}
      {filteredLibros.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay libros disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibros.map((libro) => {
            const categoria = getCategoriaById(libro.categoria_id);
            return (
              <Card key={libro.libro_id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{libro.titulo}</h3>
                      {categoria && (
                        <Badge variant="secondary" size="sm">
                          {categoria.nombre}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{libro.sinopsis}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ${libro.precio_venta.toFixed(2)}
                      </p>
                      <p className={`text-sm ${libro.stock_actual > 10 ? 'text-gray-500' : 'text-warning'}`}>
                        Stock: {libro.stock_actual}
                      </p>
                    </div>
                  </div>

                  <AddToCartButton
                    libro={libro}
                    className="w-full"
                    disabled={libro.stock_actual === 0}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;