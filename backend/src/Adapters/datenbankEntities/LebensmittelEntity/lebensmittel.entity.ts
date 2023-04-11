import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('lebensmittel')
export class LebensmittelEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  typ: string
}