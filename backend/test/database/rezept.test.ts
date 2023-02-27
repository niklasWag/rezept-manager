import { RezeptEntityManager } from "../../src/Adapters/datenbankEntities/RezeptEntity/rezeptEntityManager";
import { dataSource } from "../../src/Adapters/datenbankAdapter";
import { Rezept, Aufwand, Zutat, ZutatTyp, RezeptZutat, Menge, MengenEinheit } from 'kern-util'

const mockRezept = new Rezept(13000,
  'mockRezept',
  Aufwand.einfach,
  [new RezeptZutat(13000, new Zutat(13000, 'testZutat', ZutatTyp.sonstiges), new Menge(5, MengenEinheit.Stück))]
)
let id: number
const rezeptEntityManager = RezeptEntityManager.getInstance()

beforeEach(async () => {
  await dataSource.initialize()
})

afterEach(async () => {
  dataSource.destroy()
})

describe('test RezeptEntityManager', () => {
  it('rezept_entity table should exist', async () => {
    expect(Array.isArray(await rezeptEntityManager.getAll())).toBe(true)
  })

  it('should create entities', async () => {
    const res = await rezeptEntityManager.save(mockRezept)
    id = res.id
    expect(typeof res).toBe('object')
  })

  it('should get all Rezepte', async () => {
    expect(Array.isArray(await rezeptEntityManager.getAll())).toBe(true)
  })

  it('should get Rezept by id', async () => {
    expect(typeof(await rezeptEntityManager.getById(id))).toBe('object')
  })

  it('should delete a Rezept by id', async () => {
    expect(await rezeptEntityManager.delete(id)).toBeTruthy()
  })
})