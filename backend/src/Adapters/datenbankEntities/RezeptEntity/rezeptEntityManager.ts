import { Rezept } from "kern-util"
import { dataSource } from "../../DatenbankAdapter"
import { RezeptEntity } from "./rezept.entity"
import { DeleteResult } from 'typeorm'

export class RezeptEntityManager {
  private static instance: RezeptEntityManager

  rezeptRepository = dataSource.getRepository(RezeptEntity)

  private constructor() {}

  static getInstance(): RezeptEntityManager {
    if (!RezeptEntityManager.instance) {
      RezeptEntityManager.instance = new RezeptEntityManager()
    }

    return RezeptEntityManager.instance
  }

  async getAll(): Promise<RezeptEntity[]> {
    return await this.rezeptRepository.find()
  }

  async getById(id: number): Promise<RezeptEntity> {
    return await this.rezeptRepository.findOneByOrFail({id})
  }

  async save(rezept: Rezept): Promise<RezeptEntity> {
    return await this.rezeptRepository.save(rezept)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.rezeptRepository.delete(id)
  }
}