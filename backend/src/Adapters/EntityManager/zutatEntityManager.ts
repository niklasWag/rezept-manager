import { ZutatRecord } from "../Records/ZutatRecord"
import { ZutatRepository } from "../Repositorys/ZutatRepository"

export class ZutatEntityManager {
    private static instance: ZutatEntityManager
    private zutatRepository: ZutatRepository

    private constructor(zutatRepository: ZutatRepository) {
        this.zutatRepository = zutatRepository
    }

    static getInstance(zutatRepository: ZutatRepository): ZutatEntityManager {
        if (!ZutatEntityManager.instance) {
            ZutatEntityManager.instance = new ZutatEntityManager(zutatRepository)
        }

        return ZutatEntityManager.instance
    }

    async getAll(): Promise<ZutatRecord[]> {
        return await this.zutatRepository.find()
    }

    async getById(rezeptId: number, lebensmittelId: number): Promise<ZutatRecord> {
        return await this.zutatRepository.findOneByOrFail({rezeptId, lebensmittelId})
    }

    async getByRezeptId(rezeptId: number): Promise<ZutatRecord[]> {
        return await this.zutatRepository.getByRezeptId({rezeptId})
    }

    async save(zutat: ZutatRecord): Promise<ZutatRecord> {
        return await this.zutatRepository.save(zutat)
    }

    async delete(rezeptId: number, lebensmittelId: number): Promise<void> {
        await this.zutatRepository.delete({rezeptId, lebensmittelId})
    }

    async deleteByRezeptId(rezeptId: number): Promise<void> {
        return await this.zutatRepository.deleteByRezeptId({rezeptId})
    }
}