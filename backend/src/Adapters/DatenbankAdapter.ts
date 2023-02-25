import { DataSource } from 'typeorm';
import { RezeptEntity } from './datenbankEntities/RezeptEntity/rezept.entity';
import { ZutatEntity } from './datenbankEntities/ZutatEntity/zutat.entity';
import { RezeptZutatEntity } from './datenbankEntities/RezeptZutatEntity/rezeptZutat.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '3Q4s!Uq8KG',
  entities: [RezeptEntity, ZutatEntity, RezeptZutatEntity],
  synchronize: true
})

export async function execSql (sql: string) {
  return await dataSource.createEntityManager().query(sql)
}