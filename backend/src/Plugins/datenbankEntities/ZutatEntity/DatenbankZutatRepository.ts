import { ZutatRepository } from "../../../Adapters/Repositorys/ZutatRepository";
import { ZutatRecord } from "../../../Adapters/Records/ZutatRecord";
import { ZutatEntity } from "./zutat.entity";
import { Repository as TypeORMRepository } from "typeorm";

export class DatenbankZutatRepository implements ZutatRepository {
    private static instance: DatenbankZutatRepository

    zutatRepository: TypeORMRepository<ZutatEntity>

    private constructor(zutatEntityRepository: TypeORMRepository<ZutatEntity>) {
        this.zutatRepository = zutatEntityRepository
    }
    

    static getInstance(zutatEntityRepository: TypeORMRepository<ZutatEntity>): DatenbankZutatRepository {
        if (!DatenbankZutatRepository.instance) {
            DatenbankZutatRepository.instance = new DatenbankZutatRepository(zutatEntityRepository)
        }

        return DatenbankZutatRepository.instance
    }
    
    async findAll(): Promise<ZutatRecord[]> {
        const zutatResults = await this.zutatRepository.find()
        return zutatResults.map((zutatEntity) => this.zutatEntityzuZutatRecord(zutatEntity));
    }
    async findOneByOrFail(rezeptId: number, lebensmittelId: number): Promise<ZutatRecord> {
        const zutatResult = await this.zutatRepository.findOneByOrFail({rezeptId, lebensmittelId})
        return this.zutatEntityzuZutatRecord(zutatResult)
    }
    async findOneBy(searchParam: object): Promise<ZutatRecord | null> {
        const zutatResult = await this.zutatRepository.findOne({ where: searchParam })
        if (!zutatResult) return zutatResult
        return this.zutatEntityzuZutatRecord(zutatResult)
    }
    async save(zutat: ZutatRecord): Promise<ZutatRecord> {
        const zutatEntity: ZutatEntity = zutat
        const zutatResult = await this.zutatRepository.save(zutatEntity)
        return this.zutatEntityzuZutatRecord(zutatResult)
    }
    async delete(rezeptId: number, lebensmittelId: number): Promise<any> {
        return await this.zutatRepository.delete({rezeptId, lebensmittelId})
    }
    
    async getByRezeptId(rezeptId: number): Promise<ZutatRecord[]> {
        const zutatResults = await this.zutatRepository.findBy({rezeptId})
        return zutatResults.map((zutatEntity) => this.zutatEntityzuZutatRecord(zutatEntity));
    }
    async deleteByRezeptId(rezeptId: number): Promise<any> {
        return await this.zutatRepository.delete({rezeptId})
    }

    private zutatEntityzuZutatRecord(zutatEntity: ZutatEntity): ZutatRecord {
        const lebensmittel: ZutatRecord = zutatEntity

        return lebensmittel;
    }
}