import { Lebensmittel } from "kern-util";
import { dataSource } from "../../datenbankAdapter";
import { LebensmittelEntity } from "./lebensmittel.entity";
import { DeleteResult } from "typeorm";

export class LebensmittelEntityManager {
  private static instance: LebensmittelEntityManager

  lebensmittelRepository = dataSource.getRepository(LebensmittelEntity)

  private constructor() {}

  static getInstance(): LebensmittelEntityManager {
    if (!LebensmittelEntityManager.instance) {
      LebensmittelEntityManager.instance = new LebensmittelEntityManager()
    }

    return LebensmittelEntityManager.instance
  }

  async getAll(): Promise<LebensmittelEntity[]> {
    return await this.lebensmittelRepository.find()
  }

  async getById(id: number): Promise<LebensmittelEntity> {
    return await this.lebensmittelRepository.findOneByOrFail({id})
  }

  async save(lebensmittel: Lebensmittel): Promise<LebensmittelEntity> {
    const lebensmittelEntity: LebensmittelEntity = {id: lebensmittel.getId(), name: lebensmittel.name, typ: lebensmittel.typ}
    return await this.lebensmittelRepository.save(lebensmittelEntity)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.lebensmittelRepository.delete(id)
  }
}