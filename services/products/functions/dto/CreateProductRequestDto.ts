import { Product } from '@core/domain/product';
import { Stock } from '@core/domain/stock';

export type CreateProductRequestDto = Omit<Product, 'id'> & Pick<Stock, 'count'>;
