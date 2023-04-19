import { Repository } from "../../../Adapters/Repositorys/Repository";
import { LebensmittelRecord } from "../../../Adapters/Records/LebensmittelRecord";
import { LebensmittelEntity } from "./lebensmittel.entity";
import { Repository as TypeORMRepository } from "typeorm";

export class DatenbankLebensmittelRepository implements Repository<LebensmittelRecord> {
    private static instance: DatenbankLebensmittelRepository

    lebensmittelRepository: TypeORMRepository<LebensmittelEntity>;

    private constructor(lebensmittelEntityRepository: TypeORMRepository<LebensmittelEntity>) {
        this.lebensmittelRepository = lebensmittelEntityRepository
    }

    static getInstance(lebensmittelEntityRepository: TypeORMRepository<LebensmittelEntity>): DatenbankLebensmittelRepository {
        if (!DatenbankLebensmittelRepository.instance) {
            DatenbankLebensmittelRepository.instance = new DatenbankLebensmittelRepository(lebensmittelEntityRepository)
        }

        return DatenbankLebensmittelRepository.instance
    }

    async find(): Promise<LebensmittelRecord[]> {
        const lebensmittelResults = await this.lebensmittelRepository.find()
        return lebensmittelResults.map((lebensmittelEntity) => this.lebensmittelEntityZuLebensmittenRecord(lebensmittelEntity));
    }
    async findOneByOrFail(searchParam: object): Promise<LebensmittelRecord> {
        const lebensmittelResult = await this.lebensmittelRepository.findOneByOrFail(searchParam)
        return this.lebensmittelEntityZuLebensmittenRecord(lebensmittelResult)
    }
    async findOneBy(searchParam: object): Promise<LebensmittelRecord | null> {
        console.log(searchParam)
        const lebensmittelResult = await this.lebensmittelRepository.findOne({where: searchParam})
        if (!lebensmittelResult) return lebensmittelResult
        return this.lebensmittelEntityZuLebensmittenRecord(lebensmittelResult)
    }
    async save(lebensmittel: LebensmittelRecord): Promise<LebensmittelRecord> {
        const lebensmittelEntity: LebensmittelEntity = {id: lebensmittel.id, name: lebensmittel.name, typ: lebensmittel.typ}
        const lebensmittelResult = await this.lebensmittelRepository.save(lebensmittelEntity)
        return this.lebensmittelEntityZuLebensmittenRecord(lebensmittelResult)
    }
    async delete(searchParam: object): Promise<void> {
        await this.lebensmittelRepository.delete(searchParam)
    }

    private lebensmittelEntityZuLebensmittenRecord(lebensmittelEntity: LebensmittelEntity): LebensmittelRecord {
        const lebensmittel: LebensmittelRecord = { id: lebensmittelEntity.id, name: lebensmittelEntity.name, typ: lebensmittelEntity.typ};

        return lebensmittel;
    }
  }