import { Rezept } from "kern-util"
import { Repository } from "./Repositorys/Repository"
import { RezeptRecord } from "./Records/RezeptRecord"
import { LebensmittelRecord } from "./Records/LebensmittelRecord"
import { ZutatRepository } from "./Repositorys/ZutatRepository"
import { ZutatRecord } from "./Records/ZutatRecord"

export class RezeptFactory {
  private static instance: RezeptFactory

  private constructor() {
  }

  static getInstance(): RezeptFactory {
    if(!RezeptFactory.instance) {
      RezeptFactory.instance = new RezeptFactory()
    }

    return RezeptFactory.instance
  }

  async createRezept(rezept: Rezept, rezeptRepository: Repository<RezeptRecord>, lebensmittelRepository: Repository<LebensmittelRecord>, zutatRepository: ZutatRepository): Promise<Rezept> {
    // create Rezept
    const rezeptRecord: RezeptRecord = {
      id: rezept.getId(),
      name: rezept.name,
      aufwand: rezept.aufwand
    }
    const dbRezept = await rezeptRepository.save(rezeptRecord)
    rezept.setId(dbRezept.id)

    // create Zutaten and RezeptZutaten
    const zutaten = rezept.zutaten
    await Promise.all(zutaten.map(async zutat => {
      const lebensmittel = zutat.lebensmittel
      const dbLebensmittel = await lebensmittelRepository.findOneBy({name: lebensmittel.name, typ: lebensmittel.typ})

      // create missing Zutat
      if (!dbLebensmittel) {
        const lebensmittelRecord: LebensmittelRecord = {
          id: lebensmittel.getId(),
          name: lebensmittel.name,
          typ: lebensmittel.typ
        }
        const erstelltesLebensmittel = await lebensmittelRepository.save(lebensmittelRecord)
        lebensmittel.setId(erstelltesLebensmittel.id)
      } else {
        lebensmittel.setId(dbLebensmittel.id)
      }

      // create RezeptZutaten
      const neueZutat: ZutatRecord = {
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

    return rezept
  }

  async updateRezept(rezept: Rezept, rezeptRepository: Repository<RezeptRecord>, lebensmittelRepository: Repository<LebensmittelRecord>, zutatRepository: ZutatRepository): Promise<Rezept> {
    //update Rezept
    const dbRezept = await rezeptRepository.findOneByOrFail(rezept.getId())
    if (dbRezept && dbRezept.id === rezept.getId()) {
      const updatedRezept: RezeptRecord = {id: rezept.getId(), name: rezept.name, aufwand: rezept.aufwand}
      rezeptRepository.save(updatedRezept)
    }

    //delete existing RezeptZutaten
    zutatRepository.deleteByRezeptId(rezept.getId())
    //update Zutaten and RezeptZutaten
    const zutaten = rezept.zutaten
    await Promise.all(zutaten.map(async zutat => {
      const lebensmittel = zutat.lebensmittel
      const dbLebensmittel = await lebensmittelRepository.findOneBy({name: lebensmittel.name, typ: lebensmittel.typ})

      // create missing Zutat
      if (!dbLebensmittel) {
        const lebensmittelRecord: LebensmittelRecord = {
          id: lebensmittel.getId(),
          name: lebensmittel.name,
          typ: lebensmittel.typ
        }
        const erstelltesLebensmittel = await lebensmittelRepository.save(lebensmittelRecord)
        console.log(erstelltesLebensmittel)
        lebensmittel.setId(erstelltesLebensmittel.id)
      }

      const neueZutat: ZutatRecord = {
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

    return rezept
  }
}