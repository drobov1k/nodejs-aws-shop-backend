import { BaseService } from './service.base';
import { Product } from '../domain/product';
import { ProductRepository } from '../repositories/productRepository';

interface IProductService {}

export class ProductService extends BaseService<Product> implements IProductService {
  constructor(repository: ProductRepository = new ProductRepository()) {
    super(repository);
  }
}
