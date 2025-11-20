import { Card } from '../components/atoms';
import { AddToCartButton } from '../features/cart';
import type { Producto } from '../types/entities/product';

// Mock products for demonstration
const mockProducts: Producto[] = [
  {
    producto_id: 1,
    nombre: 'Laptop Dell Inspiron',
    descripcion: 'Laptop de 15.6" con procesador Intel Core i5, 8GB RAM, 256GB SSD',
    precio_venta: 4500.00,
    precio_compra_referencia: 3800.00,
    stock_actual: 10,
    unidad_medida: 'unidad',
    codigo_barras: '1234567890123',
    categoria_id: 1,
    categoria: { categoria_id: 1, nombre: 'Electrónicos', descripcion: 'Productos electrónicos' }
  },
  {
    producto_id: 2,
    nombre: 'Mouse Logitech MX Master',
    descripcion: 'Mouse inalámbrico ergonómico con batería de larga duración',
    precio_venta: 350.00,
    precio_compra_referencia: 280.00,
    stock_actual: 25,
    unidad_medida: 'unidad',
    codigo_barras: '1234567890124',
    categoria_id: 1,
    categoria: { categoria_id: 1, nombre: 'Electrónicos', descripcion: 'Productos electrónicos' }
  },
  {
    producto_id: 3,
    nombre: 'Teclado Mecánico RGB',
    descripcion: 'Teclado mecánico con switches Cherry MX y iluminación RGB',
    precio_venta: 450.00,
    precio_compra_referencia: 350.00,
    stock_actual: 15,
    unidad_medida: 'unidad',
    codigo_barras: '1234567890125',
    categoria_id: 1,
    categoria: { categoria_id: 1, nombre: 'Electrónicos', descripcion: 'Productos electrónicos' }
  },
  {
    producto_id: 4,
    nombre: 'Monitor 24" Full HD',
    descripcion: 'Monitor LED de 24 pulgadas con resolución Full HD 1080p',
    precio_venta: 1200.00,
    precio_compra_referencia: 950.00,
    stock_actual: 8,
    unidad_medida: 'unidad',
    codigo_barras: '1234567890126',
    categoria_id: 1,
    categoria: { categoria_id: 1, nombre: 'Electrónicos', descripcion: 'Productos electrónicos' }
  },
  {
    producto_id: 5,
    nombre: 'Audífonos Sony WH-1000XM4',
    descripcion: 'Audífonos inalámbricos con cancelación de ruido activa',
    precio_venta: 1800.00,
    precio_compra_referencia: 1450.00,
    stock_actual: 12,
    unidad_medida: 'unidad',
    codigo_barras: '1234567890127',
    categoria_id: 1,
    categoria: { categoria_id: 1, nombre: 'Electrónicos', descripcion: 'Productos electrónicos' }
  },
  {
    producto_id: 6,
    nombre: 'Disco Duro Externo 1TB',
    descripcion: 'Disco duro externo USB 3.0 de 1TB para respaldo de datos',
    precio_venta: 280.00,
    precio_compra_referencia: 220.00,
    stock_actual: 20,
    unidad_medida: 'unidad',
    codigo_barras: '1234567890128',
    categoria_id: 1,
    categoria: { categoria_id: 1, nombre: 'Electrónicos', descripcion: 'Productos electrónicos' }
  }
];

const ProductsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <Card key={product.producto_id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.nombre}</h3>
                <p className="text-sm text-gray-600 mt-1">{product.descripcion}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-primary">Bs. {product.precio_venta.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock_actual}</p>
                </div>
              </div>

              <AddToCartButton
                product={product}
                className="w-full"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;