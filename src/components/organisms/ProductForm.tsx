import React, { useState } from 'react';
import { Button, Input, Select, Textarea } from '../atoms';
import type { Producto, Categoria } from '../../types';

interface ProductFormProps {
  product?: Producto;
  categories: Categoria[];
  onSubmit: (data: Omit<Producto, 'producto_id' | 'categoria'>) => Promise<void>;
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
    nombre: product?.nombre || '',
    descripcion: product?.descripcion || '',
    precio_venta: product?.precio_venta || 0,
    precio_compra_referencia: product?.precio_compra_referencia || 0,
    stock_actual: product?.stock_actual || 0,
    unidad_medida: product?.unidad_medida || 'unidad',
    codigo_barras: product?.codigo_barras || '',
    categoria_id: product?.categoria_id || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (formData.precio_venta <= 0) {
      newErrors.precio_venta = 'El precio debe ser mayor a 0';
    }
    if (formData.stock_actual < 0) {
      newErrors.stock_actual = 'El stock no puede ser negativo';
    }
    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Debe seleccionar una categoría';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting product:', error);
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
    value: cat.categoria_id.toString(),
    label: cat.nombre
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto *
          </label>
          <Input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            variant={errors.nombre ? 'error' : 'default'}
            placeholder="Nombre del producto"
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Barras
          </label>
          <Input
            type="text"
            value={formData.codigo_barras}
            onChange={(e) => handleChange('codigo_barras', e.target.value)}
            variant={errors.codigo_barras ? 'error' : 'default'}
            placeholder="Código de barras"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <Textarea
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          variant={errors.descripcion ? 'error' : 'default'}
          placeholder="Descripción detallada del producto"
        />
      </div>

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
            Precio Compra Ref. (Bs.)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio_compra_referencia}
            onChange={(e) => handleChange('precio_compra_referencia', parseFloat(e.target.value) || 0)}
            variant={errors.precio_compra_referencia ? 'error' : 'default'}
            placeholder="0.00"
          />
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unidad de Medida *
          </label>
          <Input
            type="text"
            value={formData.unidad_medida}
            onChange={(e) => handleChange('unidad_medida', e.target.value)}
            variant={errors.unidad_medida ? 'error' : 'default'}
            placeholder="unidad"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <Select
            options={categoryOptions}
            value={formData.categoria_id.toString()}
            onChange={(e) => handleChange('categoria_id', parseInt(e.target.value))}
            placeholder="Seleccionar categoría"
          />
          {errors.categoria_id && (
            <p className="mt-1 text-sm text-red-600">{errors.categoria_id}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;