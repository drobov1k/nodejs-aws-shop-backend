import { IBaseRepository } from '../repositories/repository.base';

interface IBaseService<T> {
  getOne(id: string): Promise<T | null>;
  getAll(): Promise<T[]>;
}

export class BaseService<T> implements IBaseService<T> {
  constructor(protected repository: IBaseRepository<T>) {}

  async getOne(id: string): Promise<T | null> {
    return this.repository.findOne(id);
  }

  async getAll(): Promise<T[]> {
    return this.repository.findAll();
  }
}
