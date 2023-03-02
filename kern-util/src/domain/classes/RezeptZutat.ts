import { Menge, MengeBodyJSON } from "./Menge";
import { Zutat, ZutatBodyJSON } from "./Zutat";

export class RezeptZutat {
  private _rezeptId: number
  zutat: Zutat
  menge: Menge

  constructor(rezeptId: number, zutat: Zutat, menge: Menge) {
    this._rezeptId = rezeptId
    this.zutat = zutat
    this.menge = menge
  }

  getRezeptId(): number {
    return this._rezeptId
  }

  setRezeptId(rezeptId: number): void {
    this._rezeptId = rezeptId
  }

  getZutatId(): number {
    return this.zutat.getId()
  }
}

export type RezeptZutatenBodyJSON = {
  rezeptId: number,
  zutat: ZutatBodyJSON,
  menge: MengeBodyJSON
}