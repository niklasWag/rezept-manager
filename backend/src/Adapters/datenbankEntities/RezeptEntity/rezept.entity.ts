import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class RezeptEntity {

  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column()
  aufwand: string

}