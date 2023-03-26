import { Identifizierbar } from "../interfaces/Identifizierbar"
import { RezeptZutat, RezeptZutatenBodyJSON } from "./RezeptZutat"

export class Rezept implements Identifizierbar {
  private _id: number
  name: string
  aufwand: Aufwand
  rezeptZutaten: RezeptZutat[]

  constructor (id: number, name: string, aufwand: Aufwand, rezeptZutaten: RezeptZutat[]) {
    this._id = id
    this.name = name
    this.aufwand = aufwand
    this.rezeptZutaten = rezeptZutaten
  }

  getId(): number {
    return this._id
  }

  setId(id: number): void {
    this._id = id
  }

  createRezeptBodyJSON(): RezeptBodyJSON {
    const rezeptZutatenJSON: RezeptZutatenBodyJSON[] = []
    this.rezeptZutaten.forEach(rezeptZutat => {
      const rezeptZutatJSON: RezeptZutatenBodyJSON = {
        rezeptId: rezeptZutat.getRezeptId(),
        zutat: {
          id: rezeptZutat.zutat.getId(),
          name: rezeptZutat.zutat.name,
          typ: rezeptZutat.zutat.typ
        },
        menge: {
          wert: rezeptZutat.menge.wert,
          einheit: rezeptZutat.menge.einheit
        }
      }
      rezeptZutatenJSON.push(rezeptZutatJSON)
    })
    const rezeptJSON: RezeptBodyJSON = {
      id: this.getId(),
      name: this.name,
      aufwand: this.aufwand,
      rezeptZutaten: rezeptZutatenJSON
    }
    return rezeptJSON
  }
}

export type RezeptBodyJSON = {
  id: number,
  name: string,
  aufwand: Aufwand,
  rezeptZutaten: RezeptZutatenBodyJSON[]
}

export enum Aufwand {
  einfach = 'einfach',
  mittel = 'mittel',
  schwer = 'schwer'
}