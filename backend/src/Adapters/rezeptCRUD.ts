import { Request } from "express"
import { RezeptBodyJSON, Zutat, Lebensmittel, Menge, Rezept, LebensmittelTyp, MengenEinheit, Aufwand } from "kern-util"
import { rezeptSuchen } from "../Application Code/rezeptSuche"
import { arraysEqual } from "../helpers"
import { RezeptEntityManager } from "./EntityManager/rezeptEntityManager"
import { ZutatEntityManager } from "./EntityManager/zutatEntityManager"
import { LebensmittelEntityManager } from "./EntityManager/lebensmittelEntityManager"
import { RezeptFactory } from "./rezeptFactory"
import { Repository } from "./Repositorys/Repository"
import { RezeptRecord } from "./Records/RezeptRecord"
import { LebensmittelRecord } from "./Records/LebensmittelRecord"
import { ZutatRecord } from "./Records/ZutatRecord"
import { ZutatRepository } from "./Repositorys/ZutatRepository"

export class RezeptCRUD {
  private rezeptFactory = RezeptFactory.getInstance()
  private rezeptEntityManager;
  private lebensmittelEntityManager;
  private zutatEntityManager;

  constructor(rezeptRepository: Repository<RezeptRecord>, lebensmittelRepository: Repository<LebensmittelRecord>, zutatRepository: ZutatRepository) {
    this.rezeptEntityManager = RezeptEntityManager.getInstance(rezeptRepository)
    this.lebensmittelEntityManager = LebensmittelEntityManager.getInstance(lebensmittelRepository)
    this.zutatEntityManager = ZutatEntityManager.getInstance(zutatRepository)
  }

  async postRezept(rezeptData: RezeptBodyJSON, rezeptRepository: Repository<RezeptRecord>, lebensmittelRepository: Repository<LebensmittelRecord>, zutatRepository: ZutatRepository) {
    
    
    const zutaten: Zutat[] = []
    rezeptData.zutaten.forEach(zutat => {
      const lebensmittel: Lebensmittel = new Lebensmittel(zutat.lebensmittel.id, zutat.lebensmittel.name, zutat.lebensmittel.typ as LebensmittelTyp)
      const menge: Menge = new Menge(zutat.menge.wert, zutat.menge.einheit)
      zutaten.push(new Zutat(zutat.rezeptId, lebensmittel, menge))
    })
    const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, zutaten)

    return await this.rezeptFactory.createRezept(rezept, rezeptRepository, lebensmittelRepository, zutatRepository)
  }

  async getAllRezepte(): Promise<RezeptBodyJSON[]> {
    const rezeptData = await this.rezeptEntityManager.getAll()
    const rezepte = await this.rezeptErstellen(rezeptData)

    const response: RezeptBodyJSON[] = []
    rezepte.forEach(rezept => response.push(rezept.createRezeptBodyJSON()))
    
    return response
  }

  async getRezept(id: number): Promise<RezeptBodyJSON> {
    const rezeptData =  await this.rezeptEntityManager.getById(id)
    const zutatData = await this.zutatEntityManager.getByRezeptId(rezeptData.id)
    const zutaten = await this.zutatenErstellen(zutatData)

    const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand as Aufwand, zutaten)
    return rezept.createRezeptBodyJSON()
  }

  async deleteRezept(id: number) {
    try {
      await this.rezeptEntityManager.getById(id)
    } catch(err) {
      throw Error('Entity not found error')
    }

    try {
      await this.rezeptEntityManager.delete(id)
      const zutaten = await this.zutatEntityManager.getByRezeptId(id)
      const lebensmittelIds = zutaten.map(zutat => zutat.lebensmittelId)
      await this.zutatEntityManager.deleteByRezeptId(id)

      const lebensmittelToBeDeleted: number[] = []
      const allZutaten = await this.zutatEntityManager.getAll()
      lebensmittelIds.forEach(id => {
        if(!(allZutaten.find(obj => obj.lebensmittelId === id))) lebensmittelToBeDeleted.push(id)
      })
      await Promise.all(lebensmittelToBeDeleted.map(async lebensmittelId => {
        await this.lebensmittelEntityManager.delete(lebensmittelId)
      }))
    } catch(err) {
      throw Error('Unable to delete rezept')
    }
  }

  async putRezept(rezeptData: RezeptBodyJSON, rezeptRepository: Repository<RezeptRecord>, lebensmittelRepository: Repository<LebensmittelRecord>, zutatRepository: ZutatRepository) {
    const zutaten: Zutat[] = []
    rezeptData.zutaten.forEach(zutat => {
      const lebensmittel: Lebensmittel = new Lebensmittel(zutat.lebensmittel.id, zutat.lebensmittel.name, zutat.lebensmittel.typ)
      const menge: Menge = new Menge(zutat.menge.wert, zutat.menge.einheit)
      zutaten.push(new Zutat(zutat.rezeptId, lebensmittel, menge))
    })
    const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, zutaten)

    return await this.rezeptFactory.updateRezept(rezept, rezeptRepository, lebensmittelRepository, zutatRepository)
  }

  async searchRezepte(lebensmittelIds: number[], aufwand: string[]) {
    const rezeptData = await this.rezeptEntityManager.getAll()
    const rezepte = await this.rezeptErstellen(rezeptData)

    const filteredRezepte = rezeptSuchen(rezepte, {lebensmittelIds: lebensmittelIds, aufwand: aufwand})

    const response: RezeptBodyJSON[] = []
    filteredRezepte.forEach(rezept => response.push(rezept.createRezeptBodyJSON()))
    
    return response
  }

  private async rezeptErstellen(rezeptData: RezeptRecord[]): Promise<Rezept[]> {
    const rezepte: Rezept[] = []

    await Promise.all(rezeptData.map(async rezept => {
      const zutatData = await this.zutatEntityManager.getByRezeptId(rezept.id)
      const zutaten = await this.zutatenErstellen(zutatData)

      rezepte.push(new Rezept(rezept.id, rezept.name, rezept.aufwand as Aufwand, zutaten))
    }))

    return rezepte
  }

  private async zutatenErstellen(zutatData: ZutatRecord[]): Promise<Zutat[]> {
    const zutaten: Zutat[] = []

    await Promise.all(zutatData.map(async zutat => {
      const lebensmittelData = await this.lebensmittelEntityManager.getById(zutat.lebensmittelId)
      zutaten.push(
        new Zutat(
          zutat.rezeptId,
          new Lebensmittel(lebensmittelData.id, lebensmittelData.name, lebensmittelData.typ as LebensmittelTyp),
          new Menge(zutat.mengeWert, zutat.mengeEinheit as MengenEinheit)
        )
      )
    }))
    return zutaten
  }
    
}

