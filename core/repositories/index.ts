import { ProductRepository } from './productRepository';
import { StockRepository } from './stockRepository';

const productRepository = new ProductRepository();
const stockRepository = new StockRepository();

export { productRepository, stockRepository };
