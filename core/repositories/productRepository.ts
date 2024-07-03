import { v4 as uuidv4 } from 'uuid';
import { Product, ProductWithStock } from '../domain/product';
import { DynamoDbClient } from '../infra/dynamoDb';
import Config from '../../config';
import { BaseRepository } from './repository.base';
import { StockRepository } from './stockRepository';

interface IProductRepository {
  create(item: Omit<ProductWithStock, 'id'>): Promise<ProductWithStock>;
  findAllWithStocks(): Promise<ProductWithStock[]>;
  insertWithStocks(productsWithStock: ProductWithStock[]): Promise<void>;
}

export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  private stockRepository: StockRepository;

  constructor() {
    super(new DynamoDbClient(Config.DYNAMODB_PRODUCTS_TABLE, 'id'));
    this.stockRepository = new StockRepository();
  }

  async create({ title, description, price, count }: Omit<ProductWithStock, 'id'>): Promise<ProductWithStock> {
    const productId = uuidv4();

    await this.client.transactional(
      {
        Put: {
          TableName: Config.DYNAMODB_PRODUCTS_TABLE,
          Item: {
            id: productId,
            title,
            price,
            ...(description && { description }),
          },
        },
      },
      {
        Put: {
          TableName: Config.DYNAMODB_STOCKS_TABLE,
          Item: {
            count,
            product_id: productId,
          },
        },
      },
    );

    return {
      id: productId,
      title,
      price,
      count,
      ...(description && { description }),
    };
  }

  async findAllWithStocks(): Promise<ProductWithStock[]> {
    const products = await this.findAll();
    const stocks = await this.stockRepository.findByProducts(products);

    return products.map((p) => ({
      ...p,
      count: stocks.find(({ product_id }) => product_id === p.id)?.count ?? 0,
    }));
  }

  async insertWithStocks(productsWithStock: ProductWithStock[]): Promise<void> {
    const products = productsWithStock.map((product) => ({ ...product, id: uuidv4() }));

    await this.client.batchInsert(products.map(({ count: _, ...product }) => product));
    await this.stockRepository.batchInsert(products.map(({ count, id }) => ({ product_id: id, count })));
  }
}
