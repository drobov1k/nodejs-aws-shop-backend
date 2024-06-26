import { Stock } from './stock';

export interface Product {
  id: string;
  title: string;
  price: number;
  description?: string;
}

export type ProductWithStock = Product & Pick<Stock, 'count'>;
