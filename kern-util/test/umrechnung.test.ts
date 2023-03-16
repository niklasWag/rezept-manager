import { describe, it, expect } from '@jest/globals'
import { MengenEinheit } from '../src/abstraktion/MengenEinheiten'
import { mengenNormalisieren } from '../src/abstraktion/Umrechnungen'

describe('Test Mengen Umrechnungen', () => {

  it('Should not convert "Stück"', () => {
    //found an error
    expect(mengenNormalisieren(5, MengenEinheit.Stück)).toBe(5)
  })

  it('Should not convert "g"', () => {
    expect(mengenNormalisieren(10, MengenEinheit.g)).toBe(10)
  })

  it('Should not convert "ml"', () => {
    expect(mengenNormalisieren(10, MengenEinheit.ml)).toBe(10)
  })

  it('Should convert "kg"', () => {
    expect(mengenNormalisieren(1, MengenEinheit.kg)).toBe(1000)
  })

  it('Should convert "l"', () => {
    expect(mengenNormalisieren(1, MengenEinheit.l)).toBe(1000)
  })
})