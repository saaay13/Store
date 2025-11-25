import React, { useState } from 'react';
import { Button, Input, Textarea } from '../atoms';
import { IconPicker } from '../molecules';
import type { Category, CreateCategory } from '../../types';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategory) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    icon: category?.icon || null,
    imageUrl: category?.imageUrl || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validar URL
  const isValidURL = (url: string): boolean => {
    if (!url.trim()) return true; // Opcional, vacío es válido
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    if (formData.imageUrl && !isValidURL(formData.imageUrl)) {
      newErrors.imageUrl = 'Debe ser una URL válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData: CreateCategory = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon || undefined,
        imageUrl: formData.imageUrl || undefined
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  const handleChange = (field: string, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          variant={errors.name ? 'error' : 'default'}
          placeholder="Ej: Ficción Contemporánea"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          variant={errors.description ? 'error' : 'default'}
          placeholder="Describe las características de esta categoría..."
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Icono */}
      <IconPicker
        label="Icono (opcional)"
        value={formData.icon}
        onChange={(icon) => handleChange('icon', icon)}
        error={errors.icon}
      />

      {/* URL de Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de Imagen (opcional)
        </label>
        <Input
          type="url"
          value={formData.imageUrl || ''}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          variant={errors.imageUrl ? 'error' : 'default'}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : (category ? 'Actualizar Categoría' : 'Crear Categoría')}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
