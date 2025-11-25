import React, { useState } from 'react';
import { Button, Card } from '../atoms';
import { DataTable, SearchBar, Pagination } from '../molecules';
import { Icon } from '../atoms';
import type { Book, Category } from '../../types';

interface InventoryTableProps {
  products: Book[];
  categories: Category[];
  loading?: boolean;
  onEdit: (product: Book) => void;
  onDelete: (product: Book) => void;
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
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  // Filter products
  const filteredProducts = products.filter(product => {
    const title = (product.title ?? product.titulo ?? '').toLowerCase();
    const synopsis = (product.synopsis ?? product.sinopsis ?? '').toLowerCase();
    const isbn = product.isbn?.toLowerCase() ?? '';
    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      synopsis.includes(searchQuery.toLowerCase()) ||
      isbn.includes(searchQuery.toLowerCase());
    const categoryId = product.categoryId;
    const matchesCategory = !selectedCategory || categoryId?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Book] ?? (a as any)[sortBy];
    let bValue: any = b[sortBy as keyof Book] ?? (b as any)[sortBy];

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
      key: 'title',
      header: 'Libro',
      sortable: true,
      render: (_: string, libro: Book) => (
        <div>
          <div className="font-medium text-gray-900">{libro.title}</div>
          <div className="text-sm text-gray-500">ISBN: {libro.isbn}</div>
        </div>
      )
    },
    {
      key: 'autor',
      header: 'Autor',
      render: (_: any, libro: Book) => {
        return libro.author?.name ?? libro.autor?.nombre ?? '-';
      }
    },
    {
      key: 'categoria',
      header: 'Categoría',
      render: (_: any, libro: Book) => {
        const categoryId = libro.categoryId;
        const category = categories.find(c => c.categoryId === categoryId);
        return category?.name ?? 'Sin categoría';
      }
    },
    {
      key: 'price',
      header: 'Precio',
      sortable: true,
      render: (_: number, libro: Book) => {
        const price = libro.price ?? libro.precio_venta ?? 0;
        return `Bs. ${price.toFixed(2)}`;
      }
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (_: number, libro: Book) => {
        const stock = libro.stock ?? libro.stock_actual ?? 0;
        const status = getStockStatus(stock);
        return (
          <div className="flex items-center space-x-2">
            <span>{stock} unidades</span>
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
      key: 'formato',
      header: 'Formato',
      render: (_: string, libro: Book) => libro.format ?? libro.formato ?? '-'
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_: any, libro: Book) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(libro)}
          >
            <Icon name="edit" size="sm" className="mr-1" />
            Editar
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(libro)}
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
          value: cat.categoryId?.toString() ?? '',
          label: cat.name ?? 'Categoría'
        }))
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario de Libros</h2>
          <p className="text-gray-600">Gestión de libros y stock</p>
        </div>
        <Button onClick={onCreate}>
          <Icon name="plus" size="sm" className="mr-2" />
          Nuevo Libro
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <SearchBar
          placeholder="Buscar por título, ISBN o sinopsis..."
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
          emptyMessage="No se encontraron libros"
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
          <div className="text-sm text-gray-600">Total Libros</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {products.filter(p => (p.stock ?? p.stock_actual ?? 0) > 10).length}
          </div>
          <div className="text-sm text-gray-600">Con Stock</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">
            {products.filter(p => {
              const stock = p.stock ?? p.stock_actual ?? 0;
              return stock > 0 && stock <= 10;
            }).length}
          </div>
          <div className="text-sm text-gray-600">Stock Bajo</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-error">
            {products.filter(p => (p.stock ?? p.stock_actual ?? 0) === 0).length}
          </div>
          <div className="text-sm text-gray-600">Agotados</div>
        </Card>
      </div>
    </div>
  );
};

export default InventoryTable;
