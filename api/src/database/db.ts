import mongoose from 'mongoose';

// import { DataSource } from 'typeorm';
import { MONGODB_URI } from '../config.js';

// export const AppDataSource = new DataSource({});

export const connectDB = async function (): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error(error);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongodb is connected to', mongoose.connection.db.databaseName);
});
