import { Column, ChildEntity } from 'typeorm';
import { Robot } from './robot.entity.js';

@ChildEntity('Flamethrower')
export class Flamethrower extends Robot {
  @Column()
  category: "Flamethrower";

  @Column()
  fuel: string;

  @Column()
  max_temperature: number;

  @Column()
  spitfire_count: number;
}
