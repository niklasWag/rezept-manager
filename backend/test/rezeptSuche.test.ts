import { Aufwand, Menge, MengenEinheit, Rezept, Zutat, Lebensmittel, LebensmittelTyp } from "kern-util"
import { RezeptFilter, rezeptSuchen } from "../src/Application Code/rezeptSuche"

const mockLebensmittel1 = new Lebensmittel(1, 'mockZutat1', LebensmittelTyp.sonstiges)
const mockLebensmittel2 = new Lebensmittel(2, 'mockZutat2', LebensmittelTyp.backwaren)
const mockLebensmittel3 = new Lebensmittel(3, 'mockZutat3', LebensmittelTyp.fisch)

const mockRezept1 = new Rezept(1, 'mockRezept1', Aufwand.einfach, [
    new Zutat(1, mockLebensmittel1, new Menge(1, MengenEinheit.Stück)),
    new Zutat(1, mockLebensmittel2, new Menge(2, MengenEinheit.kg))
])
const mockRezept2 = new Rezept(2, 'mockRezept2', Aufwand.mittel, [
    new Zutat(2, mockLebensmittel1, new Menge(3, MengenEinheit.l)),
    new Zutat(2, mockLebensmittel3, new Menge(300, MengenEinheit.g))
])

const mockRezepte = [mockRezept1, mockRezept2]

describe('test rezeptSuche', () => {
    it('Should return the correct result if lebensmittel and aufwand are specified', () => {
        const filter: RezeptFilter = {
            lebensmittelIds: [
                mockLebensmittel1.getId()
            ],
            aufwand: [
                'einfach'
            ]
        }
        expect(rezeptSuchen(mockRezepte, filter).includes(mockRezept1)).toBe(true)
    })

    it('Should return the correct result if only lebensmittel is specified', () => {
        const filter: RezeptFilter = {
            lebensmittelIds: [
                mockLebensmittel2.getId(),
                mockLebensmittel3.getId()
            ],
            aufwand: []
        }
        expect(rezeptSuchen(mockRezepte, filter).includes(mockRezept2)).toBe(true)
    })

    it('Should return the correct result if only aufwand is specified', () => {
        const filter: RezeptFilter = {
            lebensmittelIds: [],
            aufwand: [
                'mittel'
            ]
        }
        expect(rezeptSuchen(mockRezepte, filter).includes(mockRezept2)).toBe(true)
    })

    it('Should return all rezepte if no filter is specified', () => {
        const filter: RezeptFilter = {
            lebensmittelIds: [],
            aufwand: []
        }
        expect(rezeptSuchen(mockRezepte, filter)).toBe(mockRezepte)
    })

    it('Should return no rezept if filter is not matching any given rezept', () => {
        const filter: RezeptFilter = {
            lebensmittelIds: [],
            aufwand: [
                'schwer'
            ]
        }
        expect(rezeptSuchen(mockRezepte, filter)).toStrictEqual([])
    })
})