import React, { useState, useMemo } from 'react';
import { Card, Button } from '../atoms';
import { DataTable } from '../molecules';
import { Icon } from '../atoms';
import type { Sale, Book, User } from '../../types';

interface SalesReportProps {
  sales: Sale[];
  products: Book[];
  users: User[];
  loading?: boolean;
}

interface SalesMetrics {
  totalSales: number;
  totalRevenue: number;
  averageSale: number;
  topProducts: Array<{
    productId: number;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  salesByPeriod: Array<{
    period: string;
    sales: number;
    revenue: number;
  }>;
  salesByUser: Array<{
    userId: number;
    userName: string;
    salesCount: number;
    totalRevenue: number;
  }>;
}

const SalesReport: React.FC<SalesReportProps> = ({
  sales,
  products,
  users,
  loading = false
}) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDateRaw = sale.datetime ?? sale.fecha_hora;
      const saleDate = new Date(saleDateRaw ?? new Date()).toISOString().split('T')[0];
      return saleDate >= dateRange.start && saleDate <= dateRange.end;
    });
  }, [sales, dateRange]);

  const metrics: SalesMetrics = useMemo(() => {
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Top products
    const productSales = new Map<number, { quantity: number; revenue: number }>();
    filteredSales.forEach(sale => {
      (sale.details ?? sale.detalles)?.forEach(detail => {
        const bookId = detail.bookId ?? detail.libro_id ?? detail.productId ?? detail.producto_id;
        const quantity = detail.quantity ?? detail.cantidad ?? 0;
        const unitPrice = detail.unitPrice ?? detail.precio_unitario ?? 0;
        const current = productSales.get(bookId ?? 0) || { quantity: 0, revenue: 0 };
        productSales.set(bookId ?? 0, {
          quantity: current.quantity + quantity,
          revenue: current.revenue + quantity * unitPrice
        });
      });
    });

    const topProducts = Array.from(productSales.entries())
      .map(([productId, data]) => {
        const product = products.find(p => (p.bookId ?? p.libro_id) === productId);
        return {
          productId,
          productName: product?.title ?? product?.titulo ?? 'Libro desconocido',
          quantitySold: data.quantity,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Sales by period (daily)
    const salesByPeriod = new Map<string, { sales: number; revenue: number }>();
    filteredSales.forEach(sale => {
      const date = new Date(sale.datetime ?? sale.fecha_hora ?? new Date()).toISOString().split('T')[0];
      const current = salesByPeriod.get(date) || { sales: 0, revenue: 0 };
      salesByPeriod.set(date, {
        sales: current.sales + 1,
        revenue: current.revenue + sale.total
      });
    });

    const salesByPeriodArray = Array.from(salesByPeriod.entries())
      .map(([period, data]) => ({ period, ...data }))
      .sort((a, b) => a.period.localeCompare(b.period));

    // Sales by user
    const userSales = new Map<number, { salesCount: number; totalRevenue: number }>();
    filteredSales.forEach(sale => {
      const employeeId = sale.employeeId ?? sale.empleado_id;
      if (employeeId === undefined) return;
      const current = userSales.get(employeeId) || { salesCount: 0, totalRevenue: 0 };
      userSales.set(employeeId, {
        salesCount: current.salesCount + 1,
        totalRevenue: current.totalRevenue + sale.total
      });
    });

    const salesByUser = Array.from(userSales.entries())
      .map(([userId, data]) => {
        const user = users.find(u => (u.userId ?? u.usuario_id) === userId);
        return {
          userId,
          userName: user?.name ?? user?.nombre ?? 'Usuario desconocido',
          ...data
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
      totalSales,
      totalRevenue,
      averageSale,
      topProducts,
      salesByPeriod: salesByPeriodArray,
      salesByUser
    };
  }, [filteredSales, products, users]);

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting sales report...');
  };

  const topProductsColumns = [
    {
      key: 'productName',
      header: 'Producto',
      sortable: true
    },
    {
      key: 'quantitySold',
      header: 'Cantidad Vendida',
      sortable: true,
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'revenue',
      header: 'Ingresos',
      sortable: true,
      render: (value: number) => `Bs. ${value.toFixed(2)}`
    }
  ];

  const salesByUserColumns = [
    {
      key: 'userName',
      header: 'Empleado',
      sortable: true
    },
    {
      key: 'salesCount',
      header: 'Ventas Realizadas',
      sortable: true,
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'totalRevenue',
      header: 'Total Ingresos',
      sortable: true,
      render: (value: number) => `Bs. ${value.toFixed(2)}`
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="loading" size="lg" className="animate-spin text-primary mr-2" />
        <span>Cargando reporte...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reporte de Ventas</h2>
          <p className="text-gray-600">Análisis detallado de las ventas realizadas</p>
        </div>
        <Button onClick={handleExport}>
          <Icon name="edit" size="sm" className="mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <Icon name="success" size="lg" className="text-success mx-auto mb-2" />
          <div className="text-3xl font-bold text-success">{metrics.totalSales}</div>
          <div className="text-sm text-gray-600">Total Ventas</div>
        </Card>

        <Card className="p-6 text-center">
          <Icon name="info" size="lg" className="text-primary mx-auto mb-2" />
          <div className="text-3xl font-bold text-primary">
            Bs. {metrics.totalRevenue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Ingresos Totales</div>
        </Card>

        <Card className="p-6 text-center">
          <Icon name="warning" size="lg" className="text-warning mx-auto mb-2" />
          <div className="text-3xl font-bold text-warning">
            Bs. {metrics.averageSale.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Venta Promedio</div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
        <DataTable
          data={metrics.topProducts}
          columns={topProductsColumns}
          emptyMessage="No hay datos de ventas para el período seleccionado"
        />
      </Card>

      {/* Sales by User */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Empleado</h3>
        <DataTable
          data={metrics.salesByUser}
          columns={salesByUserColumns}
          emptyMessage="No hay datos de empleados para el período seleccionado"
        />
      </Card>

      {/* Sales Trend (Simple visualization) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ventas</h3>
        <div className="space-y-2">
          {metrics.salesByPeriod.slice(-7).map((period) => (
            <div key={period.period} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-900">
                {new Date(period.period).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{period.sales} ventas</span>
                <span className="text-sm font-medium text-gray-900">
                  Bs. {period.revenue.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SalesReport;
