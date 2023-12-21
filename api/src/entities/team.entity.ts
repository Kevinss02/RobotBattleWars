import { OneToOne, JoinColumn, Column, Entity , CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

import { Robot } from './robot.entity.js';

@Entity('team')
export class Team extends BaseEntity {

  @PrimaryGeneratedColumn()
  team_id: number;

  @Column()
  name: string;

  @OneToOne(() => Robot, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({ name: 'robot_id' })
  robot_id: (Robot | number);


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
