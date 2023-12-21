import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('place')
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  place_id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  capacity: number;
}