import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { useUIService } from '../../stores/ui';
import { CategoriesTable, CategoryForm } from '../../components/organisms';
import { Dialog } from '../../components/molecules';
import type { Category, CreateCategory, UpdateCategory } from '../../types';

const CategoriesAdminPage: React.FC = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useStore();
  const { toast, confirm } = useUIService();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleCreate = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = async (cat: Category) => {
    const displayName = cat.name ?? 'Categoría';
    const catId = cat.categoryId;
    confirm.delete(displayName, async () => {
      try {
        if (!catId) throw new Error("ID de categoría no encontrado");
        await deleteCategory(catId);
        toast.success(`Categoría "${displayName}" eliminada exitosamente`);
      } catch (error) {
        toast.error('Error al eliminar la categoría');
      }
    });
  };

  const handleSubmit = async (data: CreateCategory) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const categoryId = editingCategory.categoryId;
        if (!categoryId) {
          throw new Error("ID de categoría no encontrado");
        }
        await updateCategory({
          ...data,
          categoryId,
        } as UpdateCategory);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await createCategory(data);
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
        categories={categories}
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
