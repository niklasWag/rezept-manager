import { Identifizierbar } from "../interfaces"

export class Zutat implements Identifizierbar {
  private _id: number
  name: string
  typ: ZutatTyp

  constructor(id: number, name: string, typ: ZutatTyp) {
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

  createZutatBodyJSON(): ZutatBodyJSON {
    const zutatJSON = {
      id: this.getId(),
      name: this.name,
      typ: this.typ
    }
    return zutatJSON
  }
}

export enum ZutatTyp {
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

export type ZutatBodyJSON = {
  id: number,
  name: string,
  typ: ZutatTyp
}