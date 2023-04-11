import { DataSource } from 'typeorm';
import { RezeptEntity } from './datenbankEntities/RezeptEntity/rezept.entity';
import { LebensmittelEntity } from './datenbankEntities/LebensmittelEntity/lebensmittel.entity';
import { ZutatEntity } from './datenbankEntities/ZutatEntity/zutat.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '3Q4s!Uq8KG',
  entities: [RezeptEntity, LebensmittelEntity, ZutatEntity],
  synchronize: true
})

export async function execSql (sql: string) {
  return await dataSource.createEntityManager().query(sql)
}