import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from '../atoms';
import { Icon } from '../atoms';

interface SearchBarProps {
  onSearch: (query: string, filters: Record<string, any>) => void;
  placeholder?: string;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
  }>;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar...',
  filters = [],
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleSearch = () => {
    onSearch(query, filterValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Filtrado en tiempo real mientras se escribe
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearch(query, filterValues);
    }, 250);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filterValues]);

  const clearFilters = () => {
    setQuery('');
    setFilterValues({});
    onSearch('', {});
  };

  const hasActiveFilters = query || Object.values(filterValues).some(v => v);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Icon
            name="search"
            size="md"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>
          <Icon name="search" size="sm" className="mr-2" />
          Buscar
        </Button>
        {hasActiveFilters && (
          <Button variant="secondary" onClick={clearFilters}>
            <Icon name="close" size="sm" className="mr-2" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {filter.label}
              </label>
              <Select
                options={filter.options}
                placeholder={filter.placeholder || `Seleccionar ${filter.label.toLowerCase()}`}
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {query && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
              Búsqueda: "{query}"
              <button
                onClick={() => setQuery('')}
                className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
              >
                <Icon name="close" size="xs" />
              </button>
            </span>
          )}
          {Object.entries(filterValues).map(([key, value]) => {
            if (!value) return null;
            const filter = filters.find(f => f.key === key);
            const label = filter?.options.find(o => o.value === value)?.label || value;
            return (
              <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary-100 text-secondary-800">
                {filter?.label}: {label}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-1 hover:bg-secondary-200 rounded-full p-0.5"
                >
                  <Icon name="close" size="xs" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
