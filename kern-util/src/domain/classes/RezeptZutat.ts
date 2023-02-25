import { Identifizierbar } from "../interfaces";
import { Menge } from "./Menge";
import { Zutat } from "./Zutat";

export class RezeptZutat implements Identifizierbar {
  id: number
  zutat: Zutat
  menge: Menge

  constructor(id: number, zutat: Zutat, menge: Menge) {
    this.id = id
    this.zutat = zutat
    this.menge = menge
  }

  getId(): number {
    return this.id
  }

  getZutatId(): number {
    return this.zutat.getId()
  }
}