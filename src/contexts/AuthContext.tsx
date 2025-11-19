import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  login: (credentials: { nombre_usuario: string; password: string }) => Promise<boolean>;
  register: (userData: { nombre_usuario: string; nombre: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Check for existing session/token
    const checkAuth = async () => {
      // Simulate checking stored token
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: { nombre_usuario: string; password: string }): Promise<boolean> => {
    setIsLoading(true);

    try {
      // TODO: Implement actual API call
      // For now, simulate login
      if (credentials.nombre_usuario && credentials.password) {
        const mockUser: Usuario = {
          usuario_id: 1,
          nombre: 'Usuario Demo',
          telefono: '123456789',
          direccion: 'Dirección Demo',
          email: 'demo@store.com',
          tipo_usuario: 'admin',
          nombre_usuario: credentials.nombre_usuario,
          password_hash: null
        };

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: { nombre_usuario: string; nombre: string; email: string; password: string }): Promise<boolean> => {
    setIsLoading(true);

    try {
      // TODO: Implement actual API call
      // For now, simulate registration
      if (userData.nombre_usuario && userData.nombre && userData.email && userData.password) {
        const mockUser: Usuario = {
          usuario_id: Date.now(), // Simple ID generation
          nombre: userData.nombre,
          telefono: '',
          direccion: '',
          email: userData.email,
          tipo_usuario: 'empleado',
          nombre_usuario: userData.nombre_usuario,
          password_hash: null
        };

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};