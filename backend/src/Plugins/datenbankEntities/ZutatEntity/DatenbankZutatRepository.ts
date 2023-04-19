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
    
    async find(): Promise<ZutatRecord[]> {
        const zutatResults = await this.zutatRepository.find()
        return zutatResults.map((zutatEntity) => this.zutatEntityzuZutatRecord(zutatEntity));
    }
    async findOneByOrFail(searchParam: object): Promise<ZutatRecord> {
        const zutatResult = await this.zutatRepository.findOneByOrFail(searchParam)
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
    async delete(searchParam: object): Promise<void> {
        await this.zutatRepository.delete(searchParam)
    }
    
    async getByRezeptId(searchParam: object): Promise<ZutatRecord[]> {
        const zutatResults = await this.zutatRepository.findBy(searchParam)
        return zutatResults.map((zutatEntity) => this.zutatEntityzuZutatRecord(zutatEntity));
    }
    async deleteByRezeptId(searchParam: object): Promise<void> {
        await this.zutatRepository.delete(searchParam)
    }

    private zutatEntityzuZutatRecord(zutatEntity: ZutatEntity): ZutatRecord {
        const lebensmittel: ZutatRecord = zutatEntity

        return lebensmittel;
    }
}