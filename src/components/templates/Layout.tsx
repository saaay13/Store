import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Home,
  Package,
  BookMarked,
  ShoppingBag,
  BarChart3,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button, Badge } from '../atoms';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { useCart } from '../../features/cart';
import { useAuth } from '../../features/auth';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showSidebar?: boolean;
}

const Layout = ({ children, title, showSidebar = true }: LayoutProps) => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/products', label: 'Productos', icon: Package },
    { to: '/admin/categories', label: 'Categorías', icon: BookMarked },
    { to: '/cart', label: `Carrito${totalItems ? ` (${totalItems})` : ''}`, icon: ShoppingCart },
    { label: 'Ventas', icon: ShoppingBag, disabled: true },
    { label: 'Reportes', icon: BarChart3, disabled: true },
    { label: 'Usuarios', icon: Users, disabled: true },
    { label: 'Configuración', icon: Settings, disabled: true },
  ];

  const renderNavItem = (item: (typeof navItems)[number]) => {
    const active = item.to ? isActive(item.to) : false;
    const content = (
      <Button
        variant={active ? 'primary' : 'secondary'}
        className="w-full justify-start"
        size="sm"
        disabled={item.disabled}
        aria-current={active ? 'page' : undefined}
        onClick={() => setMobileMenuOpen(false)}
      >
        <item.icon size={18} className="mr-2" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.to === '/cart' && totalItems > 0 && (
          <Badge variant="error" size="sm">
            {totalItems}
          </Badge>
        )}
      </Button>
    );

    if (item.to) {
      return (
        <Link key={item.label} to={item.to}>
          {content}
        </Link>
      );
    }

    return (
      <div key={item.label} className="opacity-80">
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card text-card-foreground shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              {showSidebar && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Abrir menú de navegación"
                >
                  <Menu size={18} />
                </Button>
              )}

              {/* Logo */}
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <BookOpen size={24} className="text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Store</h1>
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle size="md" />

              {/* Cart */}
              <Link to="/cart">
                <Button variant="secondary" size="sm" className="relative">
                  <ShoppingCart size={18} />
                  {totalItems > 0 && (
                    <Badge variant="error" size="sm" className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3 pl-3 border-l border-border">
                <span className="text-sm text-muted-foreground">
                  {user?.nombre || 'Usuario Demo'}
                </span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  <LogOut size={16} className="mr-1" />
                  Salir
                </Button>
              </div>

              {/* Mobile Logout */}
              <div className="sm:hidden">
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)] sticky top-16">
              <nav className="p-4 space-y-1">
                {navItems.map(renderNavItem)}
              </nav>
            </aside>

            {/* Mobile drawer */}
            <div
              className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-200 ${
                mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div
                className="absolute inset-0 bg-foreground/25 backdrop-blur-sm transition-opacity duration-200"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div
                className={`relative bg-card text-card-foreground border-r border-border w-72 max-w-[80%] h-full shadow-lg transform transition-transform duration-200 ease-out ${
                  mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <BookOpen size={20} className="text-primary" />
                    <span className="font-semibold text-foreground">Store</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Cerrar menú"
                  >
                    <X size={16} />
                  </Button>
                </div>
                <nav className="p-4 space-y-1">{navItems.map(renderNavItem)}</nav>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className={`flex-1 p-8 bg-background ${showSidebar ? '' : 'max-w-4xl mx-auto'}`}>
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
