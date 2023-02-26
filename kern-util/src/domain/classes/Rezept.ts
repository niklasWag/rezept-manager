import { Identifizierbar } from "../interfaces/Identifizierbar"
import { Zutat } from "./Zutat"

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
}

export enum Aufwand {
  einfach = 'einfach',
  mittel = 'mittel',
  schwer = 'schwer'
}