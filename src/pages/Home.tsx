import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/atoms';
import { Icon } from '../components/atoms';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'CLÁSICOS', link: '/products?category=clasicos', image: 'libros.png' },
    { name: 'INFANTILES', link: '/products?category=infantiles', image: 'cuentos.png' },
    { name: 'JUVENILES', link: '/products?category=juveniles', image: 'vampiros.png' },
    { name: 'POESÍA', link: '/products?category=poesia', image: 'libros.png' },
    { name: 'INGLÉS', link: '/products?category=ingles', image: 'cuentos.png' },
    { name: 'NACIONALES', link: '/products?category=nacionales', image: 'vampiros.png' },
    { name: 'VARIOS', link: '/products?category=varios', image: 'libros.png' },
    { name: 'DESCUENTOS', link: '/products?category=descuentos', image: 'cuentos.png' },
    { name: 'ACCESORIOS LITERARIOS', link: '/products?category=accesorios', image: 'vampiros.png' }
  ];

  const services = [
    {
      icon: '📚',
      title: 'VENTA DE LIBROS ORIGINALES',
      description: ''
    },
    {
      icon: '🇧🇴',
      title: 'ENVÍOS A TODO EL PAÍS',
      description: ''
    },
    {
      icon: '🚚',
      title: 'ENTREGAS A DOMICILIO',
      description: ''
    },
    {
      icon: '📦',
      title: 'IMPORTACIÓN DE LIBROS A PEDIDO',
      description: ''
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Libros</span>
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
      <section className="bg-primary-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Compra desde cualquier parte de Bolivia
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Recibe tus libros favoritos en la puerta de tu casa
          </p>
          <Button size="lg" onClick={() => navigate('/products')}>
            TIENDA
          </Button>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por título, autor o ISBN"
              className="flex-1"
            />
            <Button>
              <Icon name="search" size="sm" className="mr-2" />
              Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="relative group cursor-pointer h-96 overflow-hidden" onClick={() => navigate(category.link)}>
                <img src={`/img/${category.image}`} alt={category.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/70 flex flex-col justify-end items-center p-6">
                  <Button size="lg" variant="secondary" className="bg-white/90 hover:bg-white text-primary font-semibold">
                    {category.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestras novedades
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Placeholder products */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative group cursor-pointer">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
                    <span className="text-white text-center px-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Título del Libro {item}
                      </h3>
                      <p className="text-sm mb-4">
                        Autor del libro
                      </p>
                      <p className="text-xl font-bold">
                        Bs. {(item * 25).toFixed(2)}
                      </p>
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button size="sm" className="w-full">
                    Agregar al carrito
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Visítanos
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contamos con los mejores libros originales de literatura universal, latinoamericana, juvenil, infantil y nacional.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/ubicacion')}>
            UBICACIÓN
          </Button>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">VISÍTANOS</h3>
          <p className="mb-2">Calle Colombia entre Aurelio Meleán y Julio Arauco #1069</p>
          <p className="mb-2">Cochabamba - Bolivia</p>
          <p className="mb-2">Lunes a viernes de 10:00 a 13:00 - 15:00 a 19:00,</p>
          <p>Sábado de 10:00 a 13:00</p>
        </div>
      </section>
    </div>
  );
};

export default Home;