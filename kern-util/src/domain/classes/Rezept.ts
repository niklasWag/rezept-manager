import { Identifizierbar } from "../interfaces/Identifizierbar"
import { RezeptZutat } from "./RezeptZutat"

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
}

export enum Aufwand {
  einfach = 'einfach',
  mittel = 'mittel',
  schwer = 'schwer'
}