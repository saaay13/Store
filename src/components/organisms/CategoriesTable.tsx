import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button, Card } from '../atoms';
import { DataTable, SearchBar, Pagination } from '../molecules';
import type { Category } from '../../types';

interface CategoriesTableProps {
  categories: Category[];
  loading?: boolean;
  onCreate: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  loading = false,
  onCreate,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  // Renderizar icono Lucide dinámicamente
  const renderLucideIcon = (iconName: string, size: number = 20) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    if (!IconComponent) {
      return <span className="text-muted-foreground">?</span>;
    }
    return <IconComponent size={size} className="text-muted-foreground" />;
  };

  // Filtrar categorías
  const filteredCategories = categories.filter(cat => {
    const name = (cat.name ?? '').toLowerCase();
    const description = (cat.description ?? '').toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      description.includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Ordenar categorías
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let aValue: any = (a as any)[sortBy];
    let bValue: any = (b as any)[sortBy];

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

  // Paginar categorías
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  // Columnas de la tabla
  const columns = [
    {
      key: 'nombre',
      header: 'Nombre',
      sortable: true,
      render: (_: string, cat: Category) => (
        <div className="flex items-center space-x-2">
          {cat.icon && renderLucideIcon(cat.icon, 20)}
          <span className="font-medium text-foreground">{cat.name}</span>
        </div>
      )
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">
          {value && value.length > 100 ? `${value.slice(0, 100)}...` : value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_: any, cat: Category) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(cat)}
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(cat)}
          >
            <Trash2 size={16} className="mr-1" />
            Eliminar
          </Button>
        </div>
      )
    }
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Categorías</h2>
          <p className="text-muted-foreground">Categorías literarias de la librería</p>
        </div>
        <Button onClick={onCreate}>
          <Plus size={18} className="mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <SearchBar
          placeholder="Buscar por nombre o descripción..."
          onSearch={handleSearch}
        />
      </Card>

      {/* Table */}
      <Card className="p-6">
        <DataTable
          data={paginatedCategories}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron categorías"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCategories.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Summary Card */}
      <Card className="p-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">{categories.length}</div>
          <div className="text-muted-foreground">Categorías Registradas</div>
        </div>
      </Card>
    </div>
  );
};

export default CategoriesTable;
