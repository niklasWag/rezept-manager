import { dataSource } from "../../datenbankAdapter"
import { ZutatEntity } from "./zutat.entity"
import { DeleteResult } from 'typeorm'

export class ZutatEntityManager {
  private static instance: ZutatEntityManager

  zutatRepository = dataSource.getRepository(ZutatEntity)

  private constructor() {}

  static getInstance(): ZutatEntityManager {
    if (!ZutatEntityManager.instance) {
      ZutatEntityManager.instance = new ZutatEntityManager()
    }

    return ZutatEntityManager.instance
  }

  async getAll(): Promise<ZutatEntity[]> {
    return await this.zutatRepository.find()
  }

  async getById(rezeptId: number, lebensmittelId: number): Promise<ZutatEntity> {
    return await this.zutatRepository.findOneByOrFail({rezeptId, lebensmittelId})
  }

  async getByRezeptId(rezeptId: number): Promise<ZutatEntity[]> {
    return await this.zutatRepository.findBy({rezeptId})
  }

  async save(zutatEntity: ZutatEntity): Promise<ZutatEntity> {
    return await this.zutatRepository.save(zutatEntity)
  }

  async delete(rezeptId: number, lebensmittelId: number): Promise<DeleteResult> {
    return await this.zutatRepository.delete({rezeptId, lebensmittelId})
  }

  async deleteByRezeptId(rezeptId: number): Promise<DeleteResult> {
    return await this.zutatRepository.delete({rezeptId})
  }
}