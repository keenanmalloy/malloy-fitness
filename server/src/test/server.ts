import { app } from '../server';
import { Server } from 'http';
import getPort from 'get-port';

export let connection: Server;

export const initializeWebServer = async () => {
  const port = await getPort();

  return new Promise((resolve, reject) => {
    connection = app.listen(port, () => {
      resolve(connection.address());
    });
  });
};

export const stopWebServer = async () => {
  return new Promise<void>((resolve, reject) => {
    connection.close(() => {
      resolve();
    });
  });
};

beforeAll(async () => {
  await initializeWebServer();
});

afterAll(async () => {
  await stopWebServer();
});
