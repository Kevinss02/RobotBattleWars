import { Column, Entity , CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BaseEntity, TableInheritance } from 'typeorm';

@Entity('robot')
@TableInheritance({ column: { type: "varchar", name: "category" } })
export class Robot extends BaseEntity {

  @PrimaryGeneratedColumn()
  robot_id: number;

  @Column()
  name: string;

  @Column()
  mobility: number;

  @Column()
  power: number;

  @Column()
  coating: number;

  @Column()
  cost: number;

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
