import type { Producto } from '../../types/entities/product';

export interface CartItem {
  product: Producto;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}