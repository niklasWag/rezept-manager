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

    async findAll(): Promise<LebensmittelRecord[]> {
        const lebensmittelResults = await this.lebensmittelRepository.find()
        return lebensmittelResults.map((lebensmittelEntity) => this.lebensmittelEntityZuLebensmittenRecord(lebensmittelEntity));
    }
    async findOneByOrFail(id: number): Promise<LebensmittelRecord> {
        const lebensmittelResult = await this.lebensmittelRepository.findOneByOrFail({id})
        return this.lebensmittelEntityZuLebensmittenRecord(lebensmittelResult)
    }
    async findOneBy(searchParam: object): Promise<LebensmittelRecord | null> {
        const lebensmittelResult = await this.lebensmittelRepository.findOne({where: searchParam})
        if (!lebensmittelResult) return lebensmittelResult
        return this.lebensmittelEntityZuLebensmittenRecord(lebensmittelResult)
    }
    async save(lebensmittel: LebensmittelRecord): Promise<LebensmittelRecord> {
        const lebensmittelEntity: LebensmittelEntity = {id: lebensmittel.id, name: lebensmittel.name, typ: lebensmittel.typ}
        const lebensmittelResult = await this.lebensmittelRepository.save(lebensmittelEntity)
        return this.lebensmittelEntityZuLebensmittenRecord(lebensmittelResult)
    }
    async delete(id: number): Promise<any> {
        return await this.lebensmittelRepository.delete({id})
    }

    private lebensmittelEntityZuLebensmittenRecord(lebensmittelEntity: LebensmittelEntity): LebensmittelRecord {
        const lebensmittel: LebensmittelRecord = { id: lebensmittelEntity.id, name: lebensmittelEntity.name, typ: lebensmittelEntity.typ};

        return lebensmittel;
    }
  }