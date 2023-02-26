import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('zutat')
export class ZutatEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  typ: string
}