import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoDB = async () => {
  try {
    const user = env('MONGODB_USER');
    const password = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    const DB = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=ClusterNodeJS`;

    await mongoose.connect(DB);

    console.log('Database connected');
  } catch (error) {
    console.log('Database can not connect', error);
    throw error;
  }
};
