import type { Item } from './Item';

export interface ItemizedBill {
  title: string;
  items: Item[];
  tax: number;
  subtotal: number;
  total: number;
}
