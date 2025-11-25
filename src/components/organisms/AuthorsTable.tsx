import React, { useState } from 'react';
import { Plus, Pencil, Trash2, User } from 'lucide-react';
import { Button, Card } from '../atoms';
import { DataTable, SearchBar, Pagination } from '../molecules';
import type { Author } from '../../types';

interface AuthorsTableProps {
  authors: Author[];
  loading?: boolean;
  onCreate: () => void;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
}

const AuthorsTable: React.FC<AuthorsTableProps> = ({
  authors,
  loading = false,
  onCreate,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 10;

  // Filter authors
  const filteredAuthors = authors.filter(author => {
    const name = (author.name ?? '').toLowerCase();
    const nationality = (author.nationality ?? '').toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      nationality.includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort authors
  const sortedAuthors = [...filteredAuthors].sort((a, b) => {
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

  // Paginate authors
  const totalPages = Math.ceil(sortedAuthors.length / itemsPerPage);
  const paginatedAuthors = sortedAuthors.slice(
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

  // Format birth date
  const formatBirthDate = (date: Date | null) => {
    if (!date) return 'Desconocida';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (_: string, author: Author) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-foreground">{author.name}</div>
            <div className="text-xs text-muted-foreground">
              {author.nationality || 'Nacionalidad desconocida'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'nationality',
      header: 'Nacionalidad',
      sortable: true,
      render: (_: string, author: Author) => (
        <span className="text-sm text-muted-foreground">
          {author.nationality || 'Desconocida'}
        </span>
      )
    },
    {
      key: 'birthDate',
      header: 'Fecha de Nacimiento',
      sortable: true,
      render: (_: Date | null, author: Author) => (
        <span className="text-sm text-foreground">
          {formatBirthDate(author.birthDate)}
        </span>
      )
    },
    {
      key: 'biography',
      header: 'Biografía',
      render: (_: string, author: Author) => (
        <span className="text-xs text-muted-foreground truncate block max-w-[300px]">
          {author.biography && author.biography.length > 150 ? `${author.biography.slice(0, 150)}...` : author.biography || 'Sin biografía'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_: any, author: Author) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(author)}
          >
            <Pencil size={16} className="mr-1" />
            Editar
          </Button>
          <Button
            variant="error"
            size="sm"
            onClick={() => onDelete(author)}
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
          <h2 className="text-2xl font-bold text-foreground">Gestión de Autores</h2>
          <p className="text-muted-foreground">Administración completa de autores de la librería</p>
        </div>
        <Button onClick={onCreate}>
          <Plus size={18} className="mr-2" />
          Nuevo Autor
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <SearchBar
          placeholder="Buscar por nombre o nacionalidad..."
          onSearch={handleSearch}
        />
      </Card>

      {/* Table */}
      <Card className="p-6">
        <DataTable
          data={paginatedAuthors}
          columns={columns}
          loading={loading}
          emptyMessage="No se encontraron autores"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAuthors.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Summary Card */}
      <Card className="p-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">{authors.length}</div>
          <div className="text-muted-foreground">Autores Registrados</div>
        </div>
      </Card>
    </div>
  );
};

export default AuthorsTable;