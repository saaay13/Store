import React, { useState, useRef, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button, Input, Card } from '../atoms';

interface IconPickerProps {
  value: string | null;
  onChange: (iconName: string | null) => void;
  label?: string;
  error?: string;
  className?: string;
}

// Lista curada de iconos para librerías/categorías literarias
const AVAILABLE_ICONS = [
  // Libros y Educación
  'Book', 'BookOpen', 'BookMarked', 'Library', 'GraduationCap', 'Notebook', 'FileText',
  // Géneros Literarios
  'Rocket', 'Sparkles', 'Heart', 'Search', 'Skull', 'Drama',
  'Baby', 'Users', 'Crown', 'Feather', 'Sword',
  // Naturaleza y Elementos
  'Sun', 'Moon', 'Star', 'Cloud', 'Umbrella', 'Tree', 'Flower',
  // Objetos y Símbolos
  'Coffee', 'Wine', 'Music', 'Palette', 'Camera', 'Film', 'Globe',
  'Map', 'Compass', 'Plane', 'Award', 'Trophy', 'Target',
  // Emociones y Conceptos
  'Brain', 'Lightbulb', 'Zap', 'Flame', 'Info', 'HelpCircle',
  'TrendingUp', 'DollarSign', 'ShoppingCart', 'Gift', 'Clock'
];

const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  label = 'Icono',
  error,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filtrar iconos por búsqueda
  const filteredIcons = AVAILABLE_ICONS.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Renderizar icono dinámicamente
  const renderIcon = (iconName: string, size: number = 24) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    if (!IconComponent) {
      return <span className="text-gray-400">?</span>;
    }
    return <IconComponent size={size} />;
  };

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Button para abrir picker */}
      <div className="relative" ref={dropdownRef}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            {value ? (
              <>
                {renderIcon(value, 20)}
                <span>{value}</span>
              </>
            ) : (
              <span className="text-gray-500">Seleccionar icono...</span>
            )}
          </div>
          <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
        </Button>

        {/* Dropdown con grid de iconos */}
        {isOpen && (
          <Card className="absolute z-50 mt-2 w-full md:w-96 p-4 shadow-lg">
            {/* Campo de búsqueda */}
            <div className="mb-3">
              <Input
                type="text"
                placeholder="Buscar icono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Grid de iconos */}
            <div className="max-h-64 overflow-y-auto">
              {filteredIcons.length > 0 ? (
                <div className="grid grid-cols-6 md:grid-cols-7 gap-2">
                  {filteredIcons.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleIconSelect(iconName)}
                      className={`p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                        value === iconName ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-50'
                      }`}
                      title={iconName}
                    >
                      <div className="flex items-center justify-center text-gray-700">
                        {renderIcon(iconName, 24)}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No se encontraron iconos
                </p>
              )}
            </div>

            {/* Botón para limpiar selección */}
            {value && (
              <div className="mt-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleClear}
                  className="w-full"
                >
                  Limpiar selección
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default IconPicker;
