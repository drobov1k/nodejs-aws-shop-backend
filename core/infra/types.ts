import { TransactWriteItem } from '@aws-sdk/client-dynamodb';

export interface IClient {
  getOne<T>(key: string): Promise<T | null>;
  getAll<T>(): Promise<T[]>;
  save<T>(item: Partial<T>): Promise<T>;
  transactional(...transactions: TransactWriteItem[]): Promise<void>;
  batchGet<T>(keys: Array<string | number>): Promise<T[]>;
  batchInsert<T>(items: T[]): Promise<void>;
}
