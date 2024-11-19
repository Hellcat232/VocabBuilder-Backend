import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';

const PORT = Number(env('PORT', '3000'));

const server = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
  });
};

export default server;
