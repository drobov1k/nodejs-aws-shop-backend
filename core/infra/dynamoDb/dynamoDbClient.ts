import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  TransactWriteCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { TransactWriteItem } from '@aws-sdk/client-dynamodb';
import { dynamoDbClientBase } from './dynamoDbClient.base';
import { IClient } from '../types';

export class DynamoDbClient implements IClient {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;
  private readonly pk: string;

  constructor(tableName: string, pk: string) {
    this.docClient = DynamoDBDocumentClient.from(dynamoDbClientBase);
    this.tableName = tableName;
    this.pk = pk;
  }

  async getOne<T>(key: string): Promise<T | null> {
    const { Item } = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { [this.pk]: key },
      }),
    );

    if (Item) return Item as T;

    return null;
  }

  async getAll<T>(): Promise<T[]> {
    const { Items } = await this.docClient.send(new ScanCommand({ TableName: this.tableName }));

    return Items as T[];
  }

  async save<T>(item: Partial<T>): Promise<T> {
    return Promise.resolve(item) as Promise<T>;
  }

  async transactional(...transactions: TransactWriteItem[]): Promise<void> {
    await this.docClient.send(
      new TransactWriteCommand({
        TransactItems: transactions,
      }),
    );
  }

  async batchGet<T>(keys: Array<string | number>): Promise<T[]> {
    const { Responses } = await this.docClient.send(
      new BatchGetCommand({
        RequestItems: {
          [this.tableName]: {
            Keys: keys.map((key) => ({ [this.pk]: key })),
          },
        },
      }),
    );

    return Responses[this.tableName] as T[];
  }

  async batchInsert<T>(items: T[]): Promise<void> {
    await this.docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: items.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      }),
    );
  }
}
