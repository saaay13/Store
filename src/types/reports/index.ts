// ==================== REPORTS ====================

import type { Book } from "../entities/book";
import type { Category } from "../entities/category";
import type { PaymentMethod } from "../entities/payment-method";

export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  topSellingProducts: Array<{
    product: Book;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  salesByPaymentMethod: Array<{
    paymentMethod: PaymentMethod;
    salesCount: number;
    total: number;
  }>;
  salesByPeriod: Array<{
    date: string;
    salesCount: number;
    total: number;
  }>;
}

export interface InventoryReport {
  lowStockProducts: Book[];
  totalInventoryValue: number;
  productsByCategory: Array<{
    category: Category;
    productCount: number;
    totalValue: number;
  }>;
}
