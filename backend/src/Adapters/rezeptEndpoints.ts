import { Request } from "express"
import { RezeptBodyJSON, RezeptZutat, Zutat, Menge, Rezept, ZutatTyp, MengenEinheit, Aufwand } from "kern-util"
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
            const zutat: Zutat = new Zutat(rezeptZutat.zutat.id, rezeptZutat.zutat.name, rezeptZutat.zutat.typ)
            const menge: Menge = new Menge(rezeptZutat.menge.wert, rezeptZutat.menge.einheit)
            rezeptZutaten.push(new RezeptZutat(rezeptZutat.rezeptId, zutat, menge))
        })
        const rezept = new Rezept(rezeptData.id, rezeptData.name, rezeptData.aufwand, rezeptZutaten)

        return await rezeptFactory.createRezept(rezept)
}

export async function getAllRezepte() {
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
  
  return rezepte
}

export async function getRezept(req: Request): Promise<Rezept> {
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
  return rezept
}