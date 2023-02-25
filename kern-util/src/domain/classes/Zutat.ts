import { Identifizierbar } from "../interfaces"

export class Zutat implements Identifizierbar {
  id: number
  name: string
  typ: ZutatTyp

  constructor(id: number, name: string, typ: ZutatTyp) {
    this.id = id
    this.name = name
    this.typ = typ
  }

  getId(): number {
    return this.id
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