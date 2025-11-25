import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../../types';

interface AuthContextType {
  user: Usuario | null;
  login: (credentials: { nombre_usuario: string; password: string }) => Promise<boolean>;
  register: (userData: { nombre_usuario: string; nombre: string; email: string; password: string }) => Promise<boolean>;
  updateProfile: (userData: Partial<Usuario>) => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: { nombre_usuario: string; password: string }): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Fetch usuarios from JSON file
      const response = await fetch('/src/features/auth/data/usuarios.json');
      if (!response.ok) {
        throw new Error('Failed to fetch usuarios');
      }

      const data = await response.json();
      const usuarios: Usuario[] = data.usuarios;

      // Find user by username and password
      const foundUser = usuarios.find(
        (u) => u.nombre_usuario === credentials.nombre_usuario &&
               (u.password_hash === credentials.password || u.passwordHash === credentials.password)
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
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
          userId: Date.now(),
          nombre: userData.nombre,
          name: userData.nombre,
          telefono: '',
          phone: '',
          direccion: '',
          address: '',
          email: userData.email,
          tipo_usuario: 'empleado',
          userType: 'empleado',
          nombre_usuario: userData.nombre_usuario,
          username: userData.nombre_usuario,
          password_hash: null,
          passwordHash: null
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

  const updateProfile = async (userData: Partial<Usuario>): Promise<boolean> => {
    setIsLoading(true);

    try {
      // TODO: Implement actual API call
      // For now, simulate profile update
      if (user) {
        const updatedUser: Usuario = {
          ...user,
          ...userData,
          // Ensure both Spanish and English properties are updated
          nombre: userData.nombre || userData.name || user.nombre,
          name: userData.name || userData.nombre || user.name,
          telefono: userData.telefono || userData.phone || user.telefono,
          phone: userData.phone || userData.telefono || user.phone,
          direccion: userData.direccion || userData.address || user.direccion,
          address: userData.address || userData.direccion || user.address,
          nombre_usuario: userData.nombre_usuario || userData.username || user.nombre_usuario,
          username: userData.username || userData.nombre_usuario || user.username,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsLoading(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Note: Cart will be cleared automatically when user changes due to useEffect in CartContext
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    updateProfile,
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