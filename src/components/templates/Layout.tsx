import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '../atoms';
import { useCart } from '../../features/cart';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showSidebar?: boolean;
}

const Layout = ({ children, title, showSidebar = true }: LayoutProps) => {
  const { cart } = useCart();
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Store</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <Button variant="secondary" size="sm" className="relative">
                  🛒
                  {totalItems > 0 && (
                    <Badge variant="error" size="sm" className="absolute -top-2 -right-2">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
              <span className="text-sm text-gray-700">Usuario Demo</span>
              <Button variant="secondary" size="sm">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-gray-200">
            <nav className="p-4 space-y-2">
              <Button variant="secondary" className="w-full justify-start">
                🏠 Dashboard
              </Button>
              <Link to="/products">
                <Button variant="secondary" className="w-full justify-start">
                  📦 Productos
                </Button>
              </Link>
              <Link to="/admin/categories">
                <Button variant="secondary" className="w-full justify-start">
                  📚 Categorías
                </Button>
              </Link>
              <Button variant="secondary" className="w-full justify-start">
                🛒 Ventas
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                📊 Reportes
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                👥 Usuarios
              </Button>
              <Link to="/cart">
                <Button variant="secondary" className="w-full justify-start">
                  🛒 Carrito {totalItems > 0 && `(${totalItems})`}
                </Button>
              </Link>
              <Button variant="secondary" className="w-full justify-start">
                ⚙️ Configuración
              </Button>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-8 ${showSidebar ? '' : 'max-w-4xl mx-auto'}`}>
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;