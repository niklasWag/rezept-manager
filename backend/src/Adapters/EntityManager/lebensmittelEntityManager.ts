// import { Lebensmittel } from "kern-util";
import { LebensmittelRecord } from "../Records/LebensmittelRecord"
import { Repository } from "../Repositorys/Repository"

export class LebensmittelEntityManager {
  private static instance: LebensmittelEntityManager
  private lebensmittelRepository: Repository<LebensmittelRecord>

  private constructor(lebensmittelRepository: Repository<LebensmittelRecord>) {
    this.lebensmittelRepository = lebensmittelRepository
  }

  static getInstance(lebensmittelRepository: Repository<LebensmittelRecord>): LebensmittelEntityManager {
    if (!LebensmittelEntityManager.instance) {
      LebensmittelEntityManager.instance = new LebensmittelEntityManager(lebensmittelRepository)
    }

    return LebensmittelEntityManager.instance
  }

  async getAll(): Promise<LebensmittelRecord[]> {
    return await this.lebensmittelRepository.find()
  }

  async getById(id: number): Promise<LebensmittelRecord> {
    return await this.lebensmittelRepository.findOneByOrFail({id})
  }

  async save(lebensmittel: LebensmittelRecord): Promise<LebensmittelRecord> {
    return await this.lebensmittelRepository.save(lebensmittel)
  }

  async delete(id: number): Promise<void> {
    await this.lebensmittelRepository.delete({id})
  }
}