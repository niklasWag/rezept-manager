import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class ZutatEntity {

  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column()
  typ: string
}