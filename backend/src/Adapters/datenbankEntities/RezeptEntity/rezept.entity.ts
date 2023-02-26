import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('rezept')
export class RezeptEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  aufwand: string

}