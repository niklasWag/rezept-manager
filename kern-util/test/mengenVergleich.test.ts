import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { Menge } from '../src/domain/classes/Menge'
import { MengenEinheit, EinheitTyp, mengenNormalisieren }  from '../src/abstraktion'

jest.mock('../src/abstraktion/Umrechnungen.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Test Mengen vergleichen', () => {
  it('Should return true for the same two values', () => {
    const mengeA = new Menge(10, MengenEinheit.Stück)
    const mengeB = new Menge(10, MengenEinheit.Stück)
    const mockNormalisieren = (mengenNormalisieren as jest.Mock).mockReturnValue(10)
    expect(mengeA.entspricht(mengeB)).toBe(true)
  })

  it('Should return false for Mengen with different amounts', () => {
    const mengeA = new Menge(10, MengenEinheit.g)
    const mengeB = new Menge(100, MengenEinheit.g)
    const mockNormalisieren = (mengenNormalisieren as jest.Mock).mockReturnValueOnce(10).mockReturnValueOnce(100)
    expect(mengeA.entspricht(mengeB)).toBe(false)
  })

  it('Should not compare Mengen with different types', () => {
    const mengeA = new Menge(10, MengenEinheit.kg)
    const mengeB = new Menge(10, MengenEinheit.l)
    expect(()=> {mengeA.entspricht(mengeB)}).toThrowError()
  })

})