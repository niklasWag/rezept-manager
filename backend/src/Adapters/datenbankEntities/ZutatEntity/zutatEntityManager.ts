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
    const zutatEntity: ZutatEntity = {id: zutat.getId(), name: zutat.name, typ: zutat.typ}
    return await this.zutatRepository.save(zutatEntity)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.zutatRepository.delete(id)
  }
}