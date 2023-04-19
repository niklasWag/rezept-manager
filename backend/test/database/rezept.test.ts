import { DatenbankRezeptRepository } from "../../src/Plugins/datenbankEntities/RezeptEntity/DatenbankRezeptRepository";
import { dataSource } from "../../src/Plugins/DatenbankAdapter";
import { Rezept, Aufwand, Lebensmittel, LebensmittelTyp, Zutat, Menge, MengenEinheit } from 'kern-util'
import { RezeptEntity } from "../../src/Plugins/datenbankEntities/RezeptEntity/rezept.entity";
import { RezeptRecord } from "../../src/Adapters/Records/RezeptRecord";

const mockRezept = new Rezept(13000,
  'mockRezept',
  Aufwand.einfach,
  [new Zutat(13000, new Lebensmittel(13000, 'testLebensmittel', LebensmittelTyp.sonstiges), new Menge(5, MengenEinheit.Stück))]
)

const datenbankRezeptRepository = DatenbankRezeptRepository.getInstance(dataSource.getRepository(RezeptEntity))

beforeAll(async () => {
  await dataSource.initialize()
})

afterAll(async () => {
  await dataSource.destroy()
})

describe('test DatenbankRezeptRepository', () => {
  it('rezept_entity table should exist', async () => {
    expect(Array.isArray(await datenbankRezeptRepository.findAll())).toBe(true)
  })

  it('should create entities', async () => {
    const record: RezeptRecord = {id: mockRezept.getId(), name: mockRezept.name, aufwand: mockRezept.aufwand}
    const res = await datenbankRezeptRepository.save(record)
    expect(typeof res).toBe('object')
    await datenbankRezeptRepository.delete(res.id)
  })

  it('should get all Rezepte', async () => {
    expect(Array.isArray(await datenbankRezeptRepository.findAll())).toBe(true)
  })

  it('should get Rezept by id', async () => {
    const record: RezeptRecord = {id: mockRezept.getId(), name: mockRezept.name, aufwand: mockRezept.aufwand}
    const res = await datenbankRezeptRepository.save(record)
    expect(typeof(await datenbankRezeptRepository.findOneByOrFail(res.id))).toBe('object')
    await datenbankRezeptRepository.delete(res.id)
  })

  it('should delete a Rezept by id', async () => {
    const record: RezeptRecord = {id: mockRezept.getId(), name: mockRezept.name, aufwand: mockRezept.aufwand}
    const res = await datenbankRezeptRepository.save(record)
    expect(await datenbankRezeptRepository.delete(res.id)).toBeTruthy()
  })
})