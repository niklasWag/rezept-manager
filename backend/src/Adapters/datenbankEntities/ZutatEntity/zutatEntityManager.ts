import { Zutat } from "kern-util";
import { dataSource } from "../../datenbankAdapter";
import { ZutatEntity } from "./zutat.entity";
import { DeleteResult } from "typeorm";

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

  async getById(id: number): Promise<ZutatEntity> {
    return await this.zutatRepository.findOneByOrFail({id})
  }

  async save(zutat: Zutat): Promise<ZutatEntity> {
    return await this.zutatRepository.save(zutat)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.zutatRepository.delete(id)
  }
}