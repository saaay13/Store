import type { Libro } from '../../types';

export interface CartItem {
  libro: Libro;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}