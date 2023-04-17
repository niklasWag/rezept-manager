import { LebensmittelRepository } from "./LebensmittelEntity/LebensmittelRepository";
import { Lebensmittel, LebensmittelTyp } from 'kern-util'
import { LebensmittelEntity } from "./LebensmittelEntity/lebensmittel.entity";
import { dataSource } from "../datenbankAdapter";

export class DatenbankLebensmittelRepository implements LebensmittelRepository {
    private static instance: DatenbankLebensmittelRepository

    lebensmittelRepository = dataSource.getRepository(LebensmittelEntity)

    private constructor() {}

    static getInstance(): DatenbankLebensmittelRepository {
        if (!DatenbankLebensmittelRepository.instance) {
            DatenbankLebensmittelRepository.instance = new DatenbankLebensmittelRepository()
        }

        return DatenbankLebensmittelRepository.instance
    }

    async find(): Promise<Lebensmittel[]> {
        const lebensmittelResults = await this.lebensmittelRepository.find()
        return lebensmittelResults.map((lebensmittelEntity) => this.lebensmittelEntityZuLebensmitten(lebensmittelEntity));
    }
    async findOneByOrFail(id: number): Promise<Lebensmittel> {
        const lebensmittelResult =  await this.lebensmittelRepository.findOneByOrFail({id})
        return this.lebensmittelEntityZuLebensmitten(lebensmittelResult)
    }
    async save(lebensmittel: Lebensmittel): Promise<Lebensmittel> {
        const lebensmittelEntity: LebensmittelEntity = {id: lebensmittel.getId(), name: lebensmittel.name, typ: lebensmittel.typ}
        const lebensmittelResult = await this.lebensmittelRepository.save(lebensmittelEntity)
        return this.lebensmittelEntityZuLebensmitten(lebensmittelResult)
    }
    async delete(id: number): Promise<void> {
        await this.lebensmittelRepository.delete(id)
    }

    private lebensmittelEntityZuLebensmitten(lebensmittelEntity: LebensmittelEntity): Lebensmittel {
        const lebensmittel: Lebensmittel = new Lebensmittel(lebensmittelEntity.id, lebensmittelEntity.name, lebensmittelEntity.typ as LebensmittelTyp);

        return lebensmittel;
    }
  }