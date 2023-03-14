import { RezeptEntityManager } from "../../src/Adapters/datenbankEntities/RezeptEntity/rezeptEntityManager";
import { dataSource } from "../../src/Adapters/datenbankAdapter";
import { Rezept, Aufwand, Zutat, ZutatTyp, RezeptZutat, Menge, MengenEinheit } from 'kern-util'

const mockRezept = new Rezept(13000,
  'mockRezept',
  Aufwand.einfach,
  [new RezeptZutat(13000, new Zutat(13000, 'testZutat', ZutatTyp.sonstiges), new Menge(5, MengenEinheit.Stück))]
)

const rezeptEntityManager = RezeptEntityManager.getInstance()

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  await dataSource.destroy()
})

describe('test RezeptEntityManager', () => {
  it('rezept_entity table should exist', async () => {
    expect(Array.isArray(await rezeptEntityManager.getAll())).toBe(true)
  })

  it('should create entities', async () => {
    const res = await rezeptEntityManager.save(mockRezept)
    expect(typeof res).toBe('object')
    await rezeptEntityManager.delete(res.id)
  })

  it('should get all Rezepte', async () => {
    expect(Array.isArray(await rezeptEntityManager.getAll())).toBe(true)
  })

  it('should get Rezept by id', async () => {
    const res = await rezeptEntityManager.save(mockRezept)
    expect(typeof(await rezeptEntityManager.getById(res.id))).toBe('object')
    await rezeptEntityManager.delete(res.id)
  })

  it('should delete a Rezept by id', async () => {
    const res = await rezeptEntityManager.save(mockRezept)
    expect(await rezeptEntityManager.delete(res.id)).toBeTruthy()
  })
})