import { app } from '../server';
import { Server } from 'http';
import getPort from 'get-port';
import { AddressInfo } from 'net';

export let connection: Server;

export const initializeWebServer = async (): Promise<AddressInfo> => {
  const port = await getPort();

  return new Promise((resolve, reject) => {
    connection = app.listen(port, () => {
      resolve(connection.address() as AddressInfo);
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
