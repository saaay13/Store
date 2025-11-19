import { Card } from '../components/atoms';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800">Productos</h3>
          <p className="text-3xl font-bold text-primary mt-2">0</p>
          <p className="text-sm text-gray-600">Total registrados</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800">Ventas Hoy</h3>
          <p className="text-3xl font-bold text-success mt-2">0</p>
          <p className="text-sm text-gray-600">Bs. 0.00</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800">Stock Bajo</h3>
          <p className="text-3xl font-bold text-warning mt-2">0</p>
          <p className="text-sm text-gray-600">Productos</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800">Usuarios</h3>
          <p className="text-3xl font-bold text-secondary mt-2">0</p>
          <p className="text-sm text-gray-600">Activos</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ventas Recientes</h3>
          <p className="text-gray-600">No hay ventas recientes</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Productos Más Vendidos</h3>
          <p className="text-gray-600">No hay datos disponibles</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;