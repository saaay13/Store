import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { Button, Input, Select, Textarea } from '../atoms';
import type { Book, Category, BookStatus, CreateBook } from '../../types';

interface ProductFormProps {
  product?: Book;
  categories: Category[];
  onSubmit: (data: CreateBook) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    isbn: product?.isbn || '',
    titulo: product?.title || product?.titulo || '',
    subtitulo: product?.subtitle || product?.subtitulo || '',
    sinopsis: product?.synopsis || product?.sinopsis || '',
    autor_id: product?.authorId || product?.autor_id || 0,
    nombre_editorial: product?.publisherName || product?.nombre_editorial || '',
    categoryId: product?.categoryId || 0,
    año_publicacion: product?.publicationYear || (product as any)?.año_publicacion || new Date().getFullYear(),
    idioma: product?.language || product?.idioma || 'Español',
    num_paginas: product?.pageCount || product?.num_paginas || 0,
    formato: product?.format || product?.formato || 'Tapa blanda',
    precio_venta: product?.price || product?.precio_venta || 0,
    stock_actual: product?.stock || product?.stock_actual || 0,
    portada_url: product?.coverUrl || product?.portada_url || '',
    estado: (product?.status as BookStatus) || (product?.estado as BookStatus) || 'disponible'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es obligatorio';
    }
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    if (!formData.sinopsis.trim()) {
      newErrors.sinopsis = 'La sinopsis es obligatoria';
    }
    if (!formData.autor_id || formData.autor_id === 0) {
      newErrors.autor_id = 'Debe seleccionar un autor';
    }
    if (!formData.nombre_editorial.trim()) {
      newErrors.nombre_editorial = 'La editorial es obligatoria';
    }
    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Debe seleccionar una categoría';
    }
    if (formData.año_publicacion < 1000 || formData.año_publicacion > new Date().getFullYear() + 1) {
      newErrors.año_publicacion = 'Año de publicación inválido';
    }
    if (formData.num_paginas <= 0) {
      newErrors.num_paginas = 'El número de páginas debe ser mayor a 0';
    }
    if (formData.precio_venta <= 0) {
      newErrors.precio_venta = 'El precio debe ser mayor a 0';
    }
    if (formData.stock_actual < 0) {
      newErrors.stock_actual = 'El stock no puede ser negativo';
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
      const payload: CreateBook = {
        isbn: formData.isbn,
        title: formData.titulo,
        subtitle: formData.subtitulo,
        synopsis: formData.sinopsis,
        authorId: formData.autor_id,
        publisherName: formData.nombre_editorial,
        categoryId: formData.categoryId,
        publicationYear: formData.año_publicacion,
        language: formData.idioma,
        pageCount: formData.num_paginas,
        format: formData.formato,
        price: formData.precio_venta,
        stock: formData.stock_actual,
        coverUrl: formData.portada_url,
        status: formData.estado as BookStatus,
      };
      await onSubmit(payload);
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
    value: (cat.categoryId ?? 0).toString(),
    label: cat.name
  }));

  const getCategoryIcon = (iconName?: string | null) => {
    if (!iconName) return BookOpen;
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return IconComponent || BookOpen;
  };

  const selectedCategory = categories.find(
    (cat) => cat.categoryId === formData.categoryId
  );

  const formatoOptions = [
    { value: 'Tapa dura', label: 'Tapa dura' },
    { value: 'Tapa blanda', label: 'Tapa blanda' },
    { value: 'eBook', label: 'eBook' },
    { value: 'Audiolibro', label: 'Audiolibro' }
  ];

  const idiomaOptions = [
    { value: 'Español', label: 'Español' },
    { value: 'Inglés', label: 'Inglés' },
    { value: 'Francés', label: 'Francés' },
    { value: 'Alemán', label: 'Alemán' },
    { value: 'Italiano', label: 'Italiano' },
    { value: 'Portugués', label: 'Portugués' }
  ];

  const estadoOptions = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'agotado', label: 'Agotado' },
    { value: 'proximamente', label: 'Próximamente' },
    { value: 'descatalogado', label: 'Descatalogado' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <Input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              variant={errors.titulo ? 'error' : 'default'}
              placeholder="Título del libro"
            />
            {errors.titulo && (
              <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtítulo
          </label>
          <Input
            type="text"
            value={formData.subtitulo || ''}
            onChange={(e) => handleChange('subtitulo', e.target.value)}
            placeholder="Subtítulo (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sinopsis *
          </label>
          <Textarea
            value={formData.sinopsis}
            onChange={(e) => handleChange('sinopsis', e.target.value)}
            variant={errors.sinopsis ? 'error' : 'default'}
            placeholder="Descripción del libro"
            rows={4}
          />
          {errors.sinopsis && (
            <p className="mt-1 text-sm text-red-600">{errors.sinopsis}</p>
          )}
        </div>
      </div>

      {/* Autoría y Editorial */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900">Autoría y Editorial</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de Autor * (temporal)
            </label>
            <Input
              type="number"
              value={formData.autor_id}
              onChange={(e) => handleChange('autor_id', parseInt(e.target.value) || 0)}
              variant={errors.autor_id ? 'error' : 'default'}
              placeholder="ID del autor"
            />
            {errors.autor_id && (
              <p className="mt-1 text-sm text-red-600">{errors.autor_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Editorial *
            </label>
            <Input
              type="text"
              value={formData.nombre_editorial}
              onChange={(e) => handleChange('nombre_editorial', e.target.value)}
              variant={errors.nombre_editorial ? 'error' : 'default'}
              placeholder="Nombre de la editorial"
            />
            {errors.nombre_editorial && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre_editorial}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <Select
              options={categoryOptions}
              value={formData.categoryId.toString()}
              onChange={(e) => handleChange('categoryId', parseInt(e.target.value))}
              placeholder="Seleccionar categoría"
            />
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
            {(() => {
              const Icon = getCategoryIcon(selectedCategory?.icon);
              return <Icon className="h-5 w-5 text-muted-foreground" />;
            })()}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {selectedCategory?.name || 'Selecciona una categoría'}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedCategory?.description
                  ? selectedCategory.description
                  : 'Usamos iconos de la librería (Lucide), no emojis.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detalles físicos */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900">Detalles del Libro</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año de Publicación *
            </label>
            <Input
              type="number"
              min="1000"
              max={new Date().getFullYear() + 1}
              value={formData.año_publicacion}
              onChange={(e) => handleChange('año_publicacion', parseInt(e.target.value) || 0)}
              variant={errors.año_publicacion ? 'error' : 'default'}
              placeholder={new Date().getFullYear().toString()}
            />
            {errors.año_publicacion && (
              <p className="mt-1 text-sm text-red-600">{errors.año_publicacion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma *
            </label>
            <Select
              options={idiomaOptions}
              value={formData.idioma}
              onChange={(e) => handleChange('idioma', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Páginas *
            </label>
            <Input
              type="number"
              min="1"
              value={formData.num_paginas}
              onChange={(e) => handleChange('num_paginas', parseInt(e.target.value) || 0)}
              variant={errors.num_paginas ? 'error' : 'default'}
              placeholder="0"
            />
            {errors.num_paginas && (
              <p className="mt-1 text-sm text-red-600">{errors.num_paginas}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Formato *
          </label>
          <Select
            options={formatoOptions}
            value={formData.formato}
            onChange={(e) => handleChange('formato', e.target.value)}
          />
        </div>
      </div>

      {/* Comercial */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900">Información Comercial</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Venta (Bs.) *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.precio_venta}
              onChange={(e) => handleChange('precio_venta', parseFloat(e.target.value) || 0)}
              variant={errors.precio_venta ? 'error' : 'default'}
              placeholder="0.00"
            />
            {errors.precio_venta && (
              <p className="mt-1 text-sm text-red-600">{errors.precio_venta}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Actual *
            </label>
            <Input
              type="number"
              min="0"
              value={formData.stock_actual}
              onChange={(e) => handleChange('stock_actual', parseInt(e.target.value) || 0)}
              variant={errors.stock_actual ? 'error' : 'default'}
              placeholder="0"
            />
            {errors.stock_actual && (
              <p className="mt-1 text-sm text-red-600">{errors.stock_actual}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <Select
              options={estadoOptions}
              value={formData.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de Portada
          </label>
          <Input
            type="url"
            value={formData.portada_url || ''}
            onChange={(e) => handleChange('portada_url', e.target.value)}
            placeholder="https://ejemplo.com/portada.jpg"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : (product ? 'Actualizar Libro' : 'Crear Libro')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
