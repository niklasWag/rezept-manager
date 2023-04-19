export interface Repository<T> {
    find(): Promise<T[]>;
    findOneByOrFail(searchParam: object): Promise<T>;
    findOneBy(searchParam: object): Promise<T | null>;
    save(input: T): Promise<T>;
    delete(searchParam: object): Promise<void>;
  }