import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class RezeptZutatEntity {

  @PrimaryColumn()
  rezeptId: number

  @PrimaryColumn()
  zutatId: number

  @Column()
  mengeWert: number

  @Column()
  mengeEinheit: string

  @Column()
  mengeTyp: string
}