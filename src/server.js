import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import { errorHandle } from './middleware/errorHandle.js';
import { notFound } from './middleware/notFound.js';

import userRoute from './routes/user-routes.js';
import wordsRoute from './routes/words-route.js';

const PORT = Number(env('PORT', '3000'));

const server = () => {
  const app = express();

  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.use('/api/users', userRoute);
  app.use('/api/words', wordsRoute);

  app.use(errorHandle);

  app.use('*', notFound);

  app.listen(PORT, () => {
    console.log(`Server running on PORT:${PORT}`);
  });
};

export default server;
