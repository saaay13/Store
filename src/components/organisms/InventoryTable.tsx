import React, { useState } from 'react';
import { Button, Card } from '../atoms';
import { DataTable, SearchBar, Pagination } from '../molecules';
import { Icon } from '../atoms';
import type { Producto, Categoria } from '../../types';

interface InventoryTableProps {
  products: Producto[];
  categories: Categoria[];
  loading?: boolean;
  onEdit: (product: Producto) => void;
  onDelete: (product: Producto) => void;
  onCreate: () => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  categories,
  loading = false,
  onEdit,
  onDelete,
  onCreate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria_id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Producto];
    let bValue: any = b[sortBy as keyof Producto];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginate products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query: string, filters: Record<string, any>) => {
    setSearchQuery(query);
    setSelectedCategory(filters.category || '');
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Agotado', variant: 'error' as const };
    if (stock < 10) return { label: 'Bajo', variant: 'warning' as const };
    return { label: 'Disponible', variant: 'success' as const };
  };

  const columns = [
    {
      key: 'nombre',
      header: 'Producto',
      sortable: true,
      render: (value: string, product: Producto) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{product.descripcion}</div>
        </div>
      )
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (_: any, product: Producto) => {
        const category = categories.find(c => c.categoria_id === product.categoria_id);
        return category?.nombre || 'Sin categoría';
      }
    },
    {
      key: 'precio_venta',
      header: 'Precio',
      sortable: true,
      render: (value: number) => `Bs. ${value.toFixed(2)}`
    },
    {
      key: 'stock_actual',
      header: 'Stock',
      sortable: true,
      render: (value: number, product: Producto) => {
        const status = getStockStatus(value);
        return (
          <div className="flex items-center space-x-2">
            <span>{value} {product.unidad_medida}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${status.variant === 'error' ? 'bg-red-100 text-red-800' :
                status.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'}`}>
              {status.label}
            </span>
          </div>
        );
      }
    },
    {
      key: 'codigo_barras',
      header: 'Código',
      render: (value: string) => value || '-'
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_: any, product: Producto) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(product)}
          >
            <Icon name="edit" size="sm" className="mr-1" />
            Editar
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(product)}
          >
            <Icon name="delete" size="sm" className="mr-1" />
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  const filterOptions = [
    {
      key: 'category',
      label: 'Categoría',
      options: [
        { value: '', label: 'Todas las categorías' },
        ...categories.map(cat => ({
          value: cat.categoria_id.toString(),
          label: cat.nombre
        }))
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
          <p className="text-gray-600">Gestión de productos y stock</p>
        </div>
        <Button onClick={onCreate}>
          <Icon name="plus" size="sm" className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <SearchBar
          placeholder="Buscar productos..."
          filters={filterOptions}
          onSearch={handleSearch}
        />
      </Card>

      {/* Table */}
      <Card className="p-6">
        <DataTable
          data={paginatedProducts}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron productos"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{products.length}</div>
          <div className="text-sm text-gray-600">Total Productos</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {products.filter(p => p.stock_actual > 10).length}
          </div>
          <div className="text-sm text-gray-600">Con Stock</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">
            {products.filter(p => p.stock_actual > 0 && p.stock_actual <= 10).length}
          </div>
          <div className="text-sm text-gray-600">Stock Bajo</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-error">
            {products.filter(p => p.stock_actual === 0).length}
          </div>
          <div className="text-sm text-gray-600">Agotados</div>
        </Card>
      </div>
    </div>
  );
};

export default InventoryTable;