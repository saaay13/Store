import React, { useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Button, Card, Badge } from '../atoms';
import { DataTable, SearchBar, Pagination } from '../molecules';
import type { Book, Category, Author } from '../../types';

interface BooksTableProps {
  books: Book[];
  categories: Category[];
  authors: Author[];
  loading?: boolean;
  onCreate: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({
  books,
  categories,
  authors,
  loading = false,
  onCreate,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  // Filter books
  const filteredBooks = books.filter(book => {
    const title = (book.title ?? '').toLowerCase();
    const isbn = (book.isbn ?? '').toLowerCase();
    const author = authors.find(a => a.authorId === book.authorId);
    const authorName = (author?.name ?? '').toLowerCase();

    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      isbn.includes(searchQuery.toLowerCase()) ||
      authorName.includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || book.categoryId?.toString() === selectedCategory;
    const matchesAuthor = !selectedAuthor || book.authorId?.toString() === selectedAuthor;

    return matchesSearch && matchesCategory && matchesAuthor;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let aValue: any = (a as any)[sortBy];
    let bValue: any = (b as any)[sortBy];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string)?.toLowerCase() ?? '';
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginate books
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query: string, filters: Record<string, any>) => {
    setSearchQuery(query);
    setSelectedCategory(filters.category || '');
    setSelectedAuthor(filters.author || '');
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

  const getStockBadge = (stock: number) => {
    if (stock === 0) return { label: 'Agotado', variant: 'error' as const };
    if (stock < 10) return { label: 'Bajo', variant: 'warning' as const };
    return { label: 'Stock OK', variant: 'success' as const };
  };

  // Compact table columns
  const columns = [
    {
      key: 'title',
      header: 'Libro',
      sortable: true,
      render: (_: string, book: Book) => (
        <div className="min-w-[180px] max-w-[220px]">
          <div className="font-medium text-foreground truncate">{book.title}</div>
          <div className="text-xs text-muted-foreground truncate">
            {authors.find(a => a.authorId === book.authorId)?.name ?? 'Desconocido'}
          </div>
        </div>
      )
    },
    {
      key: 'categoryId',
      header: 'Categoría',
      sortable: true,
      render: (_: number, book: Book) => {
        const category = categories.find(c => c.categoryId === book.categoryId);
        return (
          <span className="text-sm text-foreground truncate block max-w-[120px]">
            {category?.name ?? 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'price',
      header: 'Precio',
      sortable: true,
      render: (_: number, book: Book) => (
        <span className="font-medium text-foreground whitespace-nowrap">
          Bs. {book.price.toFixed(2)}
        </span>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (_: number, book: Book) => {
        const stockBadge = getStockBadge(book.stock);
        return (
          <div className="flex items-center space-x-1">
            <span className="text-foreground text-sm">{book.stock}</span>
            <Badge variant={stockBadge.variant} size="sm">
              {stockBadge.label}
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'format',
      header: 'Formato',
      render: (_: string, book: Book) => (
        <span className="text-xs text-muted-foreground truncate block max-w-[80px]">
          {book.format}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_: any, book: Book) => (
        <div className="flex space-x-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(book)}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(book)}
          >
            <Trash2 size={14} />
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
          value: cat.categoryId.toString(),
          label: cat.name
        }))
      ]
    },
    {
      key: 'author',
      label: 'Autor',
      options: [
        { value: '', label: 'Todos los autores' },
        ...authors.map(author => ({
          value: author.authorId.toString(),
          label: author.name
        }))
      ]
    }
  ];

  const totalStock = books.reduce((acc, book) => acc + book.stock, 0);
  const lowStockBooks = books.filter(b => b.stock > 0 && b.stock < 10).length;
  const outOfStockBooks = books.filter(b => b.stock === 0).length;
  const availableBooks = books.filter(b => b.stock >= 10).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Libros</h2>
          <p className="text-muted-foreground">Administra el catálogo completo de la librería</p>
        </div>
        <Button onClick={onCreate}>
          <Plus size={18} className="mr-2" />
          Nuevo Libro
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <SearchBar
          placeholder="Buscar por título, ISBN o autor..."
          filters={filterOptions}
          onSearch={handleSearch}
        />
      </Card>

      {/* Table */}
      <Card className="p-6 overflow-x-auto">
        <DataTable
          data={paginatedBooks}
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
              totalItems={filteredBooks.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{books.length}</div>
              <div className="text-xs text-muted-foreground">Total Libros</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <BookOpen size={20} className="text-success" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{availableBooks}</div>
              <div className="text-xs text-muted-foreground">Con Stock</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <BookOpen size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{lowStockBooks}</div>
              <div className="text-xs text-muted-foreground">Stock Bajo</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-error/10 rounded-lg">
              <BookOpen size={20} className="text-error" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{outOfStockBooks}</div>
              <div className="text-xs text-muted-foreground">Agotados</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BooksTable;
