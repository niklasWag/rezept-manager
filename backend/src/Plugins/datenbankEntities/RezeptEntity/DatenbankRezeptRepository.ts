import { Repository } from "../../../Adapters/Repositorys/Repository";
import { RezeptRecord } from "../../../Adapters/Records/RezeptRecord";
import { RezeptEntity } from "./rezept.entity";
import { dataSource } from "../../DatenbankAdapter";
import { Repository as TypeORMRepository } from "typeorm";

export class DatenbankRezeptRepository implements Repository<RezeptRecord> {
    private static instance: DatenbankRezeptRepository

    rezeptRepository: TypeORMRepository<RezeptEntity>

    private constructor(rezeptEntityRepository: TypeORMRepository<RezeptEntity>) {
        this.rezeptRepository = rezeptEntityRepository
    }

    static getInstance(rezeptEntityRepository: TypeORMRepository<RezeptEntity>): DatenbankRezeptRepository {
        if (!DatenbankRezeptRepository.instance) {
            DatenbankRezeptRepository.instance = new DatenbankRezeptRepository(rezeptEntityRepository)
        }

        return DatenbankRezeptRepository.instance
    }

    async find(): Promise<RezeptRecord[]> {
        const rezeptResults = await this.rezeptRepository.find()
        return rezeptResults.map((rezeptEntity) => this.rezeptEntityzuRezeptRecord(rezeptEntity));
    }
    async findOneByOrFail(searchParam: object): Promise<RezeptRecord> {
        const rezeptResult = await this.rezeptRepository.findOneByOrFail(searchParam)
        return this.rezeptEntityzuRezeptRecord(rezeptResult)
    }
    async findOneBy(searchParam: object): Promise<RezeptRecord | null> {
        const rezeptResult = await this.rezeptRepository.findOne({ where: searchParam })
        if (!rezeptResult) return rezeptResult
        return this.rezeptEntityzuRezeptRecord(rezeptResult)
    }
    async save(rezept: RezeptRecord): Promise<RezeptRecord> {
        const rezeptEntity: RezeptEntity = { id: rezept.id, name: rezept.name, aufwand: rezept.aufwand }
        const rezeptResult = await this.rezeptRepository.save(rezeptEntity)
        return this.rezeptEntityzuRezeptRecord(rezeptResult)
    }
    async delete(searchParam: object): Promise<void> {
        await this.rezeptRepository.delete(searchParam)
    }

    private rezeptEntityzuRezeptRecord(rezeptEntity: RezeptEntity): RezeptRecord {
        const lebensmittel: RezeptRecord = {id: rezeptEntity.id, name: rezeptEntity.name, aufwand: rezeptEntity.aufwand};

        return lebensmittel;
    }
}