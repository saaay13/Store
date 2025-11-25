import React from "react";
import { Checkbox } from "../atoms";
import { Icon } from "../atoms";

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
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
  className = "",
}: DataTableProps<T>) {
  const selectedIds = new Set(selectedRows.map((item) => item.id));
  const allSelected =
    data.length > 0 && data.every((item) => selectedIds.has(item.id));
  const containerClasses = `rounded-lg border border-border bg-card text-foreground shadow-sm ${className}`;

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
      <div
        className={`flex items-center justify-center py-12 ${containerClasses}`}
      >
        <div className="text-center">
          <Icon
            name="loading"
            size="lg"
            className="animate-spin text-primary mb-2"
          />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`text-center py-12 ${containerClasses}`}>
        <Icon name="info" size="lg" className="text-muted-foreground mb-2" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${containerClasses}`}>
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            {selectable && (
              <th className="px-6 py-3 text-left">
                <Checkbox checked={allSelected} onChange={handleSelectAll} />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider ${
                  column.sortable ? "cursor-pointer hover:bg-accent/60" : ""
                }`}
                style={{ width: column.width }}
                onClick={() =>
                  column.sortable && handleSort(String(column.key))
                }
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <Icon
                        name="arrowUp"
                        size="xs"
                        className={`${
                          sortBy === column.key && sortOrder === "asc"
                            ? "text-primary"
                            : "text-foreground/60"
                        }`}
                      />
                      <Icon
                        name="arrowDown"
                        size="xs"
                        className={`-mt-1 ${
                          sortBy === column.key && sortOrder === "desc"
                            ? "text-primary"
                            : "text-foreground/60"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className={`transition-colors hover:bg-accent/20${
                selectedIds.has(item.id) ? "bg-primary/15" : "bg-card"
              }`}
            >
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap ">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onChange={() => handleRowSelect(item)}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground "
                >
                  {column.render
                    ? column.render(item[column.key as keyof T], item)
                    : String(item[column.key as keyof T] || "")}
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
