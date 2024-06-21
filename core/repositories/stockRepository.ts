import { Stock } from '../domain/stock';
import { Product } from '../domain/product';
import { DynamoDbClient } from '../infra/dynamoDb';
import Config from '../../config';
import { BaseRepository } from './repository.base';

interface IStockRepository {
  findByProducts(products: Array<Product>): Promise<Stock[]>;
}

export class StockRepository extends BaseRepository<Stock> implements IStockRepository {
  constructor() {
    super(new DynamoDbClient(Config.DYNAMODB_STOCKS_TABLE, 'product_id'));
  }

  async findByProducts(products: Array<Product>): Promise<Stock[]> {
    return this.client.batchGet(products.map(({ id }) => id));
  }
}
