import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/templates/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Button, Card, Input, Badge } from './components/atoms';

// Component to show atomic components demo
const ComponentsDemo = () => {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Store - Componentes Átomos
        </h1>
        <p className="text-lg text-gray-600">
          Página de prueba para visualizar todos los componentes básicos
        </p>
      </div>

      {/* Buttons Section */}
      <Card className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Botones (Button)</h2>

        {/* Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Variantes</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="error">Error</Button>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Tamaños</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </div>
        </div>

        {/* States */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Estados</h3>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button onClick={() => alert('Clicked!')}>Clickable</Button>
          </div>
        </div>
      </Card>

      {/* Cards Section */}
      <Card className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Tarjetas (Card)</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card shadow="sm" padding="sm">
            <h3 className="font-medium text-gray-800">Shadow SM, Padding SM</h3>
            <p className="text-sm text-gray-600 mt-2">
              Esta es una tarjeta con sombra pequeña y padding reducido.
            </p>
          </Card>

          <Card shadow="md" padding="md">
            <h3 className="font-medium text-gray-800">Shadow MD, Padding MD</h3>
            <p className="text-sm text-gray-600 mt-2">
              Esta es una tarjeta con sombra mediana y padding estándar.
            </p>
          </Card>

          <Card shadow="lg" padding="lg">
            <h3 className="font-medium text-gray-800">Shadow LG, Padding LG</h3>
            <p className="text-sm text-gray-600 mt-2">
              Esta es una tarjeta con sombra grande y padding amplio.
            </p>
          </Card>
        </div>
      </Card>

      {/* Inputs Section */}
      <Card className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Campos de Entrada (Input)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Estados Normales</h3>
            <div className="space-y-4">
              <Input placeholder="Campo de texto normal" />
              <Input type="email" placeholder="Correo electrónico" />
              <Input type="password" placeholder="Contraseña" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Estados de Error</h3>
            <div className="space-y-4">
              <Input variant="error" placeholder="Campo con error" />
              <Input
                variant="error"
                type="email"
                placeholder="Email inválido"
                defaultValue="email-invalido"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      <Card className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Etiquetas (Badge)</h2>

        {/* Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Variantes de Color</h3>
          <div className="flex flex-wrap gap-4">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Tamaños</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Ejemplos de Uso</h3>
          <div className="flex flex-wrap gap-4">
            <Badge variant="success">Activo</Badge>
            <Badge variant="warning">Pendiente</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="primary">Nuevo</Badge>
            <Badge variant="secondary">Archivado</Badge>
          </div>
        </div>
      </Card>

      {/* Footer */}
      <Card className="text-center">
        <p className="text-gray-600">
          Esta página demuestra todos los componentes átomos disponibles en el sistema de diseño.
          Cada componente sigue las reglas de tipado fuerte y diseño atómico.
        </p>
      </Card>
    </div>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// App Routes component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/components" element={
        <Layout title="Componentes">
          <ComponentsDemo />
        </Layout>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
