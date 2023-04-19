import { RezeptRecord } from "../Records/RezeptRecord"
import { Repository } from "../Repositorys/Repository"

export class RezeptEntityManager {
    private static instance: RezeptEntityManager
    private rezeptRepository: Repository<RezeptRecord>

    private constructor(rezeptRepository: Repository<RezeptRecord>) {
        this.rezeptRepository = rezeptRepository
    }

    static getInstance(rezeptRepository: Repository<RezeptRecord>): RezeptEntityManager {
        if (!RezeptEntityManager.instance) {
            RezeptEntityManager.instance = new RezeptEntityManager(rezeptRepository)
        }

        return RezeptEntityManager.instance
    }

    async getAll(): Promise<RezeptRecord[]> {
        return await this.rezeptRepository.find()
    }

    async getById(id: number): Promise<RezeptRecord> {
        return await this.rezeptRepository.findOneByOrFail({id})
    }

    async save(rezept: RezeptRecord): Promise<RezeptRecord> {
        return await this.rezeptRepository.save(rezept)
    }

    async delete(id: number): Promise<void> {
        await this.rezeptRepository.delete({id})
    }
}