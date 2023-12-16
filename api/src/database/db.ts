import { DataSource } from 'typeorm';

import { PG_HOST, PG_PASSWORD, PG_PORT, PG_USERNAME } from '../config.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: PG_HOST,
  username: PG_USERNAME,
  password: PG_PASSWORD,
  port: PG_PORT,
  database: 'robot_battle_wars',
  entities: [],
  synchronize: true,
  logging: true,
});

export const connectDB = async function (): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL connected to', AppDataSource.options.database);
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  }
};
