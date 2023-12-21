import { Column, Entity , CreateDateColumn, UpdateDateColumn, PrimaryColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';

import { Team } from './team.entity.js';

@Entity('member')
export class Member extends BaseEntity {

  @PrimaryColumn()
  dni: string;

  @Column()
  fullname: string;

  @Column()
  email: string;

  @Column({
    default: false,
    nullable: true,
  })
  is_captain: boolean;

  @ManyToOne(() => Team, { nullable: true }) 
  @JoinColumn({ name: 'team_id' }) 
  team_id: Team | number;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    default: true,
    nullable: true,
  })
  active: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
