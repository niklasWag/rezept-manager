import { dataSource } from "../../datenbankAdapter"
import { RezeptZutatEntity } from "./rezeptZutat.entity"
import { DeleteResult } from 'typeorm'

export class RezeptZutatEntityManager {
  private static instance: RezeptZutatEntityManager

  rezeptZutatRepository = dataSource.getRepository(RezeptZutatEntity)

  private constructor() {}

  static getInstance(): RezeptZutatEntityManager {
    if (!RezeptZutatEntityManager.instance) {
      RezeptZutatEntityManager.instance = new RezeptZutatEntityManager()
    }

    return RezeptZutatEntityManager.instance
  }

  async getAll(): Promise<RezeptZutatEntity[]> {
    return await this.rezeptZutatRepository.find()
  }

  async getById(rezeptId: number, zutatId: number): Promise<RezeptZutatEntity> {
    return await this.rezeptZutatRepository.findOneByOrFail({rezeptId, zutatId})
  }

  async getByRezeptId(rezeptId: number): Promise<RezeptZutatEntity[]> {
    return await this.rezeptZutatRepository.findBy({rezeptId})
  }

  async save(rezeptZutatEntity: RezeptZutatEntity): Promise<RezeptZutatEntity> {
    return await this.rezeptZutatRepository.save(rezeptZutatEntity)
  }

  async delete(rezeptId: number, zutatId: number): Promise<DeleteResult> {
    return await this.rezeptZutatRepository.delete({rezeptId, zutatId})
  }

  async deleteByRezeptId(rezeptId: number): Promise<DeleteResult> {
    return await this.rezeptZutatRepository.delete({rezeptId})
  }
}