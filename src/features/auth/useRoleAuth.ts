import { useAuth } from './AuthContext';
import type { Rol } from '../../types';

interface UseRoleAuthReturn {
  hasRole: (allowedRoles: Rol | Rol[]) => boolean;
  isAdmin: boolean;
  isEmpleado: boolean;
  isCliente: boolean;
  canAccessRoute: (allowedRoles: Rol[]) => boolean;
}

export const useRoleAuth = (): UseRoleAuthReturn => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (allowedRoles: Rol | Rol[]): boolean => {
    if (!isAuthenticated || !user) return false;

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.tipo_usuario);
  };

  const canAccessRoute = (allowedRoles: Rol[]): boolean => {
    return hasRole(allowedRoles);
  };

  return {
    hasRole,
    isAdmin: hasRole('admin'),
    isEmpleado: hasRole('empleado'),
    isCliente: hasRole('cliente'),
    canAccessRoute,
  };
};
