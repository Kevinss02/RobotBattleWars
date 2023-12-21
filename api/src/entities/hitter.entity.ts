import { Column, ChildEntity } from 'typeorm';

import { Robot } from './robot.entity.js';

@ChildEntity('Hitter')
export class Hitter extends Robot {
  @Column()
  category: "Hitter"
  
  @Column()
  arm_material: string;

  @Column()
  joint_count: number;

  @Column()
  hitting_surface: number;

  @Column()
  hitting_force: number;
}

