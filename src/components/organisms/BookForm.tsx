import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { Button, Input, Select, Textarea } from '../atoms';
import type { Book, Category, Author, CreateBook, UpdateBook, BookStatus } from '../../types';

interface BookFormProps {
  book?: Book;
  categories: Category[];
  authors: Author[];
  onSubmit: (data: CreateBook | UpdateBook) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({
  book,
  categories,
  authors,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    isbn: book?.isbn || '',
    title: book?.title || '',
    subtitle: book?.subtitle || '',
    synopsis: book?.synopsis || '',
    authorId: book?.authorId || 0,
    publisherName: book?.publisherName || '',
    categoryId: book?.categoryId || 0,
    publicationYear: book?.publicationYear || new Date().getFullYear(),
    language: book?.language || 'Español',
    pageCount: book?.pageCount || 0,
    format: book?.format || 'Tapa blanda',
    price: book?.price || 0,
    stock: book?.stock || 0,
    coverUrl: book?.coverUrl || '',
    status: book?.status || 'disponible' as BookStatus
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es obligatorio';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    if (!formData.synopsis.trim()) {
      newErrors.synopsis = 'La sinopsis es obligatoria';
    }
    if (!formData.authorId || formData.authorId === 0) {
      newErrors.authorId = 'Debe seleccionar un autor';
    }
    if (!formData.publisherName.trim()) {
      newErrors.publisherName = 'La editorial es obligatoria';
    }
    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Debe seleccionar una categoría';
    }
    if (formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear() + 1) {
      newErrors.publicationYear = 'Año de publicación inválido';
    }
    if (formData.pageCount <= 0) {
      newErrors.pageCount = 'El número de páginas debe ser mayor a 0';
    }
    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
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
      if (book) {
        // Update existing book
        const payload: UpdateBook = {
          bookId: book.bookId,
          isbn: formData.isbn,
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          synopsis: formData.synopsis,
          authorId: formData.authorId,
          publisherName: formData.publisherName,
          categoryId: formData.categoryId,
          publicationYear: formData.publicationYear,
          language: formData.language,
          pageCount: formData.pageCount,
          format: formData.format,
          price: formData.price,
          stock: formData.stock,
          coverUrl: formData.coverUrl || undefined,
          status: formData.status,
        };
        await onSubmit(payload);
      } else {
        // Create new book
        const payload: CreateBook = {
          isbn: formData.isbn,
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          synopsis: formData.synopsis,
          authorId: formData.authorId,
          publisherName: formData.publisherName,
          categoryId: formData.categoryId,
          publicationYear: formData.publicationYear,
          language: formData.language,
          pageCount: formData.pageCount,
          format: formData.format,
          price: formData.price,
          stock: formData.stock,
          coverUrl: formData.coverUrl || undefined,
          status: formData.status,
        };
        await onSubmit(payload);
      }
    } catch (error) {
      console.error('Error submitting book:', error);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.categoryId.toString(),
    label: cat.name
  }));

  const authorOptions = authors.map(author => ({
    value: author.authorId.toString(),
    label: author.name
  }));

  const getCategoryIcon = (iconName?: string | null) => {
    if (!iconName) return BookOpen;
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent || BookOpen;
  };

  const selectedCategory = categories.find(
    (cat) => cat.categoryId === formData.categoryId
  );

  const formatOptions = [
    { value: 'Tapa dura', label: 'Tapa dura' },
    { value: 'Tapa blanda', label: 'Tapa blanda' },
    { value: 'eBook', label: 'eBook' },
    { value: 'Audiolibro', label: 'Audiolibro' }
  ];

  const languageOptions = [
    { value: 'Español', label: 'Español' },
    { value: 'Inglés', label: 'Inglés' },
    { value: 'Francés', label: 'Francés' },
    { value: 'Alemán', label: 'Alemán' },
    { value: 'Italiano', label: 'Italiano' },
    { value: 'Portugués', label: 'Portugués' }
  ];

  const statusOptions = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'agotado', label: 'Agotado' },
    { value: 'proximamente', label: 'Próximamente' },
    { value: 'descatalogado', label: 'Descatalogado' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Información Básica</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ISBN *
            </label>
            <Input
              type="text"
              value={formData.isbn}
              onChange={(e) => handleChange('isbn', e.target.value)}
              variant={errors.isbn ? 'error' : 'default'}
              placeholder="978-3-16-148410-0"
            />
            {errors.isbn && (
              <p className="mt-1 text-sm text-error">{errors.isbn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Título *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              variant={errors.title ? 'error' : 'default'}
              placeholder="Título del libro"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-error">{errors.title}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Subtítulo
          </label>
          <Input
            type="text"
            value={formData.subtitle || ''}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            placeholder="Subtítulo (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sinopsis *
          </label>
          <Textarea
            value={formData.synopsis}
            onChange={(e) => handleChange('synopsis', e.target.value)}
            variant={errors.synopsis ? 'error' : 'default'}
            placeholder="Descripción del libro"
            rows={4}
          />
          {errors.synopsis && (
            <p className="mt-1 text-sm text-error">{errors.synopsis}</p>
          )}
        </div>
      </div>

      {/* Author and Publisher */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Autoría y Editorial</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Autor *
            </label>
            <Select
              options={authorOptions}
              value={formData.authorId.toString()}
              onChange={(e) => handleChange('authorId', parseInt(e.target.value))}
              placeholder="Seleccionar autor"
            />
            {errors.authorId && (
              <p className="mt-1 text-sm text-error">{errors.authorId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Editorial *
            </label>
            <Input
              type="text"
              value={formData.publisherName}
              onChange={(e) => handleChange('publisherName', e.target.value)}
              variant={errors.publisherName ? 'error' : 'default'}
              placeholder="Nombre de la editorial"
            />
            {errors.publisherName && (
              <p className="mt-1 text-sm text-error">{errors.publisherName}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Categoría *
            </label>
            <Select
              options={categoryOptions}
              value={formData.categoryId.toString()}
              onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
              placeholder="Seleccionar categoría"
            />
            {errors.categoryId && (
              <p className="mt-1 text-sm text-error">{errors.categoryId}</p>
            )}
          </div>

          {selectedCategory && (
            <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
              {(() => {
                const Icon = getCategoryIcon(selectedCategory?.icon);
                return <Icon className="h-5 w-5 text-muted-foreground" />;
              })()}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {selectedCategory.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedCategory.description || 'Sin descripción'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book Details */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Detalles del Libro</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Año de Publicación *
            </label>
            <Input
              type="number"
              min="1000"
              max={new Date().getFullYear() + 1}
              value={formData.publicationYear}
              onChange={(e) => handleChange('publicationYear', parseInt(e.target.value) || 0)}
              variant={errors.publicationYear ? 'error' : 'default'}
              placeholder={new Date().getFullYear().toString()}
            />
            {errors.publicationYear && (
              <p className="mt-1 text-sm text-error">{errors.publicationYear}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Idioma *
            </label>
            <Select
              options={languageOptions}
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Número de Páginas *
            </label>
            <Input
              type="number"
              min="1"
              value={formData.pageCount}
              onChange={(e) => handleChange('pageCount', parseInt(e.target.value) || 0)}
              variant={errors.pageCount ? 'error' : 'default'}
              placeholder="0"
            />
            {errors.pageCount && (
              <p className="mt-1 text-sm text-error">{errors.pageCount}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Formato *
          </label>
          <Select
            options={formatOptions}
            value={formData.format}
            onChange={(e) => handleChange('format', e.target.value)}
          />
        </div>
      </div>

      {/* Commercial Information */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Información Comercial</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Precio de Venta (Bs.) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
              variant={errors.price ? 'error' : 'default'}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-error">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Stock Actual *
            </label>
            <Input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
              variant={errors.stock ? 'error' : 'default'}
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-error">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Estado *
            </label>
            <Select
              options={statusOptions}
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            URL de Portada
          </label>
          <Input
            type="url"
            value={formData.coverUrl || ''}
            onChange={(e) => handleChange('coverUrl', e.target.value)}
            placeholder="https://ejemplo.com/portada.jpg"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-border">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : (book ? 'Actualizar Libro' : 'Crear Libro')}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
