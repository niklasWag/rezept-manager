import { dataSource } from "../../src/Adapters/datenbankAdapter";
import { Zutat, ZutatTyp } from 'kern-util'
import { ZutatEntityManager } from "../../src/Adapters/datenbankEntities/ZutatEntity/zutatEntityManager";

const mockZutat = new Zutat(13000, 'mockZutat', ZutatTyp.sonstiges)
const zutatEntityManager = ZutatEntityManager.getInstance()

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  await dataSource.destroy()
})

describe('test zutatEntityManager', () => {
  it('rezept_entity table should exist', async () => {
    expect(Array.isArray(await zutatEntityManager.getAll())).toBe(true)
  })

  it('should create entities', async () => {
    const res = await zutatEntityManager.save(mockZutat)
    expect(typeof res).toBe('object')
    await zutatEntityManager.delete(res.id)
  })

  it('should get all Rezepte', async () => {
    expect(Array.isArray(await zutatEntityManager.getAll())).toBe(true)
  })

  it('should get Rezept by id', async () => {
    const res = await zutatEntityManager.save(mockZutat)
    expect(typeof(await zutatEntityManager.getById(res.id))).toBe('object')
    await zutatEntityManager.delete(res.id)
  })

  it('should delete a Rezept by id', async () => {
    const res = await zutatEntityManager.save(mockZutat)
    expect(await zutatEntityManager.delete(res.id)).toBeTruthy()
  })
})