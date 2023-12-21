import { ChildEntity, Column } from 'typeorm';
import { Robot } from './robot.entity.js';

@ChildEntity('Cutter')
export class Cutter extends Robot {
  @Column()
  category: "Cutter"

  @Column()
  rpm: number;

  @Column()
  saw_material: string;

  @Column()
  saw_count: number;
}
