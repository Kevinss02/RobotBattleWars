import pkg from 'kanel-zod';
const { generateZodSchemas } = pkg;

/** @type {import('kanel').Config} */
export const connection = {
  host: "localhost",
  user: "postgres",
  password: "ultraball",
  database: "robot_battle_wars",
};

export const preRenderHooks = [generateZodSchemas];
export const preDeleteOutputFolder = true;
export const outputPath = "./src/schemas";
export const customTypeMap = {
  "pg_catalog.tsvector": "string",
  "pg_catalog.bpchar": "string",
};