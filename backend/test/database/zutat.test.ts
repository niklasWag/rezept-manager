import { dataSource } from "../../src/Plugins/DatenbankAdapter";
import { Lebensmittel, LebensmittelTyp } from 'kern-util'
import { LebensmittelEntityManager } from "../../src/Adapters/EntityManager/lebensmittelEntityManager";
import { DatenbankLebensmittelRepository } from "../../src/Plugins/datenbankEntities/LebensmittelEntity/DatenbankLebensmittelRepository";

const mockLebensmittel = new Lebensmittel(13000, 'mockLebensmittel', LebensmittelTyp.sonstiges)
const lebensmittelEntityManager = LebensmittelEntityManager.getInstance(DatenbankLebensmittelRepository.getInstance())

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  await dataSource.destroy()
})

describe('test lebensmittelEntityManager', () => {
  it('lebensmittel table should exist', async () => {
    expect(Array.isArray(await lebensmittelEntityManager.getAll())).toBe(true)
  })

  it('should create entities', async () => {
    const res = await lebensmittelEntityManager.save(mockLebensmittel)
    expect(typeof res).toBe('object')
    await lebensmittelEntityManager.delete(res.id)
  })

  it('should get all Lebensmittel', async () => {
    expect(Array.isArray(await lebensmittelEntityManager.getAll())).toBe(true)
  })

  it('should get Lebensmittel by id', async () => {
    const res = await lebensmittelEntityManager.save(mockLebensmittel)
    expect(typeof(await lebensmittelEntityManager.getById(res.id))).toBe('object')
    await lebensmittelEntityManager.delete(res.id)
  })

  it('should delete a Lebensmittel by id', async () => {
    const res = await lebensmittelEntityManager.save(mockLebensmittel)
    expect(await lebensmittelEntityManager.delete(res.id)).toBeTruthy()
  })
})