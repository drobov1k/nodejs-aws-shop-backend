interface IHasId {
  id: string;
}

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export class BaseRepository<T extends IHasId> implements IBaseRepository<T> {
  constructor(private items: Array<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }
}
