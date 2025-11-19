import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/atoms';
import { Icon } from '../components/atoms';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'user',
      title: 'Gestión de Usuarios',
      description: 'Administra empleados, clientes y proveedores con roles específicos.'
    },
    {
      icon: 'settings',
      title: 'Control de Inventario',
      description: 'Mantén el stock actualizado con alertas automáticas de productos bajos.'
    },
    {
      icon: 'success',
      title: 'Ventas Eficientes',
      description: 'Procesa ventas rápidamente con interfaz intuitiva y métodos de pago múltiples.'
    },
    {
      icon: 'search',
      title: 'Reportes Detallados',
      description: 'Obtén insights valiosos con reportes de ventas, inventario y rendimiento.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Store</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </Button>
              <Button onClick={() => navigate('/register')}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Gestión Inteligente para
              <span className="text-primary block">Tu Tienda</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Simplifica la administración de tu negocio con un sistema completo de gestión
              de inventario, ventas y reportes. Diseñado para pequeñas y medianas empresas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/register')}>
                <Icon name="plus" size="sm" className="mr-2" />
                Comenzar Ahora
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                <Icon name="user" size="sm" className="mr-2" />
                Ya tengo cuenta
              </Button>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Icon name="settings" size="md" className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Productos</p>
                      <p className="text-2xl font-bold text-primary">1,234</p>
                    </div>
                  </div>
                </div>

                <div className="bg-success-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                      <Icon name="success" size="md" className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ventas Hoy</p>
                      <p className="text-2xl font-bold text-success">Bs. 2,450</p>
                    </div>
                  </div>
                </div>

                <div className="bg-warning-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-warning rounded-lg flex items-center justify-center">
                      <Icon name="warning" size="md" className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stock Bajo</p>
                      <p className="text-2xl font-bold text-warning">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para tu tienda
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Una solución completa que cubre todos los aspectos de la gestión de tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature.icon} size="lg" className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para transformar tu tienda?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Únete a cientos de negocios que ya confían en Store para su gestión diaria
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Crear Cuenta Gratis
            </Button>
            <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => navigate('/login')}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">Store</span>
              </div>
              <p className="text-gray-400 mb-4">
                La solución completa para la gestión de tu tienda.
                Simplifica tus operaciones y aumenta tu productividad.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Store. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;