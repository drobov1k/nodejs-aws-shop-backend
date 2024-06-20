import { IBaseRepository } from '../repositories/repository.base';

interface IBaseService<T> {
  getById(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
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
