import { Rezept, Lebensmittel, Zutat } from "kern-util"
import { dataSource } from "./datenbankAdapter"
import { RezeptEntity } from "./datenbankEntities/RezeptEntity/rezept.entity"
import { RezeptEntityManager } from "./datenbankEntities/RezeptEntity/rezeptEntityManager"
import { ZutatEntity } from "./datenbankEntities/ZutatEntity/zutat.entity"
import { ZutatEntityManager } from "./datenbankEntities/ZutatEntity/zutatEntityManager"
import { LebensmittelEntity } from "./datenbankEntities/LebensmittelEntity/lebensmittel.entity"
import { LebensmittelEntityManager } from "./datenbankEntities/LebensmittelEntity/lebensmittelEntityManager"
import { DatenbankLebensmittelRepository } from "./datenbankEntities/DatenbankLebensmittelRepository"

export class RezeptFactory {
  private static instance: RezeptFactory

  private rezeptEntityManager = RezeptEntityManager.getInstance()
  private lebensmittelEntityManager = LebensmittelEntityManager.getInstance(DatenbankLebensmittelRepository.getInstance())
  private zutatEntityManager = ZutatEntityManager.getInstance()

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
      const lebensmittelRepository = transactionalEntityManager.getRepository(LebensmittelEntity)
      const zutatRepository = transactionalEntityManager.getRepository(ZutatEntity)

      // create Rezept
      const dbRezept = await rezeptRepository.save(rezept)
      rezept.setId(dbRezept.id)

      // create Zutaten and RezeptZutaten
      const zutaten = rezept.zutaten
      await Promise.all(zutaten.map(async zutat => {
        const lebensmittel = zutat.lebensmittel
        const dbLebensmittel = await lebensmittelRepository.findOneBy({name: lebensmittel.name, typ: lebensmittel.typ})

        // create missing Zutat
        if (!dbLebensmittel) {
          const erstelltesLebensmittel = await lebensmittelRepository.save(lebensmittel)
          lebensmittel.setId(erstelltesLebensmittel.id)
        } else {
          lebensmittel.setId(dbLebensmittel.id)
        }

        // create RezeptZutaten
        const neueZutat: ZutatEntity = {
          rezeptId: rezept.getId(),
          lebensmittelId: lebensmittel.getId(),
          mengeWert: zutat.menge.wert,
          mengeEinheit: zutat.menge.einheit,
          mengeTyp: zutat.menge.typ
        }
        
        const dbZutat = await zutatRepository.save(neueZutat)
        zutat.lebensmittel.setId(dbZutat.lebensmittelId)
        zutat.setRezeptId(dbZutat.rezeptId)
      }))
    })

    return rezept
  }

  async updateRezept(rezept: Rezept): Promise<Rezept> {
    await dataSource.transaction(async (transactionalEntityManager) => {
      // get repositories
      const rezeptRepository = transactionalEntityManager.getRepository(RezeptEntity)
      const lebensmittelRepository = transactionalEntityManager.getRepository(LebensmittelEntity)
      const zutatRepository = transactionalEntityManager.getRepository(ZutatEntity)

      //update Rezept
      const dbRezept = await rezeptRepository.findOneByOrFail({id: rezept.getId()})
      if (dbRezept && dbRezept.id === rezept.getId()) {
        const updatedRezept: RezeptEntity = {id: rezept.getId(), name: rezept.name, aufwand: rezept.aufwand}
        rezeptRepository.save(updatedRezept)
      }

      //delete existing RezeptZutaten
      zutatRepository.delete({rezeptId: rezept.getId()})
      //update Zutaten and RezeptZutaten
      const zutaten = rezept.zutaten
      await Promise.all(zutaten.map(async zutat => {
        const lebensmittel = zutat.lebensmittel
        const dbLebensmittel = await lebensmittelRepository.findOneBy({name: lebensmittel.name, typ: lebensmittel.typ})

        // create missing Zutat
        if (!dbLebensmittel) {
          const erstelltesLebensmittel = await lebensmittelRepository.save(lebensmittel)
          lebensmittel.setId(erstelltesLebensmittel.id)
        }

        const neueZutat: ZutatEntity = {
          rezeptId: rezept.getId(),
          lebensmittelId: lebensmittel.getId(),
          mengeWert: zutat.menge.wert,
          mengeEinheit: zutat.menge.einheit,
          mengeTyp: zutat.menge.typ
        }
        
        const dbZutat = await zutatRepository.save(neueZutat)
        zutat.lebensmittel.setId(dbZutat.lebensmittelId)
        zutat.setRezeptId(dbZutat.rezeptId)
      }))
    })

    return rezept
  }
}