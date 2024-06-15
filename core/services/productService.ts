import { BaseService } from './service.base';
import { Product } from '../domain/product';
import { ProductRepository } from '../repositories/productRepository';

export class ProductService extends BaseService<Product> {
  constructor(repository: ProductRepository) {
    super(repository);
  }
}
