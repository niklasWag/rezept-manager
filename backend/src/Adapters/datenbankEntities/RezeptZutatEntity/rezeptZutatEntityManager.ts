import { dataSource } from "../../DatenbankAdapter"
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

  async getById(id: number): Promise<RezeptZutatEntity> {
    return await this.rezeptZutatRepository.findOneByOrFail({id})
  }

  async save(rezeptZutatEntity: RezeptZutatEntity): Promise<RezeptZutatEntity> {
    return await this.rezeptZutatRepository.save(rezeptZutatEntity)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.rezeptZutatRepository.delete(id)
  }
}