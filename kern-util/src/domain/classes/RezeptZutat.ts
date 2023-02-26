import { Identifizierbar } from "../interfaces";
import { Menge } from "./Menge";
import { Zutat } from "./Zutat";

export class RezeptZutat implements Identifizierbar {
  private _id: number
  zutat: Zutat
  menge: Menge

  constructor(id: number, zutat: Zutat, menge: Menge) {
    this._id = id
    this.zutat = zutat
    this.menge = menge
  }

  getId(): number {
    return this._id
  }

  setId(id: number): void {
    this._id = id
  }

  getZutatId(): number {
    return this.zutat.getId()
  }
}