import { useState } from 'react';
import { Card, Badge, Spinner } from '../components/atoms';
import { AddToCartButton } from '../features/cart';
import { useProducts } from '../contexts/ProductContext';

const ProductsPage = () => {
  const { products, categories, isLoading, error, getCategoryById } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Filtrar productos por categoría si hay una seleccionada
  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoria_id === selectedCategory)
    : products;

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
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <Badge variant="primary">{filteredProducts.length} productos</Badge>
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
        {categories.map((category) => (
          <button
            key={category.categoria_id}
            onClick={() => setSelectedCategory(category.categoria_id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.categoria_id
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.nombre}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const category = getCategoryById(product.categoria_id);
            return (
              <Card key={product.producto_id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.nombre}</h3>
                      {category && (
                        <Badge variant="secondary" size="sm">
                          {category.nombre}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{product.descripcion}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        ${product.precio_venta.toFixed(2)}
                      </p>
                      <p className={`text-sm ${product.stock_actual > 10 ? 'text-gray-500' : 'text-warning'}`}>
                        Stock: {product.stock_actual} {product.unidad_medida}
                      </p>
                    </div>
                  </div>

                  <AddToCartButton
                    product={product}
                    className="w-full"
                    disabled={product.stock_actual === 0}
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