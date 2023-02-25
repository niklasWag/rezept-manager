import { dataSource } from "../../src/Adapters/DatenbankAdapter";
import { Zutat, ZutatTyp } from 'kern-util'
import { ZutatEntityManager } from "../../src/Adapters/datenbankEntities/ZutatEntity/zutatEntityManager";

const mockZutat = new Zutat(13000, 'mockZutat', ZutatTyp.sonstiges)
const zutatEntityManager = ZutatEntityManager.getInstance()

beforeEach(async () => {
  await dataSource.initialize()
})

afterEach(async () => {
  dataSource.destroy()
})

describe('test zutatEntityManager', () => {
  it('rezept_entity table should exist', async () => {
    expect(Array.isArray(await zutatEntityManager.getAll())).toBe(true)
  })

  it('should create entities', async () => {
    expect(await zutatEntityManager.save(mockZutat)).toMatchObject(mockZutat)
  })

  it('should get all Rezepte', async () => {
    expect((await zutatEntityManager.getAll()).find(res => res.id === mockZutat.id)).toMatchObject(mockZutat)
  })

  it('should get Rezept by id', async () => {
    expect(await zutatEntityManager.getById(mockZutat.id)).toMatchObject(mockZutat)
  })

  it('should delete a Rezept by id', async () => {
    expect(await zutatEntityManager.delete(mockZutat.id)).toBeTruthy()
  })
})