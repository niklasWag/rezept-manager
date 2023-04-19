import { ZutatRecord } from "../Records/ZutatRecord";

export interface ZutatRepository {
    find(): Promise<ZutatRecord[]>;
    findOneByOrFail(searchParam: object): Promise<ZutatRecord>;
    findOneBy(searchParam: object): Promise<ZutatRecord | null>;
    save(input: ZutatRecord): Promise<ZutatRecord>;
    delete(searchParam: object): Promise<void>;
    getByRezeptId(searchParam: object): Promise<ZutatRecord[]>
    deleteByRezeptId(searchParam: object): Promise<void>
}