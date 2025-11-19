import React from 'react';
import { Button, Checkbox } from '../atoms';
import { Icon } from '../atoms';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedRows?: T[];
  onRowSelect?: (item: T, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  className?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
  className = ''
}: DataTableProps<T>) {
  const selectedIds = new Set(selectedRows.map(item => item.id));
  const allSelected = data.length > 0 && data.every(item => selectedIds.has(item.id));
  const someSelected = data.some(item => selectedIds.has(item.id));

  const handleSelectAll = () => {
    onSelectAll?.(!allSelected);
  };

  const handleRowSelect = (item: T) => {
    onRowSelect?.(item, !selectedIds.has(item.id));
  };

  const handleSort = (key: string) => {
    onSort?.(key);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <Icon name="loading" size="lg" className="animate-spin text-primary mb-2" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Icon name="info" size="lg" className="text-gray-400 mb-2" />
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-6 py-3 text-left">
                <Checkbox
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <Icon
                        name="arrowUp"
                        size="xs"
                        className={`${
                          sortBy === column.key && sortOrder === 'asc'
                            ? 'text-primary'
                            : 'text-gray-300'
                        }`}
                      />
                      <Icon
                        name="arrowDown"
                        size="xs"
                        className={`-mt-1 ${
                          sortBy === column.key && sortOrder === 'desc'
                            ? 'text-primary'
                            : 'text-gray-300'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className={`hover:bg-gray-50 ${
                selectedIds.has(item.id) ? 'bg-primary-50' : ''
              }`}
            >
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onChange={() => handleRowSelect(item)}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(item[column.key as keyof T], item)
                    : String(item[column.key as keyof T] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;