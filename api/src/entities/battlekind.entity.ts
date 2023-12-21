import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('battlekind')
export class BattleKind extends BaseEntity {
  @PrimaryGeneratedColumn()
  type_id: number;

  @Column()
  rounds: number;

  @Column()
  time_per_round: number;

  @Column()
  timeouts: number;

  @Column()
  spontaneous: boolean;
}