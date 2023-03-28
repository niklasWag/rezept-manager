import { Request } from "express"
import { RezeptBodyJSON, RezeptZutat, Zutat, Menge, Rezept, ZutatTyp, MengenEinheit, Aufwand } from "kern-util"
import { rezeptSuchen } from "../Application Code/rezeptSuche"
import { arraysEqual } from "../helpers"
import { RezeptEntityManager } from "./datenbankEntities/RezeptEntity/rezeptEntityManager"
import { RezeptZutatEntityManager } from "./datenbankEntities/RezeptZutatEntity/rezeptZutatEntityManager"
import { ZutatEntityManager } from "./datenbankEntities/ZutatEntity/zutatEntityManager"
import { RezeptFactory } from "./rezeptFactory"

const rezeptFactory = RezeptFactory.getInstance()
const rezeptEntityManager = RezeptEntityManager.getInstance()
const zutatEntityManager = ZutatEntityManager.getInstance()
const rezeptZutatEntityManager = RezeptZutatEntityManager.getInstance()

export async function postRezept(req: Request) {
  const expectedKeys: string[] = [ 'id', 'name', 'aufwand', 'rezeptZutaten' ]
  if (!arraysEqual(Object.keys(req.body), expectedKeys)) throw new Error('body type error')

  const rezeptData: RezeptBodyJSON = req.body
  const rezeptZutaten: RezeptZutat[] = []
  rezeptData.rezeptZutaten.forEach(rezeptZutat => {
    const zutat: Zutat = new Zutat(rezeptZutat.zutat.id, rezeptZutat.zutat.name, rezeptZutat.zutat.typ as ZutatTyp)
    const menge: Menge = new Menge(rezeptZutat.menge.wert, rezeptZutat.menge.einheit)
    rezeptZutaten.push(new RezeptZutat(rezeptZutat.rezeptId, zutat, menge))
  })
  const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, rezeptZutaten)

  return await rezeptFactory.createRezept(rezept)
}

export async function getAllRezepte(): Promise<RezeptBodyJSON[]> {
  const rezepte: Rezept[] = []
  const rezeptData = await rezeptEntityManager.getAll()

  await Promise.all(rezeptData.map(async rezept => {
    const rezeptZutatData = await rezeptZutatEntityManager.getByRezeptId(rezept.id)
    const rezeptZutaten: RezeptZutat[] = []

    await Promise.all(rezeptZutatData.map(async rezeptZutat => {
      const zutatData = await zutatEntityManager.getById(rezeptZutat.zutatId)
      rezeptZutaten.push(
        new RezeptZutat(
          rezeptZutat.rezeptId,
          new Zutat(zutatData.id, zutatData.name, zutatData.typ as ZutatTyp),
          new Menge(rezeptZutat.mengeWert, rezeptZutat.mengeEinheit as MengenEinheit)
          )
        )
    }))

    rezepte.push(new Rezept(rezept.id, rezept.name, rezept.aufwand as Aufwand, rezeptZutaten))
  }))

  const response: RezeptBodyJSON[] = []
  rezepte.forEach(rezept => response.push(rezept.createRezeptBodyJSON()))
  
  return response
}

export async function getRezept(req: Request): Promise<RezeptBodyJSON> {
  const id: number = parseInt(req.params.id)
  if (Number.isNaN(id)) throw Error('Invalid parameter')

  const rezeptData =  await rezeptEntityManager.getById(id)
  const rezeptZutatData = await rezeptZutatEntityManager.getByRezeptId(rezeptData.id)
  const rezeptZutaten: RezeptZutat[] = []
  await Promise.all(rezeptZutatData.map(async rezeptZutat => {
    const zutatData = await zutatEntityManager.getById(rezeptZutat.zutatId)
    rezeptZutaten.push(
      new RezeptZutat(
        rezeptZutat.rezeptId,
        new Zutat(zutatData.id, zutatData.name, zutatData.typ as ZutatTyp),
        new Menge(rezeptZutat.mengeWert, rezeptZutat.mengeEinheit as MengenEinheit)
        )
      )
  }))

  const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand as Aufwand, rezeptZutaten)
  return rezept.createRezeptBodyJSON()
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
    const rezeptZutaten = await rezeptZutatEntityManager.getByRezeptId(id)
    const zutatenIds = rezeptZutaten.map(rezeptZutat => rezeptZutat.zutatId)
    await rezeptZutatEntityManager.deleteByRezeptId(id)

    const zutatenToBeDeleted: number[] = []
    const allRezeptZutaten = await rezeptZutatEntityManager.getAll()
    zutatenIds.forEach(id => {
      if(!(allRezeptZutaten.find(obj => obj.zutatId === id))) zutatenToBeDeleted.push(id)
    })
    await Promise.all(zutatenToBeDeleted.map(async zutatId => {
      await zutatEntityManager.delete(zutatId)
    }))
  } catch(err) {
    throw Error('Unable to delete rezept')
  }
}

export async function putRezept(req: Request) {
  const expectedKeys: string[] = [ 'id', 'name', 'aufwand', 'rezeptZutaten' ]
  if (!arraysEqual(Object.keys(req.body), expectedKeys)) throw new Error('body type error')

  const rezeptData: RezeptBodyJSON = req.body
  const rezeptZutaten: RezeptZutat[] = []
  rezeptData.rezeptZutaten.forEach(rezeptZutat => {
    const zutat: Zutat = new Zutat(rezeptZutat.zutat.id, rezeptZutat.zutat.name, rezeptZutat.zutat.typ)
    const menge: Menge = new Menge(rezeptZutat.menge.wert, rezeptZutat.menge.einheit)
    rezeptZutaten.push(new RezeptZutat(rezeptZutat.rezeptId, zutat, menge))
  })
  const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, rezeptZutaten)

  return await rezeptFactory.updateRezept(rezept)
}

export async function searchRezepte(req: Request) {
  let zutatenIds: number[] = []
  let aufwand: string[] = []
  if (req.body.zutaten && Array.isArray(req.body.zutaten)) zutatenIds = req.body.zutaten
  if (req.body.aufwand && Array.isArray(req.body.aufwand)) aufwand = req.body.aufwand
  if (!req.body.zutaten && !req.body.aufwand) throw Error('body type error')
  
  const rezepte: Rezept[] = []
  const rezeptData = await rezeptEntityManager.getAll()

  await Promise.all(rezeptData.map(async rezept => {
    const rezeptZutatData = await rezeptZutatEntityManager.getByRezeptId(rezept.id)
    const rezeptZutaten: RezeptZutat[] = []

    await Promise.all(rezeptZutatData.map(async rezeptZutat => {
      const zutatData = await zutatEntityManager.getById(rezeptZutat.zutatId)
      rezeptZutaten.push(
        new RezeptZutat(
          rezeptZutat.rezeptId,
          new Zutat(zutatData.id, zutatData.name, zutatData.typ as ZutatTyp),
          new Menge(rezeptZutat.mengeWert, rezeptZutat.mengeEinheit as MengenEinheit)
          )
        )
    }))

    rezepte.push(new Rezept(rezept.id, rezept.name, rezept.aufwand as Aufwand, rezeptZutaten))
  }))

  const filteredRezepte = rezeptSuchen(rezepte, {zutatenIds: zutatenIds, aufwand: aufwand})

  const response: RezeptBodyJSON[] = []
  filteredRezepte.forEach(rezept => response.push(rezept.createRezeptBodyJSON()))
  
  return response
}