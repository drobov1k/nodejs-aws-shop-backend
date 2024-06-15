import { IBaseRepository } from '../repositories/repository.base';

interface IBaseService<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  // create(item: T): Promise<T>;
  // update(id: string, item: T): Promise<T | null>;
  // delete(id: string): Promise<boolean>;
}

export class BaseService<T> implements IBaseService<T> {
  constructor(private repository: IBaseRepository<T>) {}

  async getById(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }

  async getAll(): Promise<T[]> {
    return this.repository.findAll();
  }
}
