import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { useUIService } from '../../stores/ui';
import { BooksTable, BookForm } from '../../components/organisms';
import { Dialog } from '../../components/molecules';
import type { Book, CreateBook, UpdateBook } from '../../types';

const BooksAdminPage: React.FC = () => {
  const { books, categories, authors, createBook, updateBook, deleteBook, isLoading } = useStore();
  const { toast, confirm } = useUIService();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleCreate = () => {
    setEditingBook(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = async (book: Book) => {
    const displayName = book.title ?? 'Libro';
    const bookId = book.bookId;
    confirm.delete(displayName, async () => {
      try {
        if (!bookId) throw new Error("ID de libro no encontrado");
        await deleteBook(bookId);
        toast.success(`Libro "${displayName}" eliminado exitosamente`);
      } catch (error) {
        toast.error('Error al eliminar el libro');
      }
    });
  };

  const handleSubmit = async (data: CreateBook | UpdateBook) => {
    setIsSubmitting(true);
    try {
      if (editingBook) {
        // Update existing book
        await updateBook(data as UpdateBook);
        toast.success('Libro actualizado exitosamente');
      } else {
        // Create new book
        await createBook(data as CreateBook);
        toast.success('Libro creado exitosamente');
      }
      setIsModalOpen(false);
      setEditingBook(undefined);
    } catch (error) {
      toast.error(editingBook ? 'Error al actualizar libro' : 'Error al crear libro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBook(undefined);
  };

  return (
    <>
      <BooksTable
        books={books}
        categories={categories}
        authors={authors}
        loading={isLoading}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={editingBook ? 'Editar Libro' : 'Nuevo Libro'}
        size="xl"
      >
        <BookForm
          book={editingBook}
          categories={categories}
          authors={authors}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </Dialog>
    </>
  );
};

export default BooksAdminPage;
