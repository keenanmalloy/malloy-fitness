import { app } from "../server";
import { SuperTest, Test, agent } from "supertest";
import { Server } from "http";
import getPort from "get-port";

export let request: SuperTest<Test>;
export let server: Server;

const start = async () => {
  server = app.listen(await getPort(), "localhost");
  request = agent(server);
};

const close = async () => {
  server.close();
};

beforeAll(async () => {
  await start();
  request = agent(server);
});

afterAll(async () => {
  await close();
});
