import { Lebensmittel } from "kern-util";
// import { dataSource } from "../../datenbankAdapter";
// import { LebensmittelEntity } from "./lebensmittel.entity";
// import { DeleteResult } from "typeorm";
import { LebensmittelRepository } from "./LebensmittelRepository"

export class LebensmittelEntityManager {
  private static instance: LebensmittelEntityManager
  private lebensmittelRepository: LebensmittelRepository

  // lebensmittelRepository = dataSource.getRepository(LebensmittelEntity)

  private constructor(lebensmittelRepository: LebensmittelRepository) {
    this.lebensmittelRepository = lebensmittelRepository
  }

  static getInstance(lebensmittelRepository: LebensmittelRepository): LebensmittelEntityManager {
    if (!LebensmittelEntityManager.instance) {
      LebensmittelEntityManager.instance = new LebensmittelEntityManager(lebensmittelRepository)
    }

    return LebensmittelEntityManager.instance
  }

  async getAll(): Promise<Lebensmittel[]> {
    return await this.lebensmittelRepository.find()
  }

  async getById(id: number): Promise<Lebensmittel> {
    return await this.lebensmittelRepository.findOneByOrFail(id)
  }

  async save(lebensmittel: Lebensmittel): Promise<Lebensmittel> {
    // const lebensmittelEntity: LebensmittelEntity = {id: lebensmittel.getId(), name: lebensmittel.name, typ: lebensmittel.typ}
    return await this.lebensmittelRepository.save(lebensmittel)
  }

  async delete(id: number): Promise<void> {
    await this.lebensmittelRepository.delete(id)
  }
}