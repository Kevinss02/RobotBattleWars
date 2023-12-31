import { config } from 'dotenv';

config();

export const PORT = process.env.PORT ?? 4000;
export const HOST = process.env.HOST ?? 'http://localhost';

export const PG_HOST = process.env.PG_HOST ?? 'localhost';
export const PG_USERNAME = process.env.PG_USERNAME ?? 'postgres';
export const PG_PASSWORD = process.env.PG_PASSWORD;
export const PG_PORT: number = parseInt(process.env.PG_PORT as string) ?? 5432;

export const TOKEN_SECRET = process.env.TOKEN_SECRET ?? '';
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export const ROBOT_CATEGORY = ['Cutter', 'Hitter', 'Flamethrower'] as const;
