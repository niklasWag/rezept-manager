import { dataSource } from "../../src/Adapters/datenbankAdapter";
import { Zutat, ZutatTyp } from 'kern-util'
import { ZutatEntityManager } from "../../src/Adapters/datenbankEntities/ZutatEntity/zutatEntityManager";

const mockZutat = new Zutat(13000, 'mockZutat', ZutatTyp.sonstiges)
let id: number
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
    const res = await zutatEntityManager.save(mockZutat)
    id = res.id
    expect(typeof res).toBe('object')
  })

  it('should get all Rezepte', async () => {
    expect(Array.isArray(await zutatEntityManager.getAll())).toBe(true)
  })

  it('should get Rezept by id', async () => {
    expect(typeof(await zutatEntityManager.getById(id))).toBe('object')
  })

  it('should delete a Rezept by id', async () => {
    expect(await zutatEntityManager.delete(id)).toBeTruthy()
  })
})