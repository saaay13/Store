import type { Book } from '../../types';

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
