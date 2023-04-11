import { Identifizierbar } from "../interfaces"

export class Lebensmittel implements Identifizierbar {
  private _id: number
  name: string
  typ: LebensmittelTyp

  constructor(id: number, name: string, typ: LebensmittelTyp) {
    this._id = id
    this.name = name
    this.typ = typ
  }

  getId(): number {
    return this._id
  }

  setId(id: number): void {
    this._id = id
  }

  createLebensmittelBodyJSON(): LebensmittelBodyJSON {
    const lebensmittelJSON = {
      id: this.getId(),
      name: this.name,
      typ: this.typ
    }
    return lebensmittelJSON
  }
}

export enum LebensmittelTyp {
  backwaren = 'Backwaren',
  obst = 'Obst',
  gemuese = 'Gemüse',
  fleisch = 'Fleisch',
  fisch = 'Fisch',
  milchprodukte = 'Milchprodukte',
  teigwaren = 'Teigwaren',
  sonstiges = 'Sonstiges',
  getraenke = 'Getränke'
}

export type LebensmittelBodyJSON = {
  id: number,
  name: string,
  typ: LebensmittelTyp
}