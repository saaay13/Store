import React, { useState } from 'react';
import { Button, Input, Textarea } from '../atoms';
import type { Usuario, UpdateUser } from '../../types';

interface ProfileFormProps {
  user: Usuario;
  onSubmit: (data: UpdateUser) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: user.nombre || user.name || '',
    phone: user.telefono || user.phone || '',
    address: user.direccion || user.address || '',
    email: user.email,
    username: user.nombre_usuario || user.username || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar teléfono (formato básico)
  const isValidPhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Opcional
    const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
    return phoneRegex.test(phone);
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

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Debe ser un email válido';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Debe ser un número de teléfono válido';
    }

    if (formData.address && formData.address.length > 200) {
      newErrors.address = 'La dirección no puede exceder 200 caracteres';
    }

    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
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
      const submitData: UpdateUser = {
        userId: user.usuario_id || user.userId,
        name: formData.name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        email: formData.email,
        username: formData.username || undefined
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting profile:', error);
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
      {/* Información Personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Información Personal</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre Completo *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              variant={errors.name ? 'error' : 'default'}
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              variant={errors.email ? 'error' : 'default'}
              placeholder="usuario@ejemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Teléfono
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              variant={errors.phone ? 'error' : 'default'}
              placeholder="555-1234"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nombre de Usuario
            </label>
            <Input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              variant={errors.username ? 'error' : 'default'}
              placeholder="usuario123"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-error">{errors.username}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Dirección
          </label>
          <Textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            variant={errors.address ? 'error' : 'default'}
            placeholder="Dirección completa..."
            rows={3}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-error">{errors.address}</p>
          )}
        </div>
      </div>

      {/* Información de Cuenta (solo lectura) */}
      <div className="space-y-4 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground">Información de Cuenta</h3>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Tipo de Usuario:</span>
              <span className="ml-2 text-foreground capitalize">
                {user.tipo_usuario || user.userType}
              </span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">ID de Usuario:</span>
              <span className="ml-2 text-foreground font-mono">
                {user.usuario_id || user.userId}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Esta información no se puede modificar desde aquí.
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : 'Actualizar Perfil'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;