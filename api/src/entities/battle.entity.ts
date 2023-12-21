import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn} from 'typeorm';
import { Team } from './team.entity.js';
import { BattleKind } from './battlekind.entity.js';
import { Place } from './place.entity.js';


@Entity('battle')
export class Battle extends BaseEntity {
  @PrimaryGeneratedColumn()
  battle_id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Place, { nullable: false })
  @JoinColumn({ name: 'place_id' })
  place_id: Place | number;

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn({ name: 'team_id1' })
  team_id1: Team | number;

  @ManyToOne(() => Team, { nullable: false })
  @JoinColumn({ name: 'team_id2' })
  team_id2: Team | number;

  @ManyToOne(() => BattleKind, { nullable: false })
  @JoinColumn({ name: 'type_id' })
  type_id: BattleKind | number;
}