import { DataSource } from 'typeorm';

import { PG_HOST, PG_PASSWORD, PG_PORT, PG_USERNAME } from '../config.js';
import { Battle } from '../entities/battle.entity.js';
import { BattleKind } from '../entities/battlekind.entity.js';
import { Cutter } from '../entities/cutter.entity.js';
import { Flamethrower } from '../entities/flamethrower.entity.js';
import { Hitter } from '../entities/hitter.entity.js';
import { Member } from '../entities/member.entity.js';
import { Place } from '../entities/place.entity.js';
import { Robot } from '../entities/robot.entity.js';
import { Team } from '../entities/team.entity.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: PG_HOST,
  username: PG_USERNAME,
  password: PG_PASSWORD,
  port: PG_PORT,
  database: 'robot_battle_wars',
  entities: [
    Member,
    Team,
    Robot,
    Battle,
    Place,
    BattleKind,
    Hitter,
    Flamethrower,
    Cutter,
  ],
  synchronize: false,
  logging: false,
});

export const connectDB = async function (): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL connected to', AppDataSource.options.database);
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
};
