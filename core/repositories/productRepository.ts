import { v4 as uuidv4 } from 'uuid';
import { BaseRepository } from './repository.base';
import { Product } from '../domain/product';
import { Stock } from '../domain/stock';
import { DynamoDbClient } from '../infra/dynamoDb';
import Config from '../../config';

interface IProductRepository {
  create(item: Partial<Product>): Promise<void>;
}

export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  constructor() {
    super(new DynamoDbClient(Config.DYNAMODB_PRODUCTS_TABLE, 'id'));
  }

  async create({ title, description, price, count }: Omit<Product, 'id'> & Pick<Stock, 'count'>): Promise<void> {
    return this.client.transactional(
      {
        Put: {
          TableName: Config.DYNAMODB_PRODUCTS_TABLE,
          Item: {
            id: { S: uuidv4() },
            title: { S: title },
            description: { S: description },
            price: { N: price.toString() },
          },
        },
      },
      {
        Put: {
          TableName: Config.DYNAMODB_STOCKS_TABLE,
          Item: {
            product_id: { S: uuidv4() },
            count: { N: count.toString() },
          },
        },
      },
    );
  }
}
