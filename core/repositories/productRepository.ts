import { BaseRepository } from './repository.base';
import { Product } from '../domain/product';
import { products } from './mocks';

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(products);
  }
}
