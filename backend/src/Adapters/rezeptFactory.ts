import { Rezept, Zutat } from "kern-util"
import { dataSource } from "./datenbankAdapter"
import { RezeptEntity } from "./datenbankEntities/RezeptEntity/rezept.entity"
import { RezeptEntityManager } from "./datenbankEntities/RezeptEntity/rezeptEntityManager"
import { RezeptZutatEntity } from "./datenbankEntities/RezeptZutatEntity/rezeptZutat.entity"
import { RezeptZutatEntityManager } from "./datenbankEntities/RezeptZutatEntity/rezeptZutatEntityManager"
import { ZutatEntity } from "./datenbankEntities/ZutatEntity/zutat.entity"
import { ZutatEntityManager } from "./datenbankEntities/ZutatEntity/zutatEntityManager"

export class RezeptFactory {
  private static instance: RezeptFactory

  private rezeptEntityManager = RezeptEntityManager.getInstance()
  private zutatEntityManager = ZutatEntityManager.getInstance()
  private rezeptZutatEntityManager = RezeptZutatEntityManager.getInstance()

  private constructor() {}

  static getInstance(): RezeptFactory {
    if(!RezeptFactory.instance) {
      RezeptFactory.instance = new RezeptFactory()
    }

    return RezeptFactory.instance
  }

  async createRezept(rezept: Rezept): Promise<Rezept> {
    await dataSource.transaction(async (transactionalEntityManager) => {
      // get repositories
      const rezeptRepository = transactionalEntityManager.getRepository(RezeptEntity)
      const zutatRepository = transactionalEntityManager.getRepository(ZutatEntity)
      const rezeptZutatRepository = transactionalEntityManager.getRepository(RezeptZutatEntity)

      // create Rezept
      const dbRezept = await rezeptRepository.save(rezept)
      rezept.setId(dbRezept.id)

      // create Zutaten and RezeptZutaten
      const rezeptZutaten = rezept.rezeptZutaten
      await Promise.all(rezeptZutaten.map(async rezeptZutat => {
        const zutat = rezeptZutat.zutat
        const dbZutat = await zutatRepository.findOneBy({name: zutat.name, typ: zutat.typ})

        // create missing Zutat
        if (!dbZutat) {
          const erstellteZutat = await zutatRepository.save(zutat)
          zutat.setId(erstellteZutat.id)
        } else {
          zutat.setId(dbZutat.id)
        }

        // create RezeptZutaten
        const neueRezeptZutat: RezeptZutatEntity = {
          rezeptId: rezept.getId(),
          zutatId: zutat.getId(),
          mengeWert: rezeptZutat.menge.wert,
          mengeEinheit: rezeptZutat.menge.einheit,
          mengeTyp: rezeptZutat.menge.typ
        }
        
        const dbRezeptZutat = await rezeptZutatRepository.save(neueRezeptZutat)
        rezeptZutat.zutat.setId(dbRezeptZutat.zutatId)
        rezeptZutat.setRezeptId(dbRezeptZutat.rezeptId)
      }))
    })

    return rezept
  }

  async updateRezept(rezept: Rezept): Promise<Rezept> {
    await dataSource.transaction(async (transactionalEntityManager) => {
      // get repositories
      const rezeptRepository = transactionalEntityManager.getRepository(RezeptEntity)
      const zutatRepository = transactionalEntityManager.getRepository(ZutatEntity)
      const rezeptZutatRepository = transactionalEntityManager.getRepository(RezeptZutatEntity)

      //update Rezept
      const dbRezept = await rezeptRepository.findOneByOrFail({id: rezept.getId()})
      if (dbRezept && dbRezept.id === rezept.getId()) {
        const updatedRezept: RezeptEntity = {id: rezept.getId(), name: rezept.name, aufwand: rezept.aufwand}
        rezeptRepository.save(updatedRezept)
      }

      //update Zutaten and RezeptZutaten
      const rezeptZutaten = rezept.rezeptZutaten
      await Promise.all(rezeptZutaten.map(async rezeptZutat => {
        const zutat = rezeptZutat.zutat
        const dbZutat = await zutatRepository.findOneBy({name: zutat.name, typ: zutat.typ})

        // create missing Zutat
        if (!dbZutat) {
          const erstellteZutat = await zutatRepository.save(zutat)
          zutat.setId(erstellteZutat.id)
        }

        const neueRezeptZutat: RezeptZutatEntity = {
          rezeptId: rezept.getId(),
          zutatId: zutat.getId(),
          mengeWert: rezeptZutat.menge.wert,
          mengeEinheit: rezeptZutat.menge.einheit,
          mengeTyp: rezeptZutat.menge.typ
        }
        
        const dbRezeptZutat = await rezeptZutatRepository.save(neueRezeptZutat)
        rezeptZutat.zutat.setId(dbRezeptZutat.zutatId)
        rezeptZutat.setRezeptId(dbRezeptZutat.rezeptId)
      }))
    })

    return rezept
  }
}