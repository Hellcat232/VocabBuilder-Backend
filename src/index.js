import server from './server.js';
import { initMongoDB } from './database/initMongoDB.js';

const bootstrap = async () => {
  await initMongoDB();
  server();
};

bootstrap();
