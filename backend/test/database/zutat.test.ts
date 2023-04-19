import { dataSource } from "../../src/Plugins/DatenbankAdapter";
import { Lebensmittel, LebensmittelTyp } from 'kern-util'
import { DatenbankLebensmittelRepository } from "../../src/Plugins/datenbankEntities/LebensmittelEntity/DatenbankLebensmittelRepository";
import { LebensmittelEntity } from "../../src/Plugins/datenbankEntities/LebensmittelEntity/lebensmittel.entity";
import { LebensmittelRecord } from "../../src/Adapters/Records/LebensmittelRecord";

const mockLebensmittel = new Lebensmittel(13000, 'mockLebensmittel', LebensmittelTyp.sonstiges)
const datenbankLebensmittelRepository = DatenbankLebensmittelRepository.getInstance(dataSource.getRepository(LebensmittelEntity))

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  await dataSource.destroy()
})

describe('test DatenbankLebensmittelRepository', () => {
  it('lebensmittel table should exist', async () => {
    expect(Array.isArray(await datenbankLebensmittelRepository.findAll())).toBe(true)
  })

  it('should create entities', async () => {
    const record: LebensmittelRecord = { id: mockLebensmittel.getId(), name: mockLebensmittel.name, typ: mockLebensmittel.typ }
    const res = await datenbankLebensmittelRepository.save(record)
    expect(typeof res).toBe('object')
    await datenbankLebensmittelRepository.delete(res.id)
  })

  it('should get all Lebensmittel', async () => {
    expect(Array.isArray(await datenbankLebensmittelRepository.findAll())).toBe(true)
  })

  it('should get Lebensmittel by id', async () => {
    const record: LebensmittelRecord = { id: mockLebensmittel.getId(), name: mockLebensmittel.name, typ: mockLebensmittel.typ }
    const res = await datenbankLebensmittelRepository.save(record)
    expect(typeof(await datenbankLebensmittelRepository.findOneByOrFail(res.id))).toBe('object')
    await datenbankLebensmittelRepository.delete(res.id)
  })

  it('should delete a Lebensmittel by id', async () => {
    const record: LebensmittelRecord = { id: mockLebensmittel.getId(), name: mockLebensmittel.name, typ: mockLebensmittel.typ }
    const res = await datenbankLebensmittelRepository.save(record)
    expect(await datenbankLebensmittelRepository.delete(res.id)).toBeTruthy()
  })
})