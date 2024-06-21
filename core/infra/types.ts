import { TransactWriteItem } from '@aws-sdk/client-dynamodb';

export interface IClient {
  getOne<T>(key: string): Promise<T | null>;
  getAll<T>(): Promise<T[]>;
  save<T>(item: Partial<T>): Promise<void>;
  transactional(...transactions: TransactWriteItem[]): Promise<void>;
}
