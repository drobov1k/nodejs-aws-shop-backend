import { IClient } from '../infra/types';

export interface IBaseRepository<T> {
  findOne(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: Partial<T>): Promise<T>;
}

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected client: IClient) {}

  async findOne(id: string): Promise<T | null> {
    return this.client.getOne(id);
  }

  async findAll(): Promise<T[]> {
    return this.client.getAll();
  }

  async create(item: Partial<T>): Promise<T> {
    return this.client.save(item);
  }
}
