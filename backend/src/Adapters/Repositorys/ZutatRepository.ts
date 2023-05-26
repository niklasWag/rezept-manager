import { ZutatRecord } from "../Records/ZutatRecord";

export interface ZutatRepository {
    findAll(): Promise<ZutatRecord[]>;
    findOneByOrFail(rezeptId: number, lebensmittelId: number): Promise<ZutatRecord>;
    findOneBy(searchParam: object): Promise<ZutatRecord | null>;
    save(input: ZutatRecord): Promise<ZutatRecord>;
    delete(rezeptId: number, lebensmittelId: number): Promise<any>;
    getByRezeptId(rezeptId: number): Promise<ZutatRecord[]>
    deleteByRezeptId(rezeptId: number): Promise<any>
}