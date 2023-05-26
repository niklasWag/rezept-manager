import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('zutat')
export class ZutatEntity {

  @PrimaryColumn()
  rezeptId: number

  @PrimaryColumn()
  lebensmittelId: number

  @Column()
  mengeWert: number

  @Column()
  mengeEinheit: string

  @Column()
  mengeTyp: string
}