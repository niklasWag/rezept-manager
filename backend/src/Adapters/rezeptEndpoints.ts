import { Request } from "express"
import { RezeptBodyJSON, Zutat, Lebensmittel, Menge, Rezept, LebensmittelTyp, MengenEinheit, Aufwand } from "kern-util"
import { EntityNotFoundError } from "typeorm"
import { rezeptSuchen } from "../Application Code/rezeptSuche"
import { arraysEqual } from "../helpers"
import { RezeptEntity } from "./datenbankEntities/RezeptEntity/rezept.entity"
import { RezeptEntityManager } from "./datenbankEntities/RezeptEntity/rezeptEntityManager"
import { ZutatEntity } from "./datenbankEntities/ZutatEntity/zutat.entity"
import { ZutatEntityManager } from "./datenbankEntities/ZutatEntity/zutatEntityManager"
import { LebensmittelEntityManager } from "./datenbankEntities/LebensmittelEntity/lebensmittelEntityManager"
import { RezeptFactory } from "./rezeptFactory"
import { DatenbankLebensmittelRepository } from "./datenbankEntities/DatenbankLebensmittelRepository"

const rezeptFactory = RezeptFactory.getInstance()
const rezeptEntityManager = RezeptEntityManager.getInstance()
const lebensmittelEntityManager = LebensmittelEntityManager.getInstance(DatenbankLebensmittelRepository.getInstance())
const zutatEntityManager = ZutatEntityManager.getInstance()

export async function postRezept(req: Request) {
  const expectedKeys: string[] = [ 'id', 'name', 'aufwand', 'zutaten' ]
  if (!arraysEqual(Object.keys(req.body), expectedKeys)) throw new Error('body type error')

  const rezeptData: RezeptBodyJSON = req.body
  const zutaten: Zutat[] = []
  rezeptData.zutaten.forEach(zutat => {
    const lebensmittel: Lebensmittel = new Lebensmittel(zutat.lebensmittel.id, zutat.lebensmittel.name, zutat.lebensmittel.typ as LebensmittelTyp)
    const menge: Menge = new Menge(zutat.menge.wert, zutat.menge.einheit)
    zutaten.push(new Zutat(zutat.rezeptId, lebensmittel, menge))
  })
  const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, zutaten)

  return await rezeptFactory.createRezept(rezept)
}

export async function getAllRezepte(): Promise<RezeptBodyJSON[]> {
  const rezeptData = await rezeptEntityManager.getAll()
  const rezepte = await rezeptErstellen(rezeptData)

  const response: RezeptBodyJSON[] = []
  rezepte.forEach(rezept => response.push(rezept.createRezeptBodyJSON()))
  
  return response
}

export async function getRezept(req: Request): Promise<RezeptBodyJSON> {
  const id: number = parseInt(req.params.id)
  if (Number.isNaN(id)) throw Error('Invalid parameter')

  try {
    const rezeptData =  await rezeptEntityManager.getById(id)
    const zutatData = await zutatEntityManager.getByRezeptId(rezeptData.id)
    const zutaten = await zutatenErstellen(zutatData)

    const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand as Aufwand, zutaten)
    return rezept.createRezeptBodyJSON()
  } catch (err: any) {
    if (err instanceof EntityNotFoundError) {
      throw Error('Not found')
    } else {
      throw err
    }
  }
}

export async function deleteRezept(req: Request) {
  const id: number = parseInt(req.params.id)
  if (Number.isNaN(id)) throw Error('Invalid parameter')

  try {
    await rezeptEntityManager.getById(id)
  } catch(err) {
    throw Error('Entity not found error')
  }

  try {
    await rezeptEntityManager.delete(id)
    const zutaten = await zutatEntityManager.getByRezeptId(id)
    const lebensmittelIds = zutaten.map(zutat => zutat.lebensmittelId)
    await zutatEntityManager.deleteByRezeptId(id)

    const lebensmittelToBeDeleted: number[] = []
    const allZutaten = await zutatEntityManager.getAll()
    lebensmittelIds.forEach(id => {
      if(!(allZutaten.find(obj => obj.lebensmittelId === id))) lebensmittelToBeDeleted.push(id)
    })
    await Promise.all(lebensmittelToBeDeleted.map(async lebensmittelId => {
      await lebensmittelEntityManager.delete(lebensmittelId)
    }))
  } catch(err) {
    throw Error('Unable to delete rezept')
  }
}

export async function putRezept(req: Request) {
  const expectedKeys: string[] = [ 'id', 'name', 'aufwand', 'zutaten' ]
  if (!arraysEqual(Object.keys(req.body), expectedKeys)) throw new Error('body type error')

  const rezeptData: RezeptBodyJSON = req.body
  const zutaten: Zutat[] = []
  rezeptData.zutaten.forEach(zutat => {
    const lebensmittel: Lebensmittel = new Lebensmittel(zutat.lebensmittel.id, zutat.lebensmittel.name, zutat.lebensmittel.typ)
    const menge: Menge = new Menge(zutat.menge.wert, zutat.menge.einheit)
    zutaten.push(new Zutat(zutat.rezeptId, lebensmittel, menge))
  })
  const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, zutaten)

  return await rezeptFactory.updateRezept(rezept)
}

export async function searchRezepte(req: Request) {
  let lebensmittelIds: number[] = []
  let aufwand: string[] = []
  if (req.body.lebensmittel && Array.isArray(req.body.lebensmittel)) lebensmittelIds = req.body.lebensmittel
  if (req.body.aufwand && Array.isArray(req.body.aufwand)) aufwand = req.body.aufwand
  if (!req.body.lebensmittel && !req.body.aufwand) throw Error('body type error')
  
  const rezeptData = await rezeptEntityManager.getAll()
  const rezepte = await rezeptErstellen(rezeptData)

  const filteredRezepte = rezeptSuchen(rezepte, {lebensmittelIds: lebensmittelIds, aufwand: aufwand})

  const response: RezeptBodyJSON[] = []
  filteredRezepte.forEach(rezept => response.push(rezept.createRezeptBodyJSON()))
  
  return response
}

async function rezeptErstellen(rezeptData: RezeptEntity[]): Promise<Rezept[]> {
  const rezepte: Rezept[] = []

  await Promise.all(rezeptData.map(async rezept => {
    const zutatData = await zutatEntityManager.getByRezeptId(rezept.id)
    const zutaten = await zutatenErstellen(zutatData)

    rezepte.push(new Rezept(rezept.id, rezept.name, rezept.aufwand as Aufwand, zutaten))
  }))

  return rezepte
}

async function zutatenErstellen(zutatData: ZutatEntity[]): Promise<Zutat[]> {
  const zutaten: Zutat[] = []

  await Promise.all(zutatData.map(async zutat => {
    const lebensmittelData = await lebensmittelEntityManager.getById(zutat.lebensmittelId)
    zutaten.push(
      new Zutat(
        zutat.rezeptId,
        new Lebensmittel(lebensmittelData.getId(), lebensmittelData.name, lebensmittelData.typ as LebensmittelTyp),
        new Menge(zutat.mengeWert, zutat.mengeEinheit as MengenEinheit)
      )
    )
  }))
  return zutaten
}
  