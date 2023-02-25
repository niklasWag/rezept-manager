import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class RezeptEntity {

  @PrimaryColumn()
  id: number

  @Column()
  name: string

  @Column()
  aufwand: string

  constructor(id: number, name: string, aufwand: string) {
    this.id = id
    this.name = name
    this.aufwand = aufwand
  }
}