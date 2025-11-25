import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useRoleAuth } from './useRoleAuth';
import type { Rol } from '../../types';
import type { ReactNode } from 'react';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Rol[];
  redirectTo?: string;
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/',
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { canAccessRoute } = useRoleAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessRoute(allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
