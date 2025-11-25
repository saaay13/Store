import React, { useState } from 'react';
import { Button, Input, Textarea } from '../atoms';
import type { Author, CreateAuthor, UpdateAuthor } from '../../types';

interface AuthorFormProps {
  author?: Author;
  onSubmit: (data: CreateAuthor | UpdateAuthor) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
  author,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: author?.name || '',
    biography: author?.biography || '',
    nationality: author?.nationality || '',
    birthDate: author?.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] : '',
    photoUrl: author?.photoUrl || ''
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

  // Validar fecha
  const isValidDate = (dateString: string): boolean => {
    if (!dateString.trim()) return true; // Opcional
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date <= new Date();
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.biography.trim()) {
      newErrors.biography = 'La biografía es obligatoria';
    } else if (formData.biography.length < 10) {
      newErrors.biography = 'La biografía debe tener al menos 10 caracteres';
    } else if (formData.biography.length > 2000) {
      newErrors.biography = 'La biografía no puede exceder 2000 caracteres';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'La nacionalidad es obligatoria';
    } else if (formData.nationality.length < 2) {
      newErrors.nationality = 'La nacionalidad debe tener al menos 2 caracteres';
    } else if (formData.nationality.length > 50) {
      newErrors.nationality = 'La nacionalidad no puede exceder 50 caracteres';
    }

    if (formData.birthDate && !isValidDate(formData.birthDate)) {
      newErrors.birthDate = 'Debe ser una fecha válida y no futura';
    }

    if (formData.photoUrl && !isValidURL(formData.photoUrl)) {
      newErrors.photoUrl = 'Debe ser una URL válida';
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
      if (author) {
        // Update existing author
        const submitData: UpdateAuthor = {
          authorId: author.authorId,
          name: formData.name,
          biography: formData.biography,
          nationality: formData.nationality,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
          photoUrl: formData.photoUrl || undefined
        };
        await onSubmit(submitData);
      } else {
        // Create new author
        const submitData: CreateAuthor = {
          name: formData.name,
          biography: formData.biography,
          nationality: formData.nationality,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
          photoUrl: formData.photoUrl || undefined
        };
        await onSubmit(submitData);
      }
    } catch (error) {
      console.error('Error submitting author:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
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
        <label className="block text-sm font-medium text-foreground mb-2">
          Nombre *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          variant={errors.name ? 'error' : 'default'}
          placeholder="Ej: Gabriel García Márquez"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name}</p>
        )}
      </div>

      {/* Nacionalidad */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nacionalidad *
        </label>
        <Input
          type="text"
          value={formData.nationality}
          onChange={(e) => handleChange('nationality', e.target.value)}
          variant={errors.nationality ? 'error' : 'default'}
          placeholder="Ej: Colombiano"
        />
        {errors.nationality && (
          <p className="mt-1 text-sm text-error">{errors.nationality}</p>
        )}
      </div>

      {/* Fecha de Nacimiento */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Fecha de Nacimiento
        </label>
        <Input
          type="date"
          value={formData.birthDate}
          onChange={(e) => handleChange('birthDate', e.target.value)}
          variant={errors.birthDate ? 'error' : 'default'}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.birthDate && (
          <p className="mt-1 text-sm text-error">{errors.birthDate}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Opcional. Dejar vacío si se desconoce.
        </p>
      </div>

      {/* Biografía */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Biografía *
        </label>
        <Textarea
          value={formData.biography}
          onChange={(e) => handleChange('biography', e.target.value)}
          variant={errors.biography ? 'error' : 'default'}
          placeholder="Escribe una breve biografía del autor..."
          rows={6}
        />
        {errors.biography && (
          <p className="mt-1 text-sm text-error">{errors.biography}</p>
        )}
      </div>

      {/* URL de Foto */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          URL de Foto (opcional)
        </label>
        <Input
          type="url"
          value={formData.photoUrl || ''}
          onChange={(e) => handleChange('photoUrl', e.target.value)}
          variant={errors.photoUrl ? 'error' : 'default'}
          placeholder="https://ejemplo.com/foto-autor.jpg"
        />
        {errors.photoUrl && (
          <p className="mt-1 text-sm text-error">{errors.photoUrl}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : (author ? 'Actualizar Autor' : 'Crear Autor')}
        </Button>
      </div>
    </form>
  );
};

export default AuthorForm;