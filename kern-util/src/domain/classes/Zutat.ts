import { Menge, MengeBodyJSON } from "./Menge";
import { Lebensmittel, LebensmittelBodyJSON } from "./Lebensmittel";

export class Zutat {
  private _rezeptId: number
  lebensmittel: Lebensmittel
  menge: Menge

  constructor(rezeptId: number, lebensmittel: Lebensmittel, menge: Menge) {
    this._rezeptId = rezeptId
    this.lebensmittel = lebensmittel
    this.menge = menge
  }

  getRezeptId(): number {
    return this._rezeptId
  }

  setRezeptId(rezeptId: number): void {
    this._rezeptId = rezeptId
  }

  getLebensmittelId(): number {
    return this.lebensmittel.getId()
  }

  createZutatBodyJSON(): ZutatBodyJSON {
    const zutatJSON: ZutatBodyJSON = {
      rezeptId: this.getRezeptId(),
      lebensmittel: this.lebensmittel.createLebensmittelBodyJSON(),
      menge: this.menge.createMengeBodyJSON()
    }
    return zutatJSON
  }
}

export type ZutatBodyJSON = {
  rezeptId: number,
  lebensmittel: LebensmittelBodyJSON,
  menge: MengeBodyJSON
}