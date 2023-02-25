import { RezeptEntityManager } from "../../src/Adapters/datenbankEntities/RezeptEntity/rezeptEntityManager";
import { dataSource } from "../../src/Adapters/DatenbankAdapter";
import { Rezept, Aufwand, Zutat, ZutatTyp } from 'kern-util'

const mockRezept = new Rezept(13000, 'mockRezept', Aufwand.einfach, [new Zutat(13000, 'mockZutat', ZutatTyp.sonstiges)])
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
    await rezeptEntityManager.save(mockRezept)
    expect(await rezeptEntityManager.getById(mockRezept.id)).toMatchObject({id: mockRezept.getId(), name: mockRezept.name, aufwand: mockRezept.aufwand})
  })
})