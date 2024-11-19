import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import { errorHandle } from './middleware/errorHandle.js';
import { notFound } from './middleware/notFound.js';

import userRoute from './routes/user-routes.js';

const PORT = Number(env('PORT', '3000'));

const server = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api/users', userRoute);

  app.use(errorHandle);

  app.use('*', notFound);

  app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
  });
};

export default server;
