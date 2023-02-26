import { RezeptEntityManager } from "../../src/Adapters/datenbankEntities/RezeptEntity/rezeptEntityManager";
import { dataSource } from "../../src/Adapters/datenbankAdapter";
import { Rezept, Aufwand, Zutat, ZutatTyp } from 'kern-util'
import { RezeptEntity } from "../../src/Adapters/datenbankEntities/RezeptEntity/rezept.entity";

const mockRezept = new Rezept(13000, 'mockRezept', Aufwand.einfach, [new Zutat(13000, 'mockZutat', ZutatTyp.sonstiges)])
const expectedMockResult: RezeptEntity = {id: mockRezept.getId(), name: mockRezept.name, aufwand: mockRezept.aufwand}
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
    expect(await rezeptEntityManager.save(mockRezept)).toMatchObject(expectedMockResult)
  })

  it('should get all Rezepte', async () => {
    expect((await rezeptEntityManager.getAll()).find(res => res.id === mockRezept.id)).toMatchObject(expectedMockResult)
  })

  it('should get Rezept by id', async () => {
    expect(await rezeptEntityManager.getById(mockRezept.id)).toMatchObject(expectedMockResult)
  })

  it('should delete a Rezept by id', async () => {
    expect(await rezeptEntityManager.delete(mockRezept.id)).toBeTruthy()
  })
})