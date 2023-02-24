import { Identifizierbar } from "../interfaces"
import { Menge } from "./Menge"

export class Zutat implements Identifizierbar {
  id: number
  name: string
  menge: Menge

  constructor(id: number, name: string, menge: Menge) {
    this.id = id
    this.name = name
    this.menge = menge
  }

  getId(): number {
    return this.id
  }
}