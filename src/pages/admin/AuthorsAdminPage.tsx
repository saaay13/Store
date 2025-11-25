import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { useUIService } from '../../stores/ui';
import { AuthorsTable, AuthorForm } from '../../components/organisms';
import { Dialog } from '../../components/molecules';
import type { Author, CreateAuthor, UpdateAuthor } from '../../types';

const AuthorsAdminPage: React.FC = () => {
  const { authors, createAuthor, updateAuthor, deleteAuthor, isLoading } = useStore();
  const { toast, confirm } = useUIService();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleCreate = () => {
    setEditingAuthor(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleDelete = async (author: Author) => {
    const displayName = author.name ?? 'Autor';
    const authorId = author.authorId;
    confirm.delete(displayName, async () => {
      try {
        if (!authorId) throw new Error("ID de autor no encontrado");
        await deleteAuthor(authorId);
        toast.success(`Autor "${displayName}" eliminado exitosamente`);
      } catch (error) {
        toast.error('Error al eliminar el autor');
      }
    });
  };

  const handleSubmit = async (data: CreateAuthor | UpdateAuthor) => {
    setIsSubmitting(true);
    try {
      if (editingAuthor) {
        // Update existing author
        await updateAuthor(data as UpdateAuthor);
        toast.success('Autor actualizado exitosamente');
      } else {
        // Create new author
        await createAuthor(data as CreateAuthor);
        toast.success('Autor creado exitosamente');
      }
      setIsModalOpen(false);
      setEditingAuthor(undefined);
    } catch (error) {
      toast.error(editingAuthor ? 'Error al actualizar autor' : 'Error al crear autor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAuthor(undefined);
  };

  return (
    <>
      <AuthorsTable
        authors={authors}
        loading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingAuthor ? 'Editar Autor' : 'Nuevo Autor'}
        size="lg"
      >
        <AuthorForm
          author={editingAuthor}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </Dialog>
    </>
  );
};

export default AuthorsAdminPage;