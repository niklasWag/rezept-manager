import { MengenEinheit, EinheitTyp, mengenNormalisieren } from "../../abstraktion"

export class Menge {
  private _wert: number
  private _einheit: MengenEinheit
  private _typ: EinheitTyp

  constructor (wert: number, einheit: MengenEinheit) {
    this._wert = wert
    this._einheit = einheit
    this._typ = this._getTyp()
  }

  /**
   * Vergleicht zwei Mengen
   * @param {Menge} b zweite Menge mit der verglichen werden soll
   * @returns {boolean} true wenn sich die beiden Mengen in Größe und Art entsprechen
   */
  entspricht(b: Menge): boolean {
    if (this.typ !== b.typ) throw new Error(`Diese Mengen können nicht verglichen werden, da ihre Typen ${this.typ} und ${b.typ} nicht übereinstimmen`)
    const aWert = mengenNormalisieren(this.wert, this.einheit)
    const bWert = mengenNormalisieren(b.wert, b.einheit)
    return (aWert === bWert)

  }

  get wert(): number {
    return this._wert
  }

  get einheit(): MengenEinheit {
    return this._einheit
  }

  get typ(): EinheitTyp {
    return this._typ
  }

  private _getTyp(): EinheitTyp {
    switch (this._einheit) {
      case MengenEinheit.Stück:
        return EinheitTyp.Anzahl
      case MengenEinheit.g:
        return EinheitTyp.Gewicht
      case MengenEinheit.kg:
        return EinheitTyp.Gewicht
      case MengenEinheit.ml:
        return EinheitTyp.Volumen
      case MengenEinheit.l:
        return EinheitTyp.Volumen
      default:
        throw new Error(`Typ der Maßeinheit ${this.einheit} konnte nicht ermittelt werden`)
    }
  }
}