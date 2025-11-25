import React, { useState } from 'react';
import { useTienda } from '../../contexts/TiendaContext';
import { useUIService } from '../../stores/ui';
import { CategoriesTable, CategoryForm } from '../../components/organisms';
import { Dialog } from '../../components/molecules';
import type { Categoria, CrearCategoria, ActualizarCategoria } from '../../types';

const CategoriesAdminPage: React.FC = () => {
  const { categorias, crearCategoria, actualizarCategoria, eliminarCategoria } = useTienda();
  const { toast, confirm } = useUIService();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (cat: Categoria) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = async (cat: Categoria) => {
    confirm.delete(cat.nombre, async () => {
      try {
        await eliminarCategoria(cat.categoria_id);
        toast.success(`Categoría "${cat.nombre}" eliminada exitosamente`);
      } catch (error) {
        toast.error('Error al eliminar la categoría');
      }
    });
  };

  const handleSubmit = async (data: CrearCategoria) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await actualizarCategoria({
          ...data,
          categoria_id: editingCategory.categoria_id
        } as ActualizarCategoria);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await crearCategoria(data);
        toast.success('Categoría creada exitosamente');
      }
      setIsModalOpen(false);
      setEditingCategory(undefined);
    } catch (error) {
      toast.error(editingCategory ? 'Error al actualizar categoría' : 'Error al crear categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <>
      <CategoriesTable
        categories={categorias}
        loading={false}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        size="lg"
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </Dialog>
    </>
  );
};

export default CategoriesAdminPage;
