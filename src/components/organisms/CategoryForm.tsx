import React, { useState } from 'react';
import { Button, Input, Textarea } from '../atoms';
import { IconPicker } from '../molecules';
import type { Categoria, CrearCategoria } from '../../types';

interface CategoryFormProps {
  category?: Categoria;
  onSubmit: (data: CrearCategoria) => Promise<void>;
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
    nombre: category?.nombre || '',
    descripcion: category?.descripcion || '',
    icono: category?.icono || null,
    imagen_url: category?.imagen_url || ''
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    if (formData.imagen_url && !isValidURL(formData.imagen_url)) {
      newErrors.imagen_url = 'Debe ser una URL válida';
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
      const submitData: CrearCategoria = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        icono: formData.icono || undefined,
        imagen_url: formData.imagen_url || undefined
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
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          variant={errors.nombre ? 'error' : 'default'}
          placeholder="Ej: Ficción Contemporánea"
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <Textarea
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          variant={errors.descripcion ? 'error' : 'default'}
          placeholder="Describe las características de esta categoría..."
          rows={4}
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      {/* Icono */}
      <IconPicker
        label="Icono (opcional)"
        value={formData.icono}
        onChange={(icon) => handleChange('icono', icon)}
        error={errors.icono}
      />

      {/* URL de Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de Imagen (opcional)
        </label>
        <Input
          type="url"
          value={formData.imagen_url || ''}
          onChange={(e) => handleChange('imagen_url', e.target.value)}
          variant={errors.imagen_url ? 'error' : 'default'}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {errors.imagen_url && (
          <p className="mt-1 text-sm text-red-600">{errors.imagen_url}</p>
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
