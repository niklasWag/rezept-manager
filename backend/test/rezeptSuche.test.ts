import { Aufwand, Menge, MengenEinheit, Rezept, RezeptZutat, Zutat, ZutatTyp } from "kern-util"
import { RezeptFilter, rezeptSuchen } from "../src/Application Code/rezeptSuche"

const mockZutat1 = new Zutat(1, 'mockZutat1', ZutatTyp.sonstiges)
const mockZutat2 = new Zutat(2, 'mockZutat2', ZutatTyp.backwaren)
const mockZutat3 = new Zutat(3, 'mockZutat3', ZutatTyp.fisch)

const mockRezept1 = new Rezept(1, 'mockRezept1', Aufwand.einfach, [
    new RezeptZutat(1, mockZutat1, new Menge(1, MengenEinheit.Stück)),
    new RezeptZutat(1, mockZutat2, new Menge(2, MengenEinheit.kg))
])
const mockRezept2 = new Rezept(2, 'mockRezept2', Aufwand.mittel, [
    new RezeptZutat(2, mockZutat1, new Menge(3, MengenEinheit.l)),
    new RezeptZutat(2, mockZutat3, new Menge(300, MengenEinheit.g))
])

const mockRezepte = [mockRezept1, mockRezept2]

describe('test rezeptSuche', () => {
    it('Should return the correct result if zutat and aufwand are specified', () => {
        const filter: RezeptFilter = {
            zutatenIds: [
                mockZutat1.getId()
            ],
            aufwand: [
                'einfach'
            ]
        }
        expect(rezeptSuchen(mockRezepte, filter).includes(mockRezept1)).toBe(true)
    })

    it('Should return the correct result if only zutat is specified', () => {
        const filter: RezeptFilter = {
            zutatenIds: [
                mockZutat2.getId(),
                mockZutat3.getId()
            ],
            aufwand: []
        }
        expect(rezeptSuchen(mockRezepte, filter).includes(mockRezept2)).toBe(true)
    })

    it('Should return the correct result if only aufwand is specified', () => {
        const filter: RezeptFilter = {
            zutatenIds: [],
            aufwand: [
                'mittel'
            ]
        }
        expect(rezeptSuchen(mockRezepte, filter).includes(mockRezept2)).toBe(true)
    })

    it('Should return all rezepte if no filter is specified', () => {
        const filter: RezeptFilter = {
            zutatenIds: [],
            aufwand: []
        }
        expect(rezeptSuchen(mockRezepte, filter)).toBe(mockRezepte)
    })

    it('Should return no rezept if filter is not matching any given rezept', () => {
        const filter: RezeptFilter = {
            zutatenIds: [],
            aufwand: [
                'schwer'
            ]
        }
        expect(rezeptSuchen(mockRezepte, filter)).toStrictEqual([])
    })
})