import React, { useState } from 'react';
import { useAuth } from '../features/auth';
import { useUIService } from '../stores/ui';
import { ProfileForm } from '../components/organisms';
import { Dialog } from '../components/molecules';
import type { Usuario, UpdateUser } from '../types';

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const { toast, confirm } = useUIService();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: UpdateUser) => {
    setIsSubmitting(true);
    try {
      // Convert UpdateUser to the format expected by updateProfile
      const profileData = {
        nombre: data.name,
        name: data.name,
        telefono: data.phone,
        phone: data.phone,
        direccion: data.address,
        address: data.address,
        email: data.email,
        nombre_usuario: data.username,
        username: data.username
      };

      const success = await updateProfile(profileData);

      if (success) {
        toast.success('Perfil actualizado exitosamente');
        setIsModalOpen(false);
      } else {
        toast.error('Error al actualizar el perfil');
      }
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    confirm.show({
      title: '¿Estás seguro de que quieres cerrar sesión?',
      message: 'Esta acción te desconectará del sistema.',
      confirmText: 'Cerrar Sesión',
      cancelText: 'Cancelar',
      variant: 'warning',
      onConfirm: () => {
        logout();
        toast.success('Sesión cerrada exitosamente');
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground">Gestiona tu información personal</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Editar Perfil
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-error text-error-foreground rounded-lg hover:bg-error/90 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {user.nombre?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {user.nombre || user.name}
                </h2>
                <p className="text-muted-foreground capitalize">
                  {user.tipo_usuario || user.userType}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-foreground">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                  <p className="text-foreground">{user.telefono || user.phone || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                  <p className="text-foreground">{user.direccion || user.address || 'No especificada'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre de Usuario</label>
                  <p className="text-foreground">{user.nombre_usuario || user.username || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Información de Cuenta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID de Usuario</label>
              <p className="text-foreground font-mono">{user.usuario_id || user.userId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tipo de Usuario</label>
              <p className="text-foreground capitalize">{user.tipo_usuario || user.userType}</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Editar Perfil"
        size="lg"
      >
        <ProfileForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </Dialog>
    </>
  );
};

export default ProfilePage;