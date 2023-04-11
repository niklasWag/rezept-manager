import { Identifizierbar } from "../interfaces/Identifizierbar"
import { Zutat, ZutatBodyJSON } from "./Zutat"

export class Rezept implements Identifizierbar {
  private _id: number
  name: string
  aufwand: Aufwand
  zutaten: Zutat[]

  constructor (id: number, name: string, aufwand: Aufwand, zutaten: Zutat[]) {
    this._id = id
    this.name = name
    this.aufwand = aufwand
    this.zutaten = zutaten
  }

  getId(): number {
    return this._id
  }

  setId(id: number): void {
    this._id = id
  }

  createRezeptBodyJSON(): RezeptBodyJSON {
    const zutatenJSON: ZutatBodyJSON[] = []
    this.zutaten.forEach(zutat => {
      const zutatJSON = zutat.createZutatBodyJSON()
      zutatenJSON.push(zutatJSON)
    })
    const rezeptJSON: RezeptBodyJSON = {
      id: this.getId(),
      name: this.name,
      aufwand: this.aufwand,
      zutaten: zutatenJSON
    }
    return rezeptJSON
  }
}

export type RezeptBodyJSON = {
  id: number,
  name: string,
  aufwand: Aufwand,
  zutaten: ZutatBodyJSON[]
}

export enum Aufwand {
  einfach = 'einfach',
  mittel = 'mittel',
  schwer = 'schwer'
}