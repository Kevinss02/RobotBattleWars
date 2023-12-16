import { config } from 'dotenv';

config();

export const MONGODB_URI = process.env.MONGODB_URI ?? '';

export const PORT = process.env.PORT ?? 4000;
export const HOST = process.env.HOST ?? 'http://localhost';

export const TOKEN_SECRET = process.env.TOKEN_SECRET ?? '';
