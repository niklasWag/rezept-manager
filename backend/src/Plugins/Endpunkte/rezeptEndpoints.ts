import { Rezept, RezeptBodyJSON, Zutat } from "kern-util";
import { Request } from "express"
import { EntityNotFoundError } from "typeorm";
import { RezeptCRUD } from "../../Adapters/rezeptCRUD";
import { arraysEqual } from "../../helpers";
import { dataSource } from "../DatenbankAdapter";
import { RezeptEntity } from "../datenbankEntities/RezeptEntity/rezept.entity";
import { LebensmittelEntity } from "../datenbankEntities/LebensmittelEntity/lebensmittel.entity";
import { ZutatEntity } from "../datenbankEntities/ZutatEntity/zutat.entity";
import { DatenbankLebensmittelRepository } from "../datenbankEntities/LebensmittelEntity/DatenbankLebensmittelRepository";
import { DatenbankRezeptRepository } from "../datenbankEntities/RezeptEntity/DatenbankRezeptRepository";
import { DatenbankZutatRepository } from "../datenbankEntities/ZutatEntity/DatenbankZutatRepository";

export class RezeptEndpoints {

    rezeptCRUD: RezeptCRUD;

    constructor(rezeptRepository: DatenbankRezeptRepository, lebensmittelRepository: DatenbankLebensmittelRepository, zutatRepository: DatenbankZutatRepository) {
        this.rezeptCRUD = new RezeptCRUD(rezeptRepository, lebensmittelRepository, zutatRepository)
    }

    async postRezept(req: Request) {
        const expectedKeys: string[] = ['id', 'name', 'aufwand', 'zutaten']
        if (!arraysEqual(Object.keys(req.body), expectedKeys)) throw new Error('body type error')
        
        const rezeptData: RezeptBodyJSON = req.body

        await dataSource.transaction(async (transactionalEntityManager) => {
            // get repositories
            const rezeptRepository = DatenbankRezeptRepository.getInstance(transactionalEntityManager.getRepository(RezeptEntity))
            const lebensmittelRepository = DatenbankLebensmittelRepository.getInstance(transactionalEntityManager.getRepository(LebensmittelEntity))
            const zutatRepository = DatenbankZutatRepository.getInstance(transactionalEntityManager.getRepository(ZutatEntity))

            this.rezeptCRUD.postRezept(rezeptData, rezeptRepository, lebensmittelRepository, zutatRepository)
        })        
    }

    async getAllRezepte(): Promise<RezeptBodyJSON[]>{
        return await this.rezeptCRUD.getAllRezepte()
    }

    async getRezept(req: Request): Promise<RezeptBodyJSON> {
        const id: number = parseInt(req.params.id)
        if (Number.isNaN(id)) throw Error('Invalid parameter')
        
        try {
            return await this.rezeptCRUD.getRezept(id)
        } catch (err: any) {
            if (err instanceof EntityNotFoundError) {
                throw Error('Not found')
            } else {
                throw err
            }
        }
    }

    async deleteRezept(req: Request) {
        const id: number = parseInt(req.params.id)
        if (Number.isNaN(id)) throw Error('Invalid parameter')

        this.rezeptCRUD.deleteRezept(id)
    }

    async putRezept(req: Request) {
        const expectedKeys: string[] = ['id', 'name', 'aufwand', 'zutaten']
        if (!arraysEqual(Object.keys(req.body), expectedKeys)) throw new Error('body type error')
        const rezeptData: RezeptBodyJSON = req.body

        await dataSource.transaction(async (transactionalEntityManager) => {
            // get repositories
            const rezeptRepository = DatenbankRezeptRepository.getInstance(transactionalEntityManager.getRepository(RezeptEntity))
            const lebensmittelRepository = DatenbankLebensmittelRepository.getInstance(transactionalEntityManager.getRepository(LebensmittelEntity))
            const zutatRepository = DatenbankZutatRepository.getInstance(transactionalEntityManager.getRepository(ZutatEntity))

            this.rezeptCRUD.putRezept(rezeptData, rezeptRepository, lebensmittelRepository, zutatRepository)
        })  
    }

    async searchRezepte(req: Request) {
        let lebensmittelIds: number[] = []
        let aufwand: string[] = []
        if (req.body.lebensmittel && Array.isArray(req.body.lebensmittel)) lebensmittelIds = req.body.lebensmittel
        if (req.body.aufwand && Array.isArray(req.body.aufwand)) aufwand = req.body.aufwand
        if (!req.body.lebensmittel && !req.body.aufwand) throw Error('body type error')

        return this.rezeptCRUD.searchRezepte(lebensmittelIds, aufwand)
    }
}