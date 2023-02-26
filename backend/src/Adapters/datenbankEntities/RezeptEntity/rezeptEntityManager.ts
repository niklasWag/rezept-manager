import { Rezept } from "kern-util"
import { dataSource } from "../../datenbankAdapter"
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
    const rezeptEntity: RezeptEntity = {id: rezept.getId(), name: rezept.name, aufwand: rezept.aufwand}
    return await this.rezeptRepository.save(rezeptEntity)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.rezeptRepository.delete(id)
  }
}