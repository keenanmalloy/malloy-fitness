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
  process.env.DATABASE_URL =
    "postgres://myuser:myuserpassword@localhost:4444/postgres";

  request = agent(server);
});

afterAll(async () => {
  await close();
});
