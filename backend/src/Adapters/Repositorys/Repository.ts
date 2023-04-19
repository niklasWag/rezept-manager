export interface Repository<T> {
    findAll(): Promise<T[]>;
    findOneByOrFail(id: number): Promise<T>;
    findOneBy(searchParam: object): Promise<T | null>;
    save(input: T): Promise<T>;
    delete(id: number): Promise<any>;
  }